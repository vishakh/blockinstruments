contract Instrument {

    //state variables
    bool                _isActive;
    bool                _isComplete;
    
    //parameters
    SimplePremise       _premise;
    OneToOneTransaction _transaction;
    
    //Hack variables to get around struct instantiation issues.
    Underlier           _underlier1;
    Underlier           _underlier2;
    
    enum UnderlierType { gasLimit, difficulty, accountBalance, scalar }
    
    struct Underlier {
        UnderlierType   utype;
        address         addressValue;
        uint            scalarValue;
    }
    
    enum Operator { LT, GT, EQ, NEQ, LEQ, GEQ }

    struct SimplePremise {
        Underlier   lhs;  // something being bet on
        Underlier   rhs;
        Operator    operator;   // equality or inequality
        uint        maturity;   // block number to use as maturity
    }
    
    struct OneToOneTransaction {
        address     sender;     // the person placing the bet
        address     receiver;   // the person taking the bet
        uint        value;      // the stake
    }
    
    function Instrument(){}
    
    //The sender constructs the contract
    // Funds
    // Senders address
    // Receivers address
    // 
    function Initialize(
        address sender, 
        address receiver, 
        bytes32 lhsUnderlierType, 
        address lhsUnderlierAddress,
        uint    lhsUnderlierValue,
        bytes32 rhsUnderlierType, 
        address rhsUnderlierAddress,
        uint    rhsUnderlierValue,
        bytes32 operator, 
        uint maturity) returns (bool val)
    {
        //if(sender != msg.sender)
        //{
        //    return false;
        //}
        
        if(_isComplete || _isActive)
            return false;

        _isActive = false;
        _isComplete = false;
        
        //lhs
        UnderlierType parsedUnderlierType = strToUnderlierType(lhsUnderlierType);
        _underlier1 = Underlier(parsedUnderlierType, lhsUnderlierAddress, lhsUnderlierValue);
        
        //rhs
        UnderlierType parsedUnderlierType2 = strToUnderlierType(rhsUnderlierType);
        _underlier2 = Underlier(parsedUnderlierType2, rhsUnderlierAddress, rhsUnderlierValue);
        
        _premise = SimplePremise(_underlier1, _underlier2, strToOperator(operator), maturity);
        _transaction = OneToOneTransaction(sender, receiver, msg.value);
        
        return true;
    }
    
    // The receiver validates the contract with the same parameters
    function validate(
            address sender,
            address receiver,
            bytes32 lhsUnderlierType,
            address lhsUnderlierAddress,
            uint    lhsUnderlierValue,
            bytes32 rhsUnderlierType,
            address rhsUnderlierAddress,
            uint    rhsUnderlierValue,
            bytes32 operator,
            uint maturity,
            uint notional
            ) returns (bool val) {
        /*if (msg.sender != _transaction.receiver)
        {
            log1("1", "foo1");
            return false;
        }*/
        
        if(_isComplete)
            return false;

        if(_transaction.sender != sender ||
            _transaction.receiver != receiver)
            return false;
        log1("2", "foo2");
        
        if (_premise.lhs.utype != strToUnderlierType(lhsUnderlierType) ||
            _premise.lhs.addressValue != lhsUnderlierAddress ||
            _premise.lhs.scalarValue != lhsUnderlierValue){
            return false;
        }
        log1("3", "foo3");
        
        if (_premise.rhs.utype != strToUnderlierType(rhsUnderlierType) ||
            _premise.rhs.addressValue != rhsUnderlierAddress ||
            _premise.rhs.scalarValue != rhsUnderlierValue){
            return false;
        }
        log1("4", "foo4");
        
        if(_premise.operator != strToOperator(operator))
        {
            return false;
        }
        log1("5", "foo5");
        
        if(_premise.maturity != maturity)
        {
            return false;
        }
        log1("6", "foo6");

        if(this.balance != notional)
        {
            return false;
        }
        log1("7", "foo7");

        _isActive = true;

        return true;
    }
    
    // If not validated, allow sender to withdra
    function withdraw() returns (bool val) {
        /*if (msg.sender!=_transaction.sender)
        {
            return false;
        }*/
        
        if(_isComplete)
            return false;

        if(_isActive)
        {
            return false;
        }
        
        _transaction.sender.send(this.balance);
        return true;
    }
    
    //if condition is met on maturity, allow receiver to claim from escrow
    function trigger() returns (bool val) {

        /*if (msg.sender!=_transaction.receiver)
        {
            return false;
        }*/
        
        if(_isComplete)
            return false;

        if( !isConditionMet() )
        {
            return false;
        }
        _isActive = false;
        _isComplete = true;
        _transaction.receiver.send(this.balance);
        return true;
    }

    function poke() returns (bool val) {
        return true;
    }
    
    //if condition is not met on maturity, allow sender to reclaim from escrow
    function recall() returns (bool val) {

        /*if (msg.sender!=_transaction.sender)
        {
            return false;
        }*/
        
        if(_isComplete)
            return false;
        
        if( isConditionMet() )
        {
            return false;
        }
        _isActive = false;
        _isComplete = true;
        _transaction.sender.send(this.balance);
        return true;
    }

    function ping() returns (bool val) {
        return true;
    }
    
    // ===== Utility functions ===== //
    
    function strToOperator(bytes32 str) private returns (Operator)
    {
        if(str=='NEQ') 
        {
            return Operator.NEQ;
        }
        else if(str=='LEQ') 
        {
            return Operator.LEQ;
        }
        else if(str=='GEQ') 
        {
            return Operator.GEQ;
        }
        else if(str=='GT') 
        {
            return Operator.GT;
        }
        else if(str=='LT') 
        {
            return Operator.LT;
        }
        else
        {
            return Operator.EQ;
        }
    }
    
    function strToUnderlierType(bytes32 str) private returns (UnderlierType)
    {
        if(str=='GASLIMIT'){
            return UnderlierType.gasLimit;
        }
        else if(str=='DIFFICULTY'){
            return UnderlierType.difficulty;
        }
        else if(str=='ACCBALANCE'){
            return UnderlierType.accountBalance;
        }
        else
        {
            return UnderlierType.scalar;
        }
    }
    
    function isConditionMet() private returns (bool)
    {
        if(!_isActive || _isComplete)
        {
            return false;
        }
        
        uint current_block      = block.number;
        uint spot_lhs               = 0;
        uint spot_rhs               = 0;
        
        if(current_block < _premise.maturity) {
            return false;
        }
        
        if(_premise.lhs.utype == UnderlierType.gasLimit){
            spot_lhs = block.gaslimit;
        }
        else if(_premise.lhs.utype == UnderlierType.difficulty){
            spot_lhs = block.difficulty;
        }
        else if(_premise.lhs.utype == UnderlierType.accountBalance){
            spot_lhs = _premise.lhs.addressValue.balance;
        }
        else
        {
            spot_lhs = _premise.lhs.scalarValue;
        }
        
        if(_premise.rhs.utype == UnderlierType.gasLimit){
            spot_rhs = block.gaslimit;
        }
        else if(_premise.rhs.utype == UnderlierType.difficulty){
            spot_rhs = block.difficulty;
        }
        else if(_premise.rhs.utype == UnderlierType.accountBalance){
            spot_rhs = _premise.rhs.addressValue.balance;
        }
        else
        {
            spot_rhs = _premise.rhs.scalarValue;
        }
        
        log1("lhs: ", bytes32(spot_lhs) );
        log1("rhs: ", bytes32(spot_rhs) );
        
        if(( _premise.operator == Operator.EQ && spot_lhs == spot_rhs ) ||
            ( _premise.operator == Operator.NEQ && spot_lhs != spot_rhs ) ||
            ( _premise.operator == Operator.LEQ && spot_lhs <= spot_rhs ) ||
            ( _premise.operator == Operator.GEQ && spot_lhs >= spot_rhs ) ||
            ( _premise.operator == Operator.LT && spot_lhs < spot_rhs ) ||
            ( _premise.operator == Operator.GT && spot_lhs > spot_rhs ) 
            )
        {
            return true;
        }
        
        return false;
    }

}
