contract Instrument {

    //state variables
    bool                _isActive;
    bool                _isComplete;
    
    //parameters
    SimplePremise       _premise;
    OneToOneTransaction _transaction;
    
    //Hack variables to get around struct instantiation issues.
    Underlier           _underlier;
    
    enum UnderlierType { gasLimit, difficulty, accountBalance, scalar }
    
    struct Underlier {
        UnderlierType   utype;
        address         addrressValue;
        uint            scalarValue;
    }
    
    enum Operator { LT, GT, EQ, NEQ, LEQ, GEQ }

    struct SimplePremise {
        Underlier   underlier;  // something being bet on
        Operator    operator;   // equality or inequality
        uint        strike;     // right-hand side
        uint        maturity;   // block number to use as maturity
    }
    
    struct OneToOneTransaction {
        address     sender;     // the person placing the bet
        address     receiver;   // the person taking the bet
        uint        value;      // the stake
    }
    
    
    
    //The sender constructs the contract
    // Funds
    // Senders address
    // Receivers address
    // 
    function Instrument(
        address sender, 
        address receiver, 
        bytes32 underlierType, 
        address underlierAddress,
        uint    underlierValue,
        bytes32 operator, 
        uint strike, 
        uint maturity) 
    {
        _isActive = false;
        _isComplete = false;
        
        UnderlierType parsedUnderlierType = strToUnderlierType(underlierType);
        _underlier = Underlier(parsedUnderlierType, underlierAddress, underlierValue);
        _premise = SimplePremise(_underlier, strToOperator(operator), strike, maturity);
        _transaction = OneToOneTransaction(sender, receiver, msg.value);
        
        /*if(sender != msg.sender)
        {
            suicide(sender);
        }*/
    }
    
    // The receiver validates the contract with the same parameters
    function validate(address sender, address receiver, address underlier, bytes32 operator, uint strike) returns (bool val) {
        //if (msg.sender!=sender)
        //{
        //    return false;
        //}
        
        if (//_premise.underlier != underlier ||
            _premise.operator != strToOperator( operator ) ||
            _premise.strike != strike){
            return false;
        }
        
        return true;
    }
    
    // If not validated, allow sender to withdra
    function withdraw() returns (bool val) {
        if(_isActive)
        {
            return false;
        }
        suicide(_transaction.sender);
        _transaction.sender.send(this.balance);
        return true;
    }
    
    //if condition is met on mzturity, allow receiver to claim from escrow
    function trigger() returns (bool val) {
        
        if( !isConditionMet() )
        {
            return false;
        }
        _isActive = false;
        _isComplete = true;
        _transaction.receiver.send(this.balance);
        return true;
    }
    
    //if condition is met on maturity, allow receiver to claim from escrow
    function recall() returns (bool val) {
        
        if( isConditionMet() )
        {
            return false;
        }
        _isActive = false;
        _isComplete = true;
        _transaction.sender.send(this.balance);
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
        uint current_block      = block.number;
        uint spot               = 0;
        
        if(current_block < _premise.maturity) {
            return false;
        }
        
        if(_premise.underlier.utype == UnderlierType.gasLimit){
            spot = block.gaslimit;
        }
        else if(_premise.underlier.utype == UnderlierType.difficulty){
            spot = block.difficulty;
        }
        if(_premise.underlier.utype == UnderlierType.accountBalance){
            spot = _premise.underlier.addrressValue.balance;
        }
        else
        {
            spot = _premise.underlier.scalarValue;
        }
        
        if(( _premise.operator == Operator.EQ && spot == _premise.strike ) ||
            ( _premise.operator == Operator.NEQ && spot == _premise.strike ) ||
            ( _premise.operator == Operator.LEQ && spot <= _premise.strike ) ||
            ( _premise.operator == Operator.GEQ && spot >= _premise.strike ) ||
            ( _premise.operator == Operator.LT && spot < _premise.strike ) ||
            ( _premise.operator == Operator.GT && spot > _premise.strike ) 
            )
        {
            return true;
        }
        
        return false;
    }
}
