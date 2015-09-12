angular.module('dapp', [])
    .controller('mainController', function ($scope, $http) {
        var web3 = require('web3');
		web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

		var byteCode = "60606040525b5b610d82806100156000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900480633ccfd60b146100655780636901f668146100865780637fec8d38146100a75780638628892e146100c8578063d4270d601461012557610063565b005b61007060045061057a565b6040518082815260200191505060405180910390f35b61009160045061056c565b6040518082815260200191505060405180910390f35b6100b2600450610658565b6040518082815260200191505060405180910390f35b61010f600480359060200180359060200180359060200180359060200180359060200180359060200180359060200180359060200180359060200180359060200150610146565b6040518082815260200191505060405180910390f35b610130600450610721565b6040518082815260200191505060405180910390f35b6000600060006000600060006101000a81548160ff021916908302179055506000600060016101000a81548160ff021916908302179055506101878b610907565b91506060604051908101604052808381526020018b81526020018a815260200150600b60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506040820151816001016000505590505061021588610907565b905060606040519081016040528082815260200188815260200187815260200150600d60005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506040820151816001016000505590505061010060405190810160405280600b600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160005054815260200150508152602001600d600050606060405190810160405290816000820160009054906101000a900460ff1681526020016000820160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160018201600050548152602001505081526020016103aa876107e9565b815260200185815260200150600160005060008201518160000160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060208201518160020160005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160005055505060408201518160040160006101000a81548160ff02191690830217905550606082015181600501600050559050506060604051908101604052808e81526020018d815260200134815260200150600760005060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550604082015181600201600050559050506001925061055c565b50509a9950505050505050505050565b600060019050610577565b90565b6000600060009054906101000a900460ff161561059a5760009050610655565b600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050505060019050610655565b90565b60006106626109b9565b1515610671576000905061071e565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050506001905061071e565b90565b600061072b6109b9565b1561073957600090506107e6565b6000600060006101000a81548160ff021916908302179055506001600060016101000a81548160ff02191690830217905550600760005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f1935050505050600190506107e6565b90565b60007f4e45510000000000000000000000000000000000000000000000000000000000821415610820576003905061090256610901565b7f4c45510000000000000000000000000000000000000000000000000000000000821415610855576004905061090256610900565b7f474551000000000000000000000000000000000000000000000000000000000082141561088a5760059050610902566108ff565b7f47540000000000000000000000000000000000000000000000000000000000008214156108bf5760019050610902566108fe565b7f4c540000000000000000000000000000000000000000000000000000000000008214156108f45760009050610902566108fd565b60029050610902565b5b5b5b5b5b919050565b60007f4741534c494d495400000000000000000000000000000000000000000000000082141561093e57600090506109b4566109b3565b7f444946464943554c54590000000000000000000000000000000000000000000082141561097357600190506109b4566109b2565b7f41434342414c414e4345000000000000000000000000000000000000000000008214156109a857600290506109b4566109b1565b600390506109b4565b5b5b5b919050565b6000600060006000600060009054906101000a900460ff1615806109e95750600060019054906101000a900460ff165b156109f75760009350610d7c565b4392506000915060009050600160005060050160005054831015610a1e5760009350610d7c565b6000600160005060000160005060000160009054906101000a900460ff161415610a4c574591508150610b06565b6001600160005060000160005060000160009054906101000a900460ff161415610a7a574491508150610b05565b6002600160005060000160005060000160009054906101000a900460ff161415610aed57600160005060000160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163191508150610b04565b600160005060000160005060010160005054915081505b5b5b6000600160005060020160005060000160009054906101000a900460ff161415610b34574590508050610bee565b6001600160005060020160005060000160009054906101000a900460ff161415610b62574490508050610bed565b6002600160005060020160005060000160009054906101000a900460ff161415610bd557600160005060020160005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163190508050610bec565b600160005060020160005060010160005054905080505b5b5b8160010260405180807f6c68733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a18060010260405180807f7268733a20000000000000000000000000000000000000000000000000000000815260200150600501905060405180910390a16002600160005060040160009054906101000a900460ff16148015610c8c57508082145b80610cb757506003600160005060040160009054906101000a900460ff16148015610cb657508082145b5b80610ce357506004600160005060040160009054906101000a900460ff16148015610ce25750808211155b5b80610d0f57506005600160005060040160009054906101000a900460ff16148015610d0e5750808210155b5b80610d3a57506000600160005060040160009054906101000a900460ff16148015610d3957508082105b5b80610d6557506001600160005060040160009054906101000a900460ff16148015610d6457508082115b5b15610d735760019350610d7c565b60009350610d7c565b5050509056";
		var abiArray = [{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"validate","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"trigger","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"lhsUnderlierType","type":"bytes32"},{"name":"lhsUnderlierAddress","type":"address"},{"name":"lhsUnderlierValue","type":"uint256"},{"name":"rhsUnderlierType","type":"bytes32"},{"name":"rhsUnderlierAddress","type":"address"},{"name":"rhsUnderlierValue","type":"uint256"},{"name":"operator","type":"bytes32"},{"name":"maturity","type":"uint256"}],"name":"Initialize","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"recall","outputs":[{"name":"val","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"}];
		$scope.coinbase = web3.eth.coinbase;

        $scope.getBalance = function (addr) {
        	$scope.addressInput = {};
            $scope.balance = web3.eth.getBalance(addr).toNumber();
        };

        $scope.getBlock = function (blockNum) {
            $scope.blockInput = {};
            $scope.block = web3.eth.getBlock(blockNum);
        };

        $scope.createContract = function (contractInput) {
            $scope.contractInput = {};
            var MyContract = web3.eth.contract(abiArray);
            $scope.myContractInstance = MyContract.new(
                                            contractInput.senderAddr,
            								contractInput.receiverAddr, 
									        contractInput.lhsUnderlierType, 
									        contractInput.lhsUnderlierAddress,
									        contractInput.lhsUnderlierValue,
									        contractInput.rhsUnderlierType, 
									        contractInput.rhsUnderlierAddress,
									        contractInput.rhsUnderlierValue,
									        contractInput.operator, 
									        contractInput.maturity,
									        { data: byteCode, gas: 3000000, from: contractInput.senderAddr }
									    );
        };

        $scope.sendTransaction = function (trans) {
        	console.log(trans);
        };

    });