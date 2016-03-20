import "std.sol";
import "Loggable.sol";
import "FeedBackedCall.sol";
import "TradingAccount.sol";


contract CallSpread is owned, loggable {

    // Contract status
    bool public             _isActive;
    bool public             _isComplete;

    // Participating addresses and accounts
    address public          _buyer;
    address public          _seller;
    TradingAccount          _buyerAcct;
    TradingAccount          _sellerAcct;

    // Contract legs, i.e., call options
    FeedBackedCall public   _buyerLeg;
    FeedBackedCall public   _sellerLeg;

    // Other information
    uint public             _marginPct;
    uint public             _maxTimeToMaturity;

    function CallSpread() {
        _isActive = false;
        _isComplete = false;
    }

    function initialize(
        address sellerAcct,
        address buyerAcct,
        address sellerLeg,
        address buyerLeg,
        address feedProvider,
        bytes32 feedName,
        uint    sellerStrikePctOfMarketValue,
        uint    buyerStrikePctOfMarketValue,
        uint    notional,
        uint    timeToMaturity,
        uint    marginPct) returns (bool) {

        // Spawn mirrored call options with the same underlier and notional
        // NOTE: disabled because of gas cost
        // _sellerLeg = new FeedBackedCall();
        _sellerLeg = FeedBackedCall(sellerLeg);
        _sellerLeg.claim();
        _sellerLeg.initialize(sellerAcct, buyerAcct, feedProvider, feedName,
                              sellerStrikePctOfMarketValue, notional,
                              timeToMaturity);
        // _buyerLeg = new FeedBackedCall();
        _buyerLeg = FeedBackedCall(buyerLeg);
        _buyerLeg.claim();
        _buyerLeg.initialize(buyerAcct, sellerAcct, feedProvider, feedName,
                             buyerStrikePctOfMarketValue, notional,
                             timeToMaturity);

        // Percentage difference in value of the legs to be held in escrow
        _marginPct = marginPct;

        // Record the maximum maturity of the legs
        _maxTimeToMaturity = _buyerLeg._timeToMaturity();
        if (_maxTimeToMaturity < _sellerLeg._timeToMaturity()) {
            _maxTimeToMaturity = _sellerLeg._timeToMaturity();
        }

        // Trading accounts
        _buyerAcct = TradingAccount(buyerAcct);
        _buyer = _buyerAcct._owner();
        _sellerAcct = TradingAccount(sellerAcct);
        _seller = _sellerAcct._owner();

        // Authorize trading account of caller
        authorizeTradingAccounts(_maxTimeToMaturity * 3);
    }

    // Authorize trading accounts for margin calls
    function authorizeTradingAccounts(uint buffer) returns (bool) {
        bool buyerAuthed = true;
        bool sellerAuthed = true;

        if (initiatedBy(_buyer)) {
            buyerAuthed = _buyerAcct.authorize(this,
                                               _maxTimeToMaturity + buffer);
            Authorization(address(_buyerAcct),
                          toText(buyerAuthed));
        }
        if (initiatedBy(_seller)) {
            sellerAuthed = _sellerAcct.authorize(this,
                                                 _maxTimeToMaturity + buffer);
            Authorization(address(_sellerAcct),
                          toText(sellerAuthed));
        }
        return (buyerAuthed && sellerAuthed);
    }

    // The receiver validates the contract with the same parameters
    function validate() returns (bool) {
        if (_isActive || _isComplete) {
            Error("Validation requires inactive contract");
            return true;
        }
        // Authorize trading account of caller. This is assumed to be
        // the counterparty of the initializer of this contract.
        authorizeTradingAccounts(_maxTimeToMaturity * 3);

        // Need authorized trading accounts
        if (!_buyerAcct.isAuthorized(this) ||
            !_sellerAcct.isAuthorized(this)) {
            Error("Validation requires authorized trading accounts");
            return false;
        }

        // Validate the legs
//        if (!_buyerLeg.validate() || !_sellerLeg.validate()) {
//            return false;
//        }

        bool buyerValidated = _buyerLeg.validate();
        Validation(address(_buyerLeg),
                   toText(buyerValidated));
        if (!buyerValidated) {
            Error("Validation requires validated buyer leg");
            return false;
        }

        bool sellerValidated = _sellerLeg.validate();
        Validation(address(_sellerLeg),
                   toText(sellerValidated));
        if (!sellerValidated) {
            Error("Validation requires validated seller leg");
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
        // Withdraw from both legs
        bool buyerWithdrawn = _buyerLeg.withdraw();
        Withdrawal(address(_buyerLeg),
                   toText(buyerWithdrawn));

        bool sellerWithdrawn = _sellerLeg.withdraw();
        Withdrawal(address(_sellerLeg),
                   toText(sellerWithdrawn));

        // suicide(_owner);
        _owner.send(this.balance);
        _isComplete = true;
        Withdrawal(address(this),
                   toText(true));
        return true;
    }

    // Allow the buyer and seller to exercise their respective options
    function exercise() returns (bool) {
        bool buyerExercised = true;
        bool sellerExercised = true;

        if (initiatedBy(_buyer)) {
            returnMargin();
            buyerExercised = _buyerLeg.exercise();
            Exercise(address(_buyerLeg),
                     toText(buyerExercised));
        }
        if (initiatedBy(_seller)) {
            sellerExercised = _sellerLeg.exercise();
            Exercise(address(_sellerLeg),
                     toText(sellerExercised));
        }

        if (_sellerLeg._isComplete() && _buyerLeg._isComplete()) {
            _isActive = false;
            _isComplete = true;
            Exercise(address(this),
                     toText(true));
        }
        return (buyerExercised && sellerExercised);
    }

    // Rebalance the margin based on the current value of the underliers
    function rebalanceMargin() returns (bool) {
        int buyerValue = _buyerLeg.getValue();
        int sellerValue = _sellerLeg.getValue();

        uint difference = uint(buyerValue - sellerValue);
        uint marginAmount = difference * _marginPct / 100;

        if (marginAmount > this.balance) {
            CashFlow(address(_sellerAcct),
                     address(this),
                     marginAmount - this.balance);
            _sellerAcct.withdraw(marginAmount - this.balance);
        } else if (marginAmount < this.balance) {
            CashFlow(address(this),
                     address(_sellerAcct),
                     this.balance - marginAmount);
            _sellerAcct.deposit.value(this.balance - marginAmount)();
        }

        return this.balance == marginAmount;
    }

    // On maturity, return the escrowed margin to the seller
    function returnMargin() returns (bool) {
        if (_buyerLeg.isMature()) {
            CashFlow(address(this),
                     address(_sellerAcct),
                     this.balance);
            return _sellerAcct.deposit.value(this.balance)();
        }
        return false;
    }

    // ===== Utility functions ===== //

    function ping() returns (bool) {
        return rebalanceMargin();
    }

    function getSellerOption() returns (address) {
        return address(_sellerLeg);
    }

    function getBuyerOption() returns (address) {
        return address(_buyerLeg);
    }

    function initiatedBy(address addr) private returns (bool) {
        return msg.sender == addr ||
               (tx.origin == addr && msg.sender == _owner);
    }
}
