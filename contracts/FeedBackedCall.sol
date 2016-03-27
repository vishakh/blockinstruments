import "std.sol";
import "Loggable.sol";
import "PriceFeedApi.sol";
import "TradingAccount.sol";


contract FeedBackedCall is owned, nameRegAware, loggable {

    // Contract status
    bool public         _isActive;
    bool public         _isComplete;

    // Participating addresses and accounts
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
        _isActive = false;
        _isComplete = false;
    }

    // Initialize with participants and terms
    function initialize(
        address sellerAcct,
        address buyerAcct,
        address feedProvider,
        bytes32 feedName,
        uint    strikePctOfMarketValue,
        uint    notional,
        uint    timeToMaturity) returns (bool) {

        // Trading accounts
        _buyerAcct = TradingAccount(buyerAcct);
        _buyer = _buyerAcct._owner();
        _sellerAcct = TradingAccount(sellerAcct);
        _seller = _sellerAcct._owner();

        // Underlier feed defaults to "ether-camp/price-feed"
        if (feedProvider == 0) {
            _underlier = PriceFeedApi(named("ether-camp/price-feed"));
        } else {
            _underlier = PriceFeedApi(feedProvider);
        }
        _feedName = feedName;

        // Strike price defined relative to market price
        _strikePrice =  getSpotPrice() * strikePctOfMarketValue / 100;
        _notional = notional;

        // Maturity relative to current timestamp and denominated in minutes
        _timeToMaturity = timeToMaturity;
        _startTime = block.timestamp;

        // Authorize trading account of caller
        authorizeTradingAccounts(_timeToMaturity * 3);

        return true;
    }

    // Authorize trading accounts for settlement
    function authorizeTradingAccounts(uint buffer) returns (bool) {
        bool buyerAuthed = true;
        bool sellerAuthed = true;

        if (initiatedBy(_buyer)) {
            buyerAuthed = _buyerAcct.authorize(this,
                                               _timeToMaturity + buffer);
            Authorization(address(_buyerAcct),
                          toText(buyerAuthed));
        }
        if (initiatedBy(_seller)) {
            sellerAuthed = _sellerAcct.authorize(this,
                                                 _timeToMaturity + buffer);
            Authorization(address(_sellerAcct),
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
        // Authorize trading account of caller. This is assumed to be
        // the counterparty of the initializer of this contract.
        authorizeTradingAccounts(_timeToMaturity * 3);

        // Need authorized trading accounts
        if (!_buyerAcct.isAuthorized(this) ||
            !_sellerAcct.isAuthorized(this)) {
            Error("Validation requires authorized trading accounts");
            return false;
        }

        _isActive = true;
        Validation(address(this),
                   toText(true));
        return true;
    }

    // Withdraw and nullify the contract if not validated
    function withdraw() returns (bool) {
        if (_isActive) {
            Error("Withdrawal requires inactive contract");
            return false;
        }
        if (initiatedBy(_buyer) || initiatedBy(_seller)) {
            Error("Withdrawal must be initiated by participant");
            return false;
        }
        // suicide(_owner);
        _owner.send(this.balance);
        _isComplete = true;
        Withdrawal(address(this),
                   toText(true));
        return true;
    }

    // On maturity, allow the buyer to exercise the option
    function exercise() returns (bool) {
        if (!initiatedBy(_buyer)) {
            Error("Exercise must be initiated by buyer");
            return false;
        }
        if (!isMature()) {
            Error("Exercise requires maturity");
            return false;
        }

        // The contract owner first mops up any unclaimed balance
        if (this.balance > 0) {
            CashFlow(address(this),
                     _owner,
                     this.balance);
            _owner.send(this.balance);
        }

        // Buyer claims the underlier at the strike price
        _buyerAcct.withdraw(_strikePrice * _notional);
        CashFlow(address(_buyerAcct),
                 address(_sellerAcct),
                 this.balance);
        _sellerAcct.deposit.value(this.balance)();

        // Seller provides the underlier at the spot price
        _sellerAcct.withdraw(getSpotPrice() * _notional);
        CashFlow(address(_sellerAcct),
                 address(_buyerAcct),
                 this.balance);
        _buyerAcct.deposit.value(this.balance)();

        _isActive = false;
        _isComplete = true;
        Exercise(address(this),
                 toText(true));
        return true;
    }

    // ===== Utility functions ===== //

    function isMature() returns (bool) {
        uint timeElapsed = block.timestamp - _startTime;
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

    function initiatedBy(address addr) private returns (bool) {
        return msg.sender == addr ||
               (tx.origin == addr && msg.sender == _owner);
    }
}
