import "FeedBackedCall.sol";
import "TradingAccount.sol";


contract CallSpread {

    // Contract status
    bool public         _isActive;
    bool public         _isComplete;

    // Participating addresses and accounts
    address public      _broker;
    address public      _buyer;
    address public      _seller;
    TradingAccount      _buyerAcct;
    TradingAccount      _sellerAcct;

    // Contract legs, i.e., call options
    FeedBackedCall      _buyerLeg;
    FeedBackedCall      _sellerLeg;

    // Other information
    uint public         _marginPercent;
    uint public         _maxMaturityInDays;

    function CallSpread() {
        _broker = msg.sender;
        _isActive = false;
        _isComplete = false;
    }

    function initialize(
        address seller,
        address buyer,
        address sellerLeg,
        address buyerLeg,
        uint    marginPercent) returns (bool) {

        // TODO: spawn legs directly from this contract
        _buyerLeg = FeedBackedCall(buyerLeg);
        _sellerLeg = FeedBackedCall(sellerLeg);

        // Percentage difference in value of the legs to be held in escrow
        _marginPercent = marginPercent;

        // Record the maximum maturity of the legs
        _maxMaturityInDays = _buyerLeg._maturityInDays();
        if (_maxMaturityInDays < _sellerLeg._maturityInDays()) {
            _maxMaturityInDays = _sellerLeg._maturityInDays();
        }

        // Trading accounts
        _buyer = buyer;
        _seller = seller;
        _buyerAcct = TradingAccount(buyer);
        _sellerAcct = TradingAccount(seller);

        // Authorize trading account of msg.sender
        authorizeTradingAccounts(100);
    }

    // Authorize trading accounts for margin calls
    function authorizeTradingAccounts(uint buffer) returns (bool) {

        if (msg.sender == _buyer) {
            _buyerAcct.authorize(this, _maxMaturityInDays + buffer);
            return true;
        }
        if (msg.sender  == _seller) {
            _sellerAcct.authorize(this, _maxMaturityInDays + buffer);
            return true;
        }
        return false;
    }

    // The receiver validates the contract with the same parameters
    function validate() returns (bool) {
        if (_isActive || _isComplete) {
            return true;
        }
        // Authorize trading account of msg.sender. This is assumed to be
        // the counterparty of the initializer of this contract.
        authorizeTradingAccounts(100);

        // Need authorized trading accounts
        if (!_buyerAcct.isAuthorized(this) ||
            !_sellerAcct.isAuthorized(this)) {
            return false;
        }

        // Validate the legs
        if (!_buyerLeg.validate() || !_sellerLeg.validate()) {
            return false;
        }

        _isActive = true;
        return true;
    }

    // Withdraw and nullify the contract if not validated
    function withdraw() returns (bool) {
        if (_isActive) {
            return false;
        }
        if (msg.sender != _broker
            && msg.sender != _buyer
            && msg.sender != _seller) {
            return false;
        }
        // Withdraw from both legs
        _buyerLeg.withdraw();
        _sellerLeg.withdraw();

        // suicide(_broker);
        _broker.send(this.balance);
        _isComplete = true;
        return true;
    }

    // Allow the buyer and seller to exercise their respective options
    function exercise() returns (bool) {
        bool ret;
        if (msg.sender == _seller) {
            ret = _sellerLeg.exercise();
        }
        if (msg.sender == _buyer) {
            returnMargin();
            ret = _buyerLeg.exercise();
        }

        if (_sellerLeg._isComplete() && _buyerLeg._isComplete()) {
            _isActive = false;
            _isComplete = true;
        }
        return ret;
    }

    // Rebalance the margin based on the current value of the underliers
    function rebalanceMargin() returns (bool) {
        int buyerValue = _buyerLeg.getValue();
        int sellerValue = _sellerLeg.getValue();

        uint difference = uint(buyerValue - sellerValue);
        uint marginAmount = difference * _marginPercent / 100;

        if (marginAmount > this.balance) {
            _sellerAcct.withdraw(marginAmount - this.balance);
        } else if (marginAmount < this.balance) {
            _sellerAcct.deposit.value(this.balance - marginAmount)();
        }

        return this.balance == marginAmount;
    }

    // On maturity, return the escrowed margin to the seller
    function returnMargin() returns (bool) {
        if (_buyerLeg.isMature()) {
            return _sellerAcct.deposit.value(this.balance)();
        }
        return false;
    }

    // ===== Utility functions ===== //

    function ping() returns (bool) {
        return rebalanceMargin();
    }
}
