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
		$scope.sellers_address = "0x4f23b9370f2fa06a651913f3c7f278fa8ba33dee";
		$scope.buyers_address = "0xfe50529ead3f17beb2485a2dee255f50cb7d723b";
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

		var byteCode = "60606040525b5b6111b5806100146000396000f360606040523615610095576000357c01000000000000000000000000000000000000000000000000000000009004806331e838dd14610097578063354d68f2146100cc5780633ccfd60b146101525780635157b6ca1461017557806359cc334a146101a1578063798a712a146101d65780637fec8d38146102005780638628892e14610223578063d4270d60146102a057610095565b005b6100b6600480803590602001909190803590602001909190505061042c565b6040518082815260200191505060405180910390f35b61013c60048080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506102c3565b6040518082815260200191505060405180910390f35b61015f60048050506102f6565b6040518082815260200191505060405180910390f35b61018b6004808035906020019091905050610411565b6040518082815260200191505060405180910390f35b6101c060048080359060200190919080359060200190919050506104ee565b6040518082815260200191505060405180910390f35b6101fe6004808035906020019091908035906020019091908035906020019091905050610457565b005b61020d60048050506104ff565b6040518082815260200191505060405180910390f35b61028a600480803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190505061078a565b6040518082815260200191505060405180910390f35b6102ad6004805050610645565b6040518082815260200191505060405180910390f35b60006001600060006101000a81548160ff02191690830217905550600190506102e7565b9b9a5050505050505050505050565b6000600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415806103675750600060019054906101000a900460ff165b15610375576000905061040e565b600060009054906101000a900460ff1615610393576000905061040e565b600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050506001905061040e565b90565b600e6000506020528060005260406000206000915090505481565b600f600050602052816000526040600020600050602052806000526040600020600091509150505481565b6000600e600050600085815260200190815260200160002060005054905081600f60005060008681526020019081526020016000206000506000838060010194508152602001908152602001600020600050819055506001600e60005060008681526020019081526020016000206000505401600e6000506000868152602001908152602001600020600050819055505b50505050565b6000600190506104f9565b92915050565b6000600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415806105705750600060019054906101000a900460ff165b1561057e5760009050610642565b610586610c1b565b15156105955760009050610642565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610642565b90565b6000600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415806106b65750600060019054906101000a900460ff165b156106c45760009050610787565b6106cc610c1b565b156106da5760009050610787565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610787565b90565b6000600060003373ffffffffffffffffffffffffffffffffffffffff168d73ffffffffffffffffffffffffffffffffffffffff161415806107d75750600060019054906101000a900460ff165b806107ee5750600060009054906101000a900460ff165b156107fc5760009250610c0b565b6000600060006101000a81548160ff021916908302179055506000600060016101000a81548160ff021916908302179055506108378b611103565b91506060604051908101604052808381526020018b81526020018a815260200150600a60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550604082015181600101600050559050506108c588611103565b905060606040519081016040528082815260200188815260200187815260200150600c60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055905050608060405190810160405280600a600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160005054815260200150508152602001600c600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160005054815260200150508152602001610a5987610fe5565b815260200185815260200150600160005060008201518160000160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060208201518160020160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060408201518160040160006101000a81548160ff02191690830217905550606082015181600501600050559050506060604051908101604052808e81526020018d815260200134815260200150600760005060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506040820151816002016000505590505060019250610c0b565b50509a9950505050505050505050565b6000600060006000600060009054906101000a900460ff161580610c4b5750600060019054906101000a900460ff165b15610c595760009350610fdf565b4392506000915060009050600160005060050160005054831015610c805760009350610fdf565b6000600160005060000160005060000160009054906101000a900460ff161415610cae574591508150610d68565b6001600160005060000160005060000160009054906101000a900460ff161415610cdc574491508150610d67565b6002600160005060000160005060000160009054906101000a900460ff161415610d4f57600160005060000160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163191508150610d66565b600160005060000160005060010160005054915081505b5b5b6000600160005060020160005060000160009054906101000a900460ff161415610d96574590508050610e50565b6001600160005060020160005060000160009054906101000a900460ff161415610dc4574490508050610e4f565b6002600160005060020160005060000160009054906101000a900460ff161415610e3757600160005060020160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163190508050610e4e565b600160005060020160005060010160005054905080505b5b5b8160010260405180807f6c68733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a18060010260405180807f7268733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a16002600160005060040160009054906101000a900460ff16148015610eee57508082145b80610f1a57506003600160005060040160009054906101000a900460ff16148015610f195750808214155b5b80610f4657506004600160005060040160009054906101000a900460ff16148015610f455750808211155b5b80610f7257506005600160005060040160009054906101000a900460ff16148015610f715750808210155b5b80610f9d57506000600160005060040160009054906101000a900460ff16148015610f9c57508082105b5b80610fc857506001600160005060040160009054906101000a900460ff16148015610fc757508082115b5b15610fd65760019350610fdf565b60009350610fdf565b50505090565b60007f4e4551000000000000000000000000000000000000000000000000000000000082141561101c57600390506110fe566110fd565b7f4c4551000000000000000000000000000000000000000000000000000000000082141561105157600490506110fe566110fc565b7f474551000000000000000000000000000000000000000000000000000000000082141561108657600590506110fe566110fb565b7f47540000000000000000000000000000000000000000000000000000000000008214156110bb57600190506110fe566110fa565b7f4c540000000000000000000000000000000000000000000000000000000000008214156110f057600090506110fe566110f9565b600290506110fe565b5b5b5b5b5b919050565b60007f4741534c494d495400000000000000000000000000000000000000000000000082141561113a57600090506111b0566111af565b7f444946464943554c54590000000000000000000000000000000000000000000082141561116f57600190506111b0566111ae565b7f41434342414c414e4345000000000000000000000000000000000000000000008214156111a457600290506111b0566111ad565b600390506111b0565b5b5b5b91905056";
		$scope.abiArray = [{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"items","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"},{"name":"notional","type":"uint256"}],"name":"validate","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bagItemCount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"bagId","type":"uint256"},{"name":"itemId","type":"uint256"}],"name":"getItem","outputs":[{"name":"itemVal","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"bagId","type":"uint256"},{"name":"itemId","type":"uint256"},{"name":"itemValue","type":"uint256"}],"name":"addItem","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"trigger","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"}],"name":"Initialize","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"recall","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"}];
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
