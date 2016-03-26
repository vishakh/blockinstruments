#!/usr/bin/env bash
solc --gas --abi --bin std.sol Loggable.sol TradingAccount.sol FeedBackedCall.sol CallSpread.sol RandomizedPriceFeedApi.sol | tee /tmp/solc.txt