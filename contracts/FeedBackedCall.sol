import "std.sol";
import "PriceFeedApi.sol";
import "TradingAccount.sol";


contract FeedBackedCall is nameRegAware {

    // Contract status
    bool public         _isActive;
    bool public         _isComplete;

    // Participating addresses and accounts
    address public      _broker;
    address public      _buyer;
    address public      _seller;
    TradingAccount      _buyerAcct;
    TradingAccount      _sellerAcct;

    // Underlier details
    bytes32 public      _feedName;
    uint public         _strikePrice;
    uint public         _notional;
    PriceFeedApi        _underlier;

    // Maturity details
    uint public         _maturityInDays;
    uint public         _startTime;

    function FeedBackedCall() {
        _broker = msg.sender;
        _isActive = false;
        _isComplete = false;
    }

    // Initialize with participants and terms
    function initialize(
        address seller,
        address buyer,
        bytes32 providerName,
        bytes32 feedName,
        uint    strikeToMarketRatio,
        uint    notional,
        uint    maturityInDays) returns (bool) {

        // Trading accounts
        _buyer = buyer;
        _seller = seller;
        _buyerAcct = TradingAccount(buyer);
        _sellerAcct = TradingAccount(seller);

        // Authorize trading account of msg.sender
        authorizeTradingAccounts(100);

        // Real-world provider: "ether-camp/price-feed"
        _underlier = PriceFeedApi(named(providerName));
        _feedName = feedName;

        // Strike price relative to market price
        _strikePrice = (strikeToMarketRatio / 100) * _underlier.getPrice(feedName);
        _notional = notional;

        // Maturity relative to current block timestamp
        _maturityInDays = maturityInDays;
        _startTime = block.timestamp;

        return true;
    }

    // Authorize trading accounts
    function authorizeTradingAccounts(uint buffer) returns (bool) {
        if (msg.sender == _buyer) {
            _buyerAcct.authorize(this, _maturityInDays + buffer);
            return true;
        }
        if (msg.sender  == _seller) {
            _sellerAcct.authorize(this, _maturityInDays + buffer);
            return true;
        }
        return false;
    }

    // Validate the contract in order to activate it
    function validate() returns (bool) {
        if (_isActive || _isComplete) {
            return true;
        }
        // Authorize trading account of msg.sender. This is assumed to be
        // the counterparty of the initializer of this contract.
        authorizeTradingAccounts(100);

        // Need two valid trading accounts
        if (_buyer == 0 || _seller == 0 ||
            !_buyerAcct.isAuthorized(this) ||
            !_sellerAcct.isAuthorized(this)) {
            return false;
        }

        _isActive = true;
        return true;
    }

    // Withdraw and nullify the contract if not validated.
    function withdraw() returns (bool) {
        if (_isActive) {
            return false;
        }
        if (msg.sender != _broker && msg.sender != _seller) {
            return false;
        }
        // suicide(_broker);
        _broker.send(this.balance);
        _isComplete = true;
        return true;
    }

    // On maturity, allow the buyer to exercise the option
    function exercise() returns (bool) {
        if (msg.sender != _buyer) {
            return false;
        }
        if (!isMature()) {
            return false;
        }

        // The broker mops up any unclaimed balance
        _broker.send(this.balance);

        // Buyer claims the underlier at the strike price
        _buyerAcct.withdraw(_strikePrice * _notional);
        _sellerAcct.deposit.value(this.balance)();

        // Seller provides the underlier at the spot price
        uint spotPrice = _underlier.getPrice(_feedName);
        _sellerAcct.withdraw(spotPrice * _notional);
        _buyerAcct.deposit.value(this.balance)();

        _isActive = false;
        _isComplete = true;
        return true;
    }

    // ===== Utility functions ===== //

    function isMature() returns (bool) {
        uint timeElapsedInSecs = block.timestamp - _startTime;
        uint timeElapsedInDays = timeElapsedInSecs / 86400;
        if (timeElapsedInDays >= _maturityInDays) {
            return true;
        } else {
            return false;
        }
    }

    function getMoneyness() returns (int) {
        uint spotPrice = _underlier.getPrice(_feedName);
        if (spotPrice < _strikePrice) {
            return -1;
        } else if (spotPrice > _strikePrice) {
            return 1;
        } else {
            return 0;
        }
    }
}
