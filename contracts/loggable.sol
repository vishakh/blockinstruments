contract loggable {

    event Authorization(bytes32 addr, bytes32 success);
    event Validation(bytes32 addr, bytes32 success);
    event Withdrawal(bytes32 addr, bytes32 success);
    event Exercise(bytes32 addr, bytes32 success);
    event CashFlow(bytes32 from, bytes32 to, bytes32 amount);

    // ===== Utility functions ===== //

    function toText(bool flag) returns (bytes32) {
        if (flag) {
            return "succeeded";
        } else {
            return "failed";
        }
    }
}
