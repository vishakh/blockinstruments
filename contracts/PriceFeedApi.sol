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
