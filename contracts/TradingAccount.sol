contract TradingAccount {

    struct AuthPeriod {
        uint        duration;       // currently in minutes
        uint        startTime;
    }

    address                         public _owner;
    mapping(address => AuthPeriod)  public _authorized;
    address[]                       public _addresses;

    function TradingAccount() {
        // Track the owner
        _owner = msg.sender;
    }

    // This is pretty unnecessary because ether can be directly sent
    // to this contract. We include additional authentication for
    // symmetry with withdraw().
    function deposit() returns (bool) {
        if (msg.sender == _owner || isAuthorized(msg.sender)) {
            // Accept the deposit
            return true;
        } else {
            // Just return the deposit
            msg.sender.send(msg.value);
            return false;
        }
    }

    function withdraw(uint amount) returns (bool) {
        if (amount > this.balance) {
            // Trim the amount to the current balance
            // TODO: should maintain a withdrawal limit
            amount = this.balance;
        }
        if (msg.sender == _owner || isAuthorized(msg.sender)) {
            // Withdraw the money
            // TODO: need slack to withdraw after authorization period
            msg.sender.send(amount);
            return true;
        }
        return false;
    }

    function authorize(address accountAddr, uint duration) returns (bool) {
        if (tx.origin != _owner) {
            return false;
        }
        if (duration == 0) {
            return false;
        }
        AuthPeriod period = _authorized[accountAddr];
        if (period.duration == 0 || timeRemaining(period) < duration) {
            // Add this account to the list of authorized accounts
            _authorized[accountAddr] = AuthPeriod(duration, block.timestamp);
            _addresses.push(accountAddr);
            // TODO: retain AuthPeriod history in linked list for revocation
            return true;
        }
        return false;
    }

    function isAuthorized(address accountAddr) returns (bool) {
        // Check if address wasn't authorized or authorization has expired
        AuthPeriod period = _authorized[accountAddr];
        return (period.duration > 0 && timeRemaining(period) >= 0);
    }

    function timeRemaining(AuthPeriod period) private returns (uint) {
        uint timeElapsed = (block.timestamp - period.startTime) / 60;
        return period.duration - timeElapsed;
    }
}
