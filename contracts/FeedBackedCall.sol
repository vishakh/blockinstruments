import "std.sol";
import "Loggable.sol";
import "PriceFeedApi.sol";
import "TradingAccount.sol";


contract FeedBackedCall is nameRegAware, Loggable {

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

    // Maturity condition
    uint public         _timeToMaturity;
    uint public         _startTime;

    function FeedBackedCall() {
        _broker = msg.sender;
        _isActive = false;
        _isComplete = false;
    }

    // Initialize with participants and terms
    function initialize(
        address sellerAcct,
        address buyerAcct,
        address feedProvider,
        bytes32 feedName,
        uint    strikeToMarketRatioPct,
        uint    notional,
        uint    timeToMaturity) returns (bool) {

        // Trading accounts
        _buyerAcct = TradingAccount(buyerAcct);
        _buyer = _buyerAcct._owner();
        _sellerAcct = TradingAccount(sellerAcct);
        _seller = _sellerAcct._owner();

        // Authorize trading account of msg.sender
        authorizeTradingAccounts(_timeToMaturity * 3);

        // Underlier feed defaults to "ether-camp/price-feed"
        if (feedProvider == 0) {
            _underlier = PriceFeedApi(named("ether-camp/price-feed"));
        } else {
            _underlier = PriceFeedApi(feedProvider);
        }
        _feedName = feedName;

        // Strike price defined relative to market price
        _strikePrice =  getSpotPrice() * strikeToMarketRatioPct / 100;
        _notional = notional;

        // Maturity relative to current timestamp and denominated in minutes
        _timeToMaturity = timeToMaturity;
        _startTime = block.timestamp;

        return true;
    }

    // Authorize trading accounts for settlement
    function authorizeTradingAccounts(uint buffer) returns (bool) {
        bool buyerAuthed = true;
        bool sellerAuthed = true;

        if (msg.sender == _buyer) {
            buyerAuthed = _buyerAcct.authorize(this,
                                               _timeToMaturity + buffer);
            Authorization(bytes32(address(_buyerAcct)),
                          toText(buyerAuthed));
        }
        if (msg.sender  == _seller) {
            sellerAuthed = _sellerAcct.authorize(this,
                                                 _timeToMaturity + buffer);
            Authorization(bytes32(address(_sellerAcct)),
                          toText(sellerAuthed));
        }
        return (buyerAuthed && sellerAuthed);
    }

    // Validate the contract in order to activate it
    function validate() returns (bool) {
        if (_isActive || _isComplete) {
            Error("Validation requires inactive contract");
            return true;
        }
        // Authorize trading account of msg.sender. This is assumed to be
        // the counterparty of the initializer of this contract.
        authorizeTradingAccounts(_timeToMaturity * 3);

        // Need authorized trading accounts
        if (!_buyerAcct.isAuthorized(this) ||
            !_sellerAcct.isAuthorized(this)) {
            Error("Validation requires authorized trading accounts");
            return false;
        }

        _isActive = true;
        Validation(bytes32(address(this)),
                   toText(true));
        return true;
    }

    // Withdraw and nullify the contract if not validated
    function withdraw() returns (bool) {
        if (_isActive) {
            Error("Withdrawal requires inactive contract");
            return false;
        }
        if (msg.sender != _broker
            && msg.sender != _buyer
            && msg.sender != _seller) {
            Error("Withdrawal must be initiated by participant");
            return false;
        }
        // suicide(_broker);
        _broker.send(this.balance);
        _isComplete = true;
        Withdrawal(bytes32(address(this)),
                   toText(true));
        return true;
    }

    // On maturity, allow the buyer to exercise the option
    function exercise() returns (bool) {
        if (msg.sender != _buyer) {
            Error("Exercise must be initiated by buyer");
            return false;
        }
        if (!isMature()) {
            Error("Exercise requires maturity");
            return false;
        }

        // The broker first mops up any unclaimed balance
        if (this.balance > 0) {
            CashFlow(bytes32(address(this)),
                     bytes32(_broker),
                     bytes32(this.balance));
        }
        _broker.send(this.balance);

        // Buyer claims the underlier at the strike price
        _buyerAcct.withdraw(_strikePrice * _notional);
        CashFlow(bytes32(address(_buyerAcct)),
                 bytes32(address(_sellerAcct)),
                 bytes32(this.balance));
        _sellerAcct.deposit.value(this.balance)();

        // Seller provides the underlier at the spot price
        _sellerAcct.withdraw(getSpotPrice() * _notional);
        CashFlow(bytes32(address(_sellerAcct)),
                 bytes32(address(_buyerAcct)),
                 bytes32(this.balance));
        _buyerAcct.deposit.value(this.balance)();

        _isActive = false;
        _isComplete = true;
        Exercise(bytes32(address(this)),
                 toText(true));
        return true;
    }

    // ===== Utility functions ===== //

    function isMature() returns (bool) {
        uint timeElapsed = (block.timestamp - _startTime) / 60;
        if (timeElapsed >= _timeToMaturity) {
            return true;
        } else {
            return false;
        }
    }

    function getMoneyness() returns (int) {
        uint spotPrice = getSpotPrice();
        if (spotPrice < _strikePrice) {
            return -1;
        } else if (spotPrice > _strikePrice) {
            return 1;
        } else {
            return 0;
        }
    }

    function getSpotPrice() returns (uint) {
        return _underlier.getPrice(_feedName);
    }

    function getValue() returns (int) {
        return (int(getSpotPrice()) - int(_strikePrice)) * int(_notional);
    }
}
