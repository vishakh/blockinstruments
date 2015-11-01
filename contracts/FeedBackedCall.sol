import "std.sol";
import "TradingAccount.sol";


contract PriceFeedApi {
    // block time when the prices were last updated
    uint public updateTime;

    // returns the price of an asset
    // the price is represented as uint: (double price) * 1000000
    function getPrice(bytes32 symbol) returns(uint currPrice);

    // returns the timestamp of the latest price for an asset
    // normally this is the exchange timestamp, but if exchange
    // doesn't supply such info the latest data retrieval time is returned
    function getTimestamp(bytes32 symbol) returns(uint timestamp);
}


// Feed names:
// USD_ETH  (ETH/USD)
// BTC_ETH  (BTC/ETH)
// USDT_BTC (USD/BTC)
// EURUSD   (EUR/USD)
// GBPUSD   (GBP/USD)
// USDJPY   (USD/JPY)
// XAUUSD   (Gold)
// XAGUSD   (Silver)
// SP500    (S&P 500)
// NASDAQ   (NASDAQ)
// AAPL     (Apple)
// GOOG     (Google)
// MSFT     (Microsoft)
// GM       (General Motors)
// GE       (General Electric)
// WMT      (Walmart)
// F        (Ford Motor)
// T        (AT&T)


contract FeedBackedCall is nameRegAware {

    struct StrikeCondition {
        bytes32     feedName;       // feed to get prices
        uint        strikePrice;    // strike price
        uint        maturityInDays; // number of days till maturity
        uint        startTime;      // time stamp to begin counting from
    }

    // Contract status
    bool                _isActive;
    bool                _isComplete;

    // Participating accounts and addresses
    address             _broker;
    address             _buyer;
    TradingAccount      _buyerAcct;
    address             _seller;
    TradingAccount      _sellerAcct;

    // Condition and underlier
    PriceFeedApi        _underlier;
    StrikeCondition     _condition;
    uint                _notional;

    function FeedBackedCall() {
        _broker = msg.sender;
    }

    // Initialize with participants and condition
    function initialize(
        address seller,
        address buyer,
        bytes32 feedName,
        uint    notional,
        uint    strikeToMarketRatio,
        uint    maturityInDays) returns (bool) {

        _isActive = false;
        _isComplete = false;

        // Trading accounts
        _buyer = buyer;
        _buyerAcct = TradingAccount(buyer);
        _seller = seller;
        _sellerAcct = TradingAccount(seller);

        // If the broker is also the seller, authorize their trading account
        // for twice the maturity period
        authorizeTradingAccounts(maturityInDays);

        _underlier = PriceFeedApi(named("ether-camp/price-feed"));
        uint marketPrice = _underlier.getPrice(feedName);
        uint strikePrice = (strikeToMarketRatio / 100) * marketPrice;

        _condition = StrikeCondition(feedName,
                                     strikePrice,
                                     maturityInDays,
                                     block.timestamp);
        _notional = notional;

        return true;
    }

    // Authorize trading accounts
    function authorizeTradingAccounts(uint buffer) returns (bool) {
        if (msg.sender == _buyer) {
            _buyerAcct.authorize(this, _condition.maturityInDays + buffer);
            return true;
        }
        if (msg.sender  == _seller) {
            _sellerAcct.authorize(this, _condition.maturityInDays + buffer);
            return true;
        }
        return false;
    }

    // Any party can validate the contract
    function validate() returns (bool) {
        if (_isActive || _isComplete) {
            return true;
        }
        // Need valid trading accounts
        if (_seller == 0 || !_sellerAcct.isAuthorized(this)) {
            return false;
        }
        // TODO: allow exercise of out of the money options
        // if (_buyer == 0 || !_buyerAcct.isAuthorized(this)) {
        //     return false;
        // }
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

    // If condition is met on maturity, allow the buyer to exercise the option
    function exercise() returns (bool) {
        if (msg.sender != _buyer) {
            return false;
        }
        // TODO: allow exercise of out of the money options
        if (!isConditionMet()) {
            return false;
        }
        // Transfer the difference
        int spotPrice = int(_underlier.getPrice(_condition.feedName));
        int difference = spotPrice - int(_condition.strikePrice);
        if (difference < 0) {
            return false;
        }
        _sellerAcct.withdraw(uint(difference) * _notional);
        _buyerAcct.send(this.balance); // TODO: .deposit() if authorized

        _isActive = false;
        _isComplete = true;
        return true;
    }

    // ===== Utility functions ===== //

    function isMature() private returns (bool) {
        uint timeElapsedInSecs = block.timestamp - _condition.startTime;
        uint timeElapsedInDays = timeElapsedInSecs / 86400;
        if (timeElapsedInDays >= _condition.maturityInDays) {
            return true;
        } else {
            return false;
        }
    }

    function isAtOrInTheMoney() private returns (bool) {
        if (_underlier.getPrice(_condition.feedName) >= _condition.strikePrice) {
            return true;
        } else {
            return false;
        }
    }

    function isConditionMet() private returns (bool) {
        if (isMature() && isAtOrInTheMoney()) {
            return true;
        } else {
            return false;
        }
    }
}
