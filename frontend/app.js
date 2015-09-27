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
		$scope.gasprice = web3.fromWei(web3.eth.gasPrice, 'ether') + " ETH";

		//parameters
		$scope.sellers_address = "0x4f23b9370f2fa06a651913f3c7f278fa8ba33dee";
		$scope.buyers_address = "0xe2553a57c54e4a98cfad1e698948f1ab68379580";
		$scope.contract_address = "0xa6a2048e6e899ccc07d8840e942e30250f16d62a";
		$scope.contractInput = { lhsUnderlierType: "ACCBALANCE", lhsUnderlierAddress: "0x4f23b9370f2fa06a651913f3c7f278fa8ba33dee", lhsUnderlierValue: "0", rhsUnderlierType: "SCALAR", rhsUnderlierAddress: "0x4f23b9370f2fa06a651913f3c7f278fa8ba33dee", rhsUnderlierValue: "1000000000000", operator: "EQ", maturity: "24520" };

		var byteCode = "60606040525b5b610d9a806100146000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480633ccfd60b146100655780636901f668146100865780637fec8d38146100a75780638628892e146100c8578063d4270d601461012557610063565b005b610070600450610592565b6040518082815260200191505060405180910390f35b61009160045061056b565b6040518082815260200191505060405180910390f35b6100b2600450610670565b6040518082815260200191505060405180910390f35b61010f600480359060200180359060200180359060200180359060200180359060200180359060200180359060200180359060200180359060200180359060200150610146565b6040518082815260200191505060405180910390f35b610130600450610739565b6040518082815260200191505060405180910390f35b6000600060006000600060006101000a81548160ff021916908302179055506000600060016101000a81548160ff021916908302179055506101878b61091f565b91506060604051908101604052808381526020018b81526020018a815260200150600b60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550604082015181600101600050559050506102158861091f565b905060606040519081016040528082815260200188815260200187815260200150600d60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055905050608060405190810160405280600b600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160005054815260200150508152602001600d600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160018201600050548152602001505081526020016103a987610801565b815260200185815260200150600160005060008201518160000160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060208201518160020160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060408201518160040160006101000a81548160ff02191690830217905550606082015181600501600050559050506060604051908101604052808e81526020018d815260200134815260200150600760005060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550604082015181600201600050559050506001925061055b565b50509a9950505050505050505050565b60006001600060006101000a81548160ff021916908302179055506001905061058f565b90565b6000600060009054906101000a900460ff16156105b2576000905061066d565b600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050506001905061066d565b90565b600061067a6109d1565b15156106895760009050610736565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610736565b90565b60006107436109d1565b1561075157600090506107fe565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f1935050505050600190506107fe565b90565b60007f4e45510000000000000000000000000000000000000000000000000000000000821415610838576003905061091a56610919565b7f4c4551000000000000000000000000000000000000000000000000000000000082141561086d576004905061091a56610918565b7f47455100000000000000000000000000000000000000000000000000000000008214156108a2576005905061091a56610917565b7f47540000000000000000000000000000000000000000000000000000000000008214156108d7576001905061091a56610916565b7f4c5400000000000000000000000000000000000000000000000000000000000082141561090c576000905061091a56610915565b6002905061091a565b5b5b5b5b5b919050565b60007f4741534c494d495400000000000000000000000000000000000000000000000082141561095657600090506109cc566109cb565b7f444946464943554c54590000000000000000000000000000000000000000000082141561098b57600190506109cc566109ca565b7f41434342414c414e4345000000000000000000000000000000000000000000008214156109c057600290506109cc566109c9565b600390506109cc565b5b5b5b919050565b6000600060006000600060009054906101000a900460ff161580610a015750600060019054906101000a900460ff165b15610a0f5760009350610d94565b4392506000915060009050600160005060050160005054831015610a365760009350610d94565b6000600160005060000160005060000160009054906101000a900460ff161415610a64574591508150610b1e565b6001600160005060000160005060000160009054906101000a900460ff161415610a92574491508150610b1d565b6002600160005060000160005060000160009054906101000a900460ff161415610b0557600160005060000160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163191508150610b1c565b600160005060000160005060010160005054915081505b5b5b6000600160005060020160005060000160009054906101000a900460ff161415610b4c574590508050610c06565b6001600160005060020160005060000160009054906101000a900460ff161415610b7a574490508050610c05565b6002600160005060020160005060000160009054906101000a900460ff161415610bed57600160005060020160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163190508050610c04565b600160005060020160005060010160005054905080505b5b5b8160010260405180807f6c68733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a18060010260405180807f7268733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a16002600160005060040160009054906101000a900460ff16148015610ca457508082145b80610ccf57506003600160005060040160009054906101000a900460ff16148015610cce57508082145b5b80610cfb57506004600160005060040160009054906101000a900460ff16148015610cfa5750808211155b5b80610d2757506005600160005060040160009054906101000a900460ff16148015610d265750808210155b5b80610d5257506000600160005060040160009054906101000a900460ff16148015610d5157508082105b5b80610d7d57506001600160005060040160009054906101000a900460ff16148015610d7c57508082115b5b15610d8b5760019350610d94565b60009350610d94565b5050509056";
		$scope.abiArray = [{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"validate","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"trigger","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"}],"name":"Initialize","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"recall","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"}];
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
					   gas: 1000000,
					   from: sellers_address}, function(err, myContract){
					    if(!err) {
					       // NOTE: The callback will fire twice!
					       // Once the contract has the transactionHash property set and once its deployed on an address.

					       // e.g. check tx hash on the first call (transaction send)
					       if(!myContract.address) {
						   	console.log("Got tx hash.") // The hash of the transaction, which deploys the contract
						    console.log(myContract.transactionHash);
							$scope.tx_hash = myContract.transactionHash;
					       // check address on the second call (contract deployed)
					       } else {
							   console.log("Got contract address") // the contract address
							   console.log(myContract.address);
							   $scope.contract_address = myContract.address;
							   console.log(myContract);
							   console.log("createContract() is done.");
					       }

					       // Note that the returned "myContractReturned" === "myContract",
					       // so the returned "myContractReturned" object will also get the address set.
					    }
					else
						{
							console.log(err);
							console.log("createContract() is done.");
						}
					  });

			/*var myContractInstance = MyContract.new({
				data: byteCode,
				gas: 1000000,
				from: sellers_address});

			$scope.tx_hash = myContractInstance.transactionHash;
			$scope.contract_address = myContractInstance.address;
			console.log(myContractInstance);*/
        };

        $scope.testGas = function (addr) {
            $scope.gas = web3.eth.estimateGas({ to: addr, data: byteCode });
        };

		$scope.initializeContract = function(contractInput) {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.Initialize.sendTransaction(
				$scope.sellers_address,
				$scope.buyers_address,
				contractInput.lhsUnderlierType,
				contractInput.lhsUnderlierAddress,
				contractInput.lhsUnderlierValue,
				contractInput.rhsUnderlierType,
				contractInput.rhsUnderlierAddress,
				contractInput.rhsUnderlierValue,
				contractInput.operator,
				contractInput.maturity,{from: $scope.sellers_address, value: 1000, gas: 2000000});
			console.log(result);
			//result = web3.eth.sendTransaction({from: $scope.sellers_address, to: $scope.contract_address, value: web3.toWei(1, "ether")});
			//console.log(result);
		}

		$scope.validate = function() {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.validate.sendTransaction({from: $scope.sellers_address, value: 1, gas: 2000000});
			console.log(result);
			$scope.validated = result;
		}

		$scope.withdraw = function() {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.withdraw.sendTransaction({from: $scope.sellers_address, value: 1, gas: 2000000});
			console.log(result);
			$scope.withdrawn = result;
		}

		$scope.trigger = function() {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.trigger.sendTransaction({from: $scope.sellers_address, value: 1, gas: 2000000});
			console.log(result);
			$scope.triggered = result;
		}

		$scope.recall = function() {
			var MyContract = web3.eth.contract($scope.abiArray);
			var myContractInstance = MyContract.at($scope.contract_address);
			var result = myContractInstance.recall.sendTransaction({from: $scope.sellers_address, to: $scope.contract_address, gas: 2000000});
			console.log(result);
			$scope.recalled = result;
			//result = web3.eth.sendTransaction({from: $scope.sellers_address, to: $scope.contract_address, value: web3.toWei(1, "ether")});
			//console.log(result);

		}

		$scope.refeshState = function() {
			$scope.coinbase = web3.eth.getCoinbase();
			$scope.blocknumber = web3.eth.blockNumber;
			$scope.hashrate = web3.eth.hashrate;
			$scope.gasprice = web3.eth.gasPrice;
		}

    });
