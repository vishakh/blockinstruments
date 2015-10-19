contract TradingAccount {

    struct AuthPeriod {
        uint        numDays;
        uint        startTime;
    }

    address                         _owner;
    mapping(address => AuthPeriod)  _authorized;

    function TradingAccount() {
        // Track the owner
        _owner = msg.sender;
    }

    // This is pretty unnecessary because ether can be directly sent
    // to this contract. We include additional authentication for
    // symmetry with withdraw().
    function deposit() returns (bool) {
        if (_owner == msg.sender || isAuthorized(msg.sender)) {
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

    function authorize(address accountAddr, uint numDays) returns (bool) {
        AuthPeriod period = _authorized[accountAddr];
        if (period.numDays == 0 || timeRemaining(period) < numDays) {
            // Add this account to the list of authorized accounts
            _authorized[accountAddr] = AuthPeriod(numDays, block.timestamp);
            return true;
        }
        return false;
    }

    function isAuthorized(address accountAddr) private returns (bool) {
        // Check if address wasn't authorized or authorization has expired
        AuthPeriod period = _authorized[accountAddr];
        return (period.numDays > 0 && timeRemaining(period) >= 0);
    }

    function timeRemaining(AuthPeriod period) private returns (uint) {
        uint timeElapsedInSecs = block.timestamp - period.startTime;
        uint timeElapsedInDays = timeElapsedInSecs / 86400;
        return period.numDays - timeElapsedInDays;
    }
}
