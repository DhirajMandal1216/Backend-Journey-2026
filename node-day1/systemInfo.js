/**Exercise 3 — create systemInfo.js:

Log the following in a nicely formatted way:

=== System Information ===
Platform  : win32
CPU Cores : 8
Total RAM : 8.00 GB
Free RAM  : 3.20 GB
Node Ver  : v18.17.0
Directory : D:/your/path
 */

const os = require("os");
const totalGb = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
console.log("Platform : ", os.platform());
console.log("CPU Cores : ", os.cpus().length);
console.log("Total Ram :", totalGb);
console.log("Free Ram :", (os.freemem() / 1024 / 1024 / 1024).toFixed(2));
console.log("Node version:", process.version);
console.log("Directory :",__dirname);
