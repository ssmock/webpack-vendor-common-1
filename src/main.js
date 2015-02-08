var _ = require("lodash");
var dep1 = require("./dep-1.js");
var dep2 = require("./dep-2.js");

console.log("Main loaded");
console.log("----- lodash", _);
console.log("----- dep1", dep1);
console.log("----- dep2", dep2);
console.log("************************************************");