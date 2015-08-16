contract Instrument {

    //state variables
    bool                _isActive;
    bool                _isComplete;
    
    //parameters
    SimplePremise       _premise;
    OneToOneTransaction _transaction;
    
    /*enum Unit { Ether, Wei, MegahashPerSec, TerahashPerSec }
    enum ResourceType { gasPrice, hashRate, accountBalance, scalar }
    
    struct Resource {
        ResourceType    type;
        address         addr;
    }
    
    struct Value {
        int         coeff;          // should be a float someday
        Resource    resource;       // default 1 for scalars
        Unit        units;          // for scaling
    }
    
    struct Expression {
        
    }*/
    
    enum Operator { LT, GT, EQ, NEQ }

    struct SimplePremise {
        address     underlier;  // something being bet on
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
    function Instrument(address sender, address receiver, address underlier, bytes32 operator, uint strike, uint maturity) 
    {
        _isActive = false;
        _isComplete = false;
        _premise = SimplePremise(underlier, strToOperator(operator), strike, maturity);
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
        
        if (_premise.underlier != underlier ||
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
    
    //if condition is met, transfer money and peform suicide.
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
    
    // ===== Utility functions ===== //
    
    function strToOperator(bytes32 str) private returns (Operator)
    {
        if(str=='NEQ') 
        {
            return Operator.NEQ;
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
    
    function isConditionMet() private returns (bool)
    {
        uint underlier_balance  = _premise.underlier.balance;
        uint current_block      = block.number;
        
        if(current_block < _premise.maturity)
        {
            return false;
        }
        
        if(( _premise.operator == Operator.EQ && underlier_balance == _premise.strike ) ||
            ( _premise.operator == Operator.NEQ && underlier_balance == _premise.strike ) ||
            ( _premise.operator == Operator.LT && underlier_balance < _premise.strike ) ||
            ( _premise.operator == Operator.GT && underlier_balance > _premise.strike ) 
            )
        {
            return true;
        }
        
        return false;
    }
}
