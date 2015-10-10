import "std.sol";

contract FeedBackedCall is nameRegAware {

    struct StrikeCondition {
        bytes32     feedName;       // feed to get prices
        uint        strikePrice;    // strike price
        uint        maturityInDays; // number of days till maturity
        uint        startTime;      // time stamp to begin counting from
    }

    struct OneToOneTransaction {
        address     sender;         // person putting up the stake
        address     receiver;       // person who stands to gain the stake
        uint        value;          // stake
    }

    // State variables
    bool                _isActive;
    bool                _isComplete;
    PriceFeedApi        _priceFeed;
    OneToOneTransaction _transaction;
    StrikeCondition     _condition;

    function FeedBackedCall(){}

    function initialize(
        address sender,
        address receiver,
        bytes32 feedName,
        uint    multiplier,
        uint    maturityInDays) returns (bool val) {

        _isActive = false;
        _isComplete = false;

        _priceFeed = PriceFeedApi(named("ether-camp/price-feed"));
        uint spotPrice = _priceFeed.getPrice(feedName);

        _condition = StrikeCondition(feedName,
                                     (multiplier / 100) * spotPrice,
                                     maturityInDays,
                                     block.timestamp);
        _transaction = OneToOneTransaction(sender,
                                           receiver,
                                           msg.value);

        return true;
    }

    // The receiver validates the contract with the same parameters
    function validate() returns (bool val) {

        // Disabling validation until compound conditions are implemented.
        // Life is too cumbersome otherwise.

        _isActive == true;
        return true;
    }

    // If not validated, allow sender to withdraw
    function withdraw() returns (bool val) {
        if(_isActive) {
            return false;
        }
        // suicide(_transaction.sender);
        _transaction.sender.send(this.balance);
        _isComplete = true;
        return true;
    }

    // If condition is met on maturity, allow receiver to claim from escrow
    function trigger() returns (bool val) {
        if (!isConditionMet()) {
            return false;
        }
        _transaction.receiver.send(this.balance);
        _isActive = false;
        _isComplete = true;
        return true;
    }

    // If condition is not met on maturity, allow sender to reclaim from escrow
    function recall() returns (bool val) {
        if (isConditionMet()) {
            return false;
        }
        _transaction.sender.send(this.balance);
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
        if (_priceFeed.getPrice(_condition.feedName) >= _condition.strikePrice) {
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
