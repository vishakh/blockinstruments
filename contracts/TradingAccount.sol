import "std.sol";
import "Loggable.sol";

contract TradingAccount is owned, loggable {

    struct AuthPeriod {
        uint        duration;       // currently in minutes
        uint        startTime;
    }

    mapping(address => AuthPeriod)  public _authorized;
    address[]                       public _addresses;

    function TradingAccount() {}

    // This is pretty unnecessary because ether can be directly sent
    // to this contract. We include additional authentication for
    // symmetry with withdraw().
    function deposit() returns (bool) {
        if (msg.sender == _owner || isAuthorized(msg.sender)) {
            // Accept the deposit
            return true;
        } else {
            // Just return the deposit
            Error("Deposit must be made from authorized account");
            msg.sender.send(msg.value);
            return false;
        }
    }

    function withdraw(uint amount) returns (bool) {
        if (amount > this.balance) {
            // Trim the amount to the current balance
            // TODO: should maintain a withdrawal limit
            Error("Withdrawal amount limited to current account balance");
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
            Error("Authorization must be initiated by account owner");
            return false;
        }
        if (duration == 0) {
            Error("Authorization requires positive duration");
            return false;
        }
        AuthPeriod period = _authorized[accountAddr];
        if (period.duration == 0) {
            // Add this account to the list of authorized accounts
            _authorized[accountAddr] = AuthPeriod(duration, block.timestamp);
            _addresses.push(accountAddr);
        } else if (timeRemaining(period) < duration) {
            // Extend the authorized duration for this account
            _authorized[accountAddr] = AuthPeriod(duration, block.timestamp);
        }
        // TODO: retain AuthPeriod history in linked list for revocation
        return true;
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
