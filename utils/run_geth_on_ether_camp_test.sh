#!/usr/bin/env bash
geth --bootnodes="enode://9bcff30ea776ebd28a9424d0ac7aa500d372f918445788f45a807d83186bd52c4c0afaf504d77e2077e5a99f1f264f75f8738646c1ac3673ccc652b65565c3bb@45.55.204.106:30303" --networkid=161 --genesis=/home/vishakh/dev/ether.camp_testnet.json --datadir /media/vishakh/data/cryptos/ether.camp_testnet/ --rpc --rpcport 56000 --rpccorsdomain "*" --port 1337 console


