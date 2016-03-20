contract loggable {

    event Error(bytes message);

    event Authorization(address addr, bytes outcome);
    event Validation(address addr, bytes outcome);
    event Withdrawal(address addr, bytes outcome);
    event Exercise(address addr, bytes outcome);

    event CashFlow(address from, address to, uint amount);

    // ===== Utility functions ===== //

    function toText(bool flag) returns (bytes) {
        if (flag) {
            return "SUCCESS";
        } else {
            return "FAILURE";
        }
    }
}
