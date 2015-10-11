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

		var byteCode = "60606040525b5b611361806100146000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063354d68f2146100655780633ccfd60b146100eb5780637fec8d381461010e5780638628892e14610131578063d4270d60146101ae57610063565b005b6100d5600480803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190505061062b565b6040518082815260200191505060405180910390f35b6100f86004805050610b3e565b6040518082815260200191505060405180910390f35b61011b6004805050610bfa565b6040518082815260200191505060405180910390f35b61019860048080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506101d1565b6040518082815260200191505060405180910390f35b6101bb6004805050610ce1565b6040518082815260200191505060405180910390f35b600060006000600060019054906101000a900460ff16806101fe5750600060009054906101000a900460ff165b1561020c576000925061061b565b6000600060006101000a81548160ff021916908302179055506000600060016101000a81548160ff021916908302179055506102478b610ee5565b91506060604051908101604052808381526020018b81526020018a815260200150600a60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550604082015181600101600050559050506102d588610ee5565b905060606040519081016040528082815260200188815260200187815260200150600c60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055905050608060405190810160405280600a600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160005054815260200150508152602001600c600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600182016000505481526020015050815260200161046987610dc7565b815260200185815260200150600160005060008201518160000160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060208201518160020160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060408201518160040160006101000a81548160ff02191690830217905550606082015181600501600050559050506060604051908101604052808e81526020018d815260200134815260200150600760005060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550604082015181600201600050559050506001925061061b565b50509a9950505050505050505050565b6000600060019054906101000a900460ff161561064b5760009050610b2f565b8b73ffffffffffffffffffffffffffffffffffffffff16600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614158061070257508a73ffffffffffffffffffffffffffffffffffffffff16600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b156107105760009050610b2f565b7f666f6f320000000000000000000000000000000000000000000000000000000060405180807f3200000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a16107738a610ee5565b600160005060000160005060000160009054906101000a900460ff161415806107f657508873ffffffffffffffffffffffffffffffffffffffff16600160005060000160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b8061081257508760016000506000016000506001016000505414155b156108205760009050610b2f565b7f666f6f330000000000000000000000000000000000000000000000000000000060405180807f3300000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a161088387610ee5565b600160005060020160005060000160009054906101000a900460ff1614158061090657508573ffffffffffffffffffffffffffffffffffffffff16600160005060020160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b8061092257508460016000506002016000506001016000505414155b156109305760009050610b2f565b7f666f6f340000000000000000000000000000000000000000000000000000000060405180807f3400000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a161099384610dc7565b600160005060040160009054906101000a900460ff161415156109b95760009050610b2f565b7f666f6f350000000000000000000000000000000000000000000000000000000060405180807f3500000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a182600160005060050160005054141515610a305760009050610b2f565b7f666f6f360000000000000000000000000000000000000000000000000000000060405180807f3600000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a1813073ffffffffffffffffffffffffffffffffffffffff1631141515610ab35760009050610b2f565b7f666f6f370000000000000000000000000000000000000000000000000000000060405180807f3700000000000000000000000000000000000000000000000000000000000000815260200150600101905060405180910390a16001600060006101000a81548160ff0219169083021790555060019050610b2f565b9b9a5050505050505050505050565b6000600060019054906101000a900460ff1615610b5e5760009050610bf7565b600060009054906101000a900460ff1615610b7c5760009050610bf7565b600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610bf7565b90565b6000600060019054906101000a900460ff1615610c1a5760009050610cde565b610c22610f97565b1515610c315760009050610cde565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610cde565b90565b6000600060019054906101000a900460ff1615610d015760009050610dc4565b610d09610f97565b15610d175760009050610dc4565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610dc4565b90565b60007f4e45510000000000000000000000000000000000000000000000000000000000821415610dfe5760039050610ee056610edf565b7f4c45510000000000000000000000000000000000000000000000000000000000821415610e335760049050610ee056610ede565b7f4745510000000000000000000000000000000000000000000000000000000000821415610e685760059050610ee056610edd565b7f4754000000000000000000000000000000000000000000000000000000000000821415610e9d5760019050610ee056610edc565b7f4c54000000000000000000000000000000000000000000000000000000000000821415610ed25760009050610ee056610edb565b60029050610ee0565b5b5b5b5b5b919050565b60007f4741534c494d4954000000000000000000000000000000000000000000000000821415610f1c5760009050610f9256610f91565b7f444946464943554c545900000000000000000000000000000000000000000000821415610f515760019050610f9256610f90565b7f41434342414c414e434500000000000000000000000000000000000000000000821415610f865760029050610f9256610f8f565b60039050610f92565b5b5b5b919050565b6000600060006000600060009054906101000a900460ff161580610fc75750600060019054906101000a900460ff165b15610fd5576000935061135b565b4392506000915060009050600160005060050160005054831015610ffc576000935061135b565b6000600160005060000160005060000160009054906101000a900460ff16141561102a5745915081506110e4565b6001600160005060000160005060000160009054906101000a900460ff1614156110585744915081506110e3565b6002600160005060000160005060000160009054906101000a900460ff1614156110cb57600160005060000160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1631915081506110e2565b600160005060000160005060010160005054915081505b5b5b6000600160005060020160005060000160009054906101000a900460ff1614156111125745905080506111cc565b6001600160005060020160005060000160009054906101000a900460ff1614156111405744905080506111cb565b6002600160005060020160005060000160009054906101000a900460ff1614156111b357600160005060020160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1631905080506111ca565b600160005060020160005060010160005054905080505b5b5b8160010260405180807f6c68733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a18060010260405180807f7268733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a16002600160005060040160009054906101000a900460ff1614801561126a57508082145b8061129657506003600160005060040160009054906101000a900460ff161480156112955750808214155b5b806112c257506004600160005060040160009054906101000a900460ff161480156112c15750808211155b5b806112ee57506005600160005060040160009054906101000a900460ff161480156112ed5750808210155b5b8061131957506000600160005060040160009054906101000a900460ff1614801561131857508082105b5b8061134457506001600160005060040160009054906101000a900460ff1614801561134357508082115b5b15611352576001935061135b565b6000935061135b565b5050509056";
		$scope.abiArray = [{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"},{"name":"notional","type":"uint256"}],"name":"validate","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"trigger","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"}],"name":"Initialize","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"recall","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"}];
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
