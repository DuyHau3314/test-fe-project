// Brief requirement
// implementations of a function in JavaScript
// that calculates the summation of all integers
// from 1 to a given integer n

// Iterative solution
var sum_to_n_a = function(n) {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Recursive solution
var sum_to_n_b = function(n) {
    if (n <= 1) {
        return n;
    }
    return n + sum_to_n_c(n - 1);
};

// Arithmetic progression solution
var sum_to_n_c = function(n) {
	return n * (n + 1) / 2;
};

// Test case
// Test cases
console.log("Testing sum_to_n_a:");
console.log(sum_to_n_a(5) === 15 ? "Passed" : "Failed");
console.log(sum_to_n_a(10) === 55 ? "Passed" : "Failed");
console.log(sum_to_n_a(1) === 1 ? "Passed" : "Failed");
console.log(sum_to_n_a(0) === 0 ? "Passed" : "Failed");

console.log("Testing sum_to_n_b:");
console.log(sum_to_n_b(5) === 15 ? "Passed" : "Failed");
console.log(sum_to_n_b(10) === 55 ? "Passed" : "Failed");
console.log(sum_to_n_b(1) === 1 ? "Passed" : "Failed");
console.log(sum_to_n_b(0) === 0 ? "Passed" : "Failed");

console.log("Testing sum_to_n_c:");
console.log(sum_to_n_c(5) === 15 ? "Passed" : "Failed");
console.log(sum_to_n_c(10) === 55 ? "Passed" : "Failed");
console.log(sum_to_n_c(1) === 1 ? "Passed" : "Failed");
console.log(sum_to_n_c(0) === 0 ? "Passed" : "Failed");
