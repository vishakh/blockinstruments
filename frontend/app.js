angular.module('dapp', [])
    .controller('mainController', function ($scope, $http) {

        var web3 = require('web3');
		web3.setProvider(new web3.providers.HttpProvider('http://localhost:56000'));

		//state
		$scope.defaultAccount = web3.eth.defaultAccount;
		var accounts = web3.eth.accounts;
		var balances = [];
		for(var i =0; i < accounts.length; i++)
		{
			balances.push(web3.fromWei(web3.eth.getBalance(accounts[i])));
		}
		$scope.accounts = accounts;
		$scope.balances = balances;
		$scope.blocknumber = web3.eth.blockNumber;
		$scope.difficulty = web3.eth.getBlock(120421).difficulty;
		$scope.gasprice = web3.fromWei(web3.eth.gasPrice, 'ether') + " ETH";

		//parameters
		$scope.sellers_address = "0xcfe479123aa3555a24260d2fc8691dcf3bdb18d9";
		$scope.buyers_address = "0xe2553a57c54e4a98cfad1e698948f1ab68379580";
		$scope.contract_address = "c82ac056b6b95f1be64ef691fbe41e53cd5a9a81";
		$scope.contractInput = {
            lhsUnderlierType: "DIFFICULTY",
            lhsUnderlierAddress: "0x4f23b9370f2fa06a651913f3c7f278fa8ba33dee",
            lhsUnderlierValue: "0",
            rhsUnderlierType: "SCALAR",
            rhsUnderlierAddress: "0x4f23b9370f2fa06a651913f3c7f278fa8ba33dee",
            rhsUnderlierValue: "1527975",
            operator: "GEQ",
            maturity: "120750",
            notional: 1000};
        $scope.bcontractInput = $scope.contractInput;

		var byteCode = "60606040525b5b6113df806100146000396000f36060604052361561007f576000357c0100000000000000000000000000000000000000000000000000000000900480631817835814610081578063354d68f2146100a45780633ccfd60b1461012a5780635c36b1861461014d5780637fec8d38146101705780638628892e14610193578063d4270d60146102105761007f565b005b61008e6004805050610d43565b6040518082815260200191505060405180910390f35b610114600480803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190505061068d565b6040518082815260200191505060405180910390f35b6101376004805050610ba0565b6040518082815260200191505060405180910390f35b61015a6004805050610e37565b6040518082815260200191505060405180910390f35b61017d6004805050610c5c565b6040518082815260200191505060405180910390f35b6101fa6004808035906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091905050610233565b6040518082815260200191505060405180910390f35b61021d6004805050610d51565b6040518082815260200191505060405180910390f35b600060006000600060019054906101000a900460ff16806102605750600060009054906101000a900460ff165b1561026e576000925061067d565b6000600060006101000a81548160ff021916908302179055506000600060016101000a81548160ff021916908302179055506102a98b610f63565b91506060604051908101604052808381526020018b81526020018a815260200150600a60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506040820151816001016000505590505061033788610f63565b905060606040519081016040528082815260200188815260200187815260200150600c60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055905050608060405190810160405280600a600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160005054815260200150508152602001600c600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160018201600050548152602001505081526020016104cb87610e45565b815260200185815260200150600160005060008201518160000160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060208201518160020160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060408201518160040160006101000a81548160ff02191690830217905550606082015181600501600050559050506060604051908101604052808e81526020018d815260200134815260200150600760005060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550604082015181600201600050559050506001925061067d565b50509a9950505050505050505050565b6000600060019054906101000a900460ff16156106ad5760009050610b91565b8b73ffffffffffffffffffffffffffffffffffffffff16600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614158061076457508a73ffffffffffffffffffffffffffffffffffffffff16600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b156107725760009050610b91565b7f666f6f320000000000000000000000000000000000000000000000000000000060405180807f3200000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a16107d58a610f63565b600160005060000160005060000160009054906101000a900460ff1614158061085857508873ffffffffffffffffffffffffffffffffffffffff16600160005060000160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b8061087457508760016000506000016000506001016000505414155b156108825760009050610b91565b7f666f6f330000000000000000000000000000000000000000000000000000000060405180807f3300000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a16108e587610f63565b600160005060020160005060000160009054906101000a900460ff1614158061096857508573ffffffffffffffffffffffffffffffffffffffff16600160005060020160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b8061098457508460016000506002016000506001016000505414155b156109925760009050610b91565b7f666f6f340000000000000000000000000000000000000000000000000000000060405180807f3400000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a16109f584610e45565b600160005060040160009054906101000a900460ff16141515610a1b5760009050610b91565b7f666f6f350000000000000000000000000000000000000000000000000000000060405180807f3500000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a182600160005060050160005054141515610a925760009050610b91565b7f666f6f360000000000000000000000000000000000000000000000000000000060405180807f3600000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a1813073ffffffffffffffffffffffffffffffffffffffff1631141515610b155760009050610b91565b7f666f6f370000000000000000000000000000000000000000000000000000000060405180807f3700000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a16001600060006101000a81548160ff0219169083021790555060019050610b91565b9b9a5050505050505050505050565b6000600060019054906101000a900460ff1615610bc05760009050610c59565b600060009054906101000a900460ff1615610bde5760009050610c59565b600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610c59565b90565b6000600060019054906101000a900460ff1615610c7c5760009050610d40565b610c84611015565b1515610c935760009050610d40565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610d40565b90565b600060019050610d4e565b90565b6000600060019054906101000a900460ff1615610d715760009050610e34565b610d79611015565b15610d875760009050610e34565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610e34565b90565b600060019050610e42565b90565b60007f4e45510000000000000000000000000000000000000000000000000000000000821415610e7c5760039050610f5e56610f5d565b7f4c45510000000000000000000000000000000000000000000000000000000000821415610eb15760049050610f5e56610f5c565b7f4745510000000000000000000000000000000000000000000000000000000000821415610ee65760059050610f5e56610f5b565b7f4754000000000000000000000000000000000000000000000000000000000000821415610f1b5760019050610f5e56610f5a565b7f4c54000000000000000000000000000000000000000000000000000000000000821415610f505760009050610f5e56610f59565b60029050610f5e565b5b5b5b5b5b919050565b60007f4741534c494d4954000000000000000000000000000000000000000000000000821415610f9a57600090506110105661100f565b7f444946464943554c545900000000000000000000000000000000000000000000821415610fcf57600190506110105661100e565b7f41434342414c414e43450000000000000000000000000000000000000000000082141561100457600290506110105661100d565b60039050611010565b5b5b5b919050565b6000600060006000600060009054906101000a900460ff1615806110455750600060019054906101000a900460ff165b1561105357600093506113d9565b439250600091506000905060016000506005016000505483101561107a57600093506113d9565b6000600160005060000160005060000160009054906101000a900460ff1614156110a8574591508150611162565b6001600160005060000160005060000160009054906101000a900460ff1614156110d6574491508150611161565b6002600160005060000160005060000160009054906101000a900460ff16141561114957600160005060000160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163191508150611160565b600160005060000160005060010160005054915081505b5b5b6000600160005060020160005060000160009054906101000a900460ff16141561119057459050805061124a565b6001600160005060020160005060000160009054906101000a900460ff1614156111be574490508050611249565b6002600160005060020160005060000160009054906101000a900460ff16141561123157600160005060020160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163190508050611248565b600160005060020160005060010160005054905080505b5b5b8160010260405180807f6c68733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a18060010260405180807f7268733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a16002600160005060040160009054906101000a900460ff161480156112e857508082145b8061131457506003600160005060040160009054906101000a900460ff161480156113135750808214155b5b8061134057506004600160005060040160009054906101000a900460ff1614801561133f5750808211155b5b8061136c57506005600160005060040160009054906101000a900460ff1614801561136b5750808210155b5b8061139757506000600160005060040160009054906101000a900460ff1614801561139657508082105b5b806113c257506001600160005060040160009054906101000a900460ff161480156113c157508082115b5b156113d057600193506113d9565b600093506113d9565b5050509056";
		$scope.abiArray = [{"constant":false,"inputs":[],"name":"poke","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"},{"name":"notional","type":"uint256"}],"name":"validate","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"ping","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"trigger","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"}],"name":"Initialize","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"recall","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"}];
        $scope.coinbase = web3.eth.coinbase;

        $scope.getBalance = function (addr) {
			console.log("Get balance." + addr);
        	$scope.addressInput = {};
			var balanceInWei = web3.eth.getBalance(addr).toNumber();
            $scope.balance = web3.fromWei(balanceInWei, 'ether');
        };

        $scope.getBlock = function (blockNum) {
            $scope.blockInput = {};
            $scope.block = web3.eth.getBlock(blockNum);
        };

        $scope.createContract = function (sellers_address) {
            var MyContract = web3.eth.contract($scope.abiArray);

			$scope.myContractInstance = MyContract.new({
					   data: byteCode,
					   gas: 2000000,
					   from: sellers_address}, function(err, myContract){
					    if(!err) {
					       if(!myContract.address) {
						   	console.log("Got tx hash.");
						    console.log(myContract.transactionHash);
							$scope.tx_hash = myContract.transactionHash;
					       } else {
							   console.log("Got contract address") // the contract address
							   console.log(myContract.address);
							   $scope.contract_address = myContract.address;
							   console.log(myContract);
							   console.log("createContract() is done.");
					       }
					    }
					else
						{
							console.log(err);
							console.log("createContract() is done.");
						}
					  });
        };

        $scope.testGas = function (addr) {
            $scope.gas = web3.eth.estimateGas({ to: addr, data: byteCode });
        };

		$scope.initializeContract = function(contractInput) {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.Initialize.call(
				$scope.sellers_address,
				$scope.buyers_address,
				contractInput.lhsUnderlierType,
				contractInput.lhsUnderlierAddress,
				contractInput.lhsUnderlierValue,
				contractInput.rhsUnderlierType,
				contractInput.rhsUnderlierAddress,
				contractInput.rhsUnderlierValue,
				contractInput.operator,
				contractInput.maturity,
                {from: $scope.sellers_address, value: 1000, gas: 2000000},
                function(err, result){
                        console.log("error: " + err);
                        console.log("result: "+ result)
                        console.log("Call is done.");
                    }
                );

            result = myContractInstance.Initialize.sendTransaction(
                $scope.sellers_address,
                $scope.buyers_address,
                contractInput.lhsUnderlierType,
                contractInput.lhsUnderlierAddress,
                contractInput.lhsUnderlierValue,
                contractInput.rhsUnderlierType,
                contractInput.rhsUnderlierAddress,
                contractInput.rhsUnderlierValue,
                contractInput.operator,
                contractInput.maturity,
                {from: $scope.sellers_address, value: 1000, gas: 2000000},
                function(err, result){
                    console.log("error: " + err);
                    console.log("result: "+ result)
                    console.log("Transaction is done.");
                }
            );

			console.log("****");
		}

		$scope.validate = function(contractInput) {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.validate.call(
                $scope.sellers_address,
                $scope.buyers_address,
                contractInput.lhsUnderlierType,
                contractInput.lhsUnderlierAddress,
                contractInput.lhsUnderlierValue,
                contractInput.rhsUnderlierType,
                contractInput.rhsUnderlierAddress,
                contractInput.rhsUnderlierValue,
                contractInput.operator,
                contractInput.maturity,
                contractInput.notional,
                {from: $scope.buyers_address, value: 0, gas: 2000000},
                function(err, result) {
                    console.log("error: " + err);
                    console.log("result: " + result);
                    console.log("Call is done.");
                }
            );
            result = myContractInstance.validate.sendTransaction(
                $scope.sellers_address,
                $scope.buyers_address,
                contractInput.lhsUnderlierType,
                contractInput.lhsUnderlierAddress,
                contractInput.lhsUnderlierValue,
                contractInput.rhsUnderlierType,
                contractInput.rhsUnderlierAddress,
                contractInput.rhsUnderlierValue,
                contractInput.operator,
                contractInput.maturity,
                contractInput.notional,
                {from: $scope.buyers_address, value: 0, gas: 2000000},
                function(err, result) {
                    console.log("error: " + err);
                    console.log("result: " + result);
                    console.log("Transaction is done.");
                }
            );
			console.log("****");
			$scope.validated = result;
		}

		$scope.withdraw = function() {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.withdraw.call(
                {from: $scope.sellers_address, value: 0, gas: 2000000},
                function(err, result){
                    console.log("error: " + err);
                    console.log("result: "+ result)
                    console.log("Call is done.");
                }
            );

            myContractInstance.withdraw.sendTransaction(
                {from: $scope.sellers_address, value: 0, gas: 2000000},
                function(err, result){
                    console.log("error: " + err);
                    console.log("result: "+ result)
                    console.log("Transaction is done.");
                }
            );

			console.log("****");
			$scope.withdrawn = result;
		}

		$scope.trigger = function() {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.trigger.call(
                {from: $scope.buyers_address, value: 0, gas: 2000000},
                function(err, result){
                    console.log("error: " + err);
                    console.log("result: "+ result)
                    console.log("Call is done.");
                }
            );

            result = myContractInstance.trigger.sendTransaction(
                {from: $scope.buyers_address, value: 0, gas: 2000000},
                function(err, result){
                    console.log("error: " + err);
                    console.log("result: "+ result)
                    console.log("Transaction is done.");
                }
            );

			console.log("****");
			$scope.triggered = result;
		}

		$scope.recall = function() {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.recall.call(
                {from: $scope.sellers_address, to: $scope.contract_address, gas: 2000000},
                function(err, result){
                    console.log("error: " + err);
                    console.log("result: "+ result)
                    console.log("Call is done.");
                }
            );

            result = myContractInstance.recall.sendTransaction(
                {from: $scope.sellers_address, to: $scope.contract_address, gas: 2000000},
                function(err, result){
                    console.log("error: " + err);
                    console.log("result: "+ result)
                    console.log("Transaction is done.");
                }
            );
			console.log("****");
			$scope.recalled = result;

		}


		$scope.refeshState = function() {
			$scope.coinbase = web3.eth.getCoinbase();
			$scope.blocknumber = web3.eth.blockNumber;
			$scope.hashrate = web3.eth.hashrate;
			$scope.gasprice = web3.eth.gasPrice;
		}

    });
