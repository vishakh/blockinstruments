import "PriceFeedApi.sol";

contract RandomizedPriceFeedApi is PriceFeedApi {

    // Timestamp when the prices were last updated.
    uint public _lastUpdateTime;

    mapping(bytes32 => uint)    _prices;
    mapping(bytes32 => uint)    _timestamps;

    function RandomizedPriceFeedApi() {
        _prices['USD_ETH']  = 673478;
        _prices['BTC_ETH']  = 2189;
        _prices['USDT_BTC'] = 285000000;
        _prices['EURUSD']   = 1102100;
        _prices['GBPUSD']   = 1531500;
        _prices['USDJPY']   = 121180000;
        _prices['XAUUSD']   = 1162880000;
        _prices['XAGUSD']   = 15818000;
        _prices['SP500']    = 2075150000;
        _prices['NASDAQ']   = 2147483647;
        _prices['AAPL']     = 119080000;
        _prices['GOOG']     = 702000000;
        _prices['MSFT']     = 52870000;
        _prices['GM']       = 35950000;
        _prices['WMT']      = 58300000;
        _prices['F']        = 15670000;
        _prices['T']        = 33740000;

        _timestamps['USD_ETH']  = block.timestamp;
        _timestamps['BTC_ETH']  = block.timestamp;
        _timestamps['USDT_BTC'] = block.timestamp;
        _timestamps['EURUSD']   = block.timestamp;
        _timestamps['GBPUSD']   = block.timestamp;
        _timestamps['USDJPY']   = block.timestamp;
        _timestamps['XAUUSD']   = block.timestamp;
        _timestamps['XAGUSD']   = block.timestamp;
        _timestamps['SP500']    = block.timestamp;
        _timestamps['NASDAQ']   = block.timestamp;
        _timestamps['AAPL']     = block.timestamp;
        _timestamps['GOOG']     = block.timestamp;
        _timestamps['MSFT']     = block.timestamp;
        _timestamps['GM']       = block.timestamp;
        _timestamps['WMT']      = block.timestamp;
        _timestamps['F']        = block.timestamp;
        _timestamps['T']        = block.timestamp;

        _lastUpdateTime = block.timestamp;
    }

    // Returns the price of an asset, represented as an uint equal to
    // (double price) * 1000000
    function getPrice(bytes32 symbol) returns(uint currPrice) {
        return _prices[symbol];
    }

    // Returns the timestamp of the latest price for an asset.
    // Normally this is the exchange timestamp, but if the exchange
    // doesn't supply such info the latest data retrieval time is returned.
    function getTimestamp(bytes32 symbol) returns (uint timestamp) {
        return _timestamps[symbol];
    }

    // Randomly modify the price for a given symbol.
    function perturb(bytes32 symbol) returns(bool) {
        uint price = _prices[symbol];
        uint shift = price / 10;
        if (block.number % 2 == 0) {
            price = price + shift;
        } else {
            price = price - shift;
        }

        _prices[symbol] = price;
        _timestamps[symbol] = block.timestamp;
        _lastUpdateTime = block.timestamp;
        return true;
    }

    // Lets an external agent randomly perturb values as desired.
    function ping() returns (bool) {
        return perturb("USD_ETH");
    }
}
