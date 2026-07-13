/**Exercise 2 — create fileWriter.js:

Write a program that creates a new file called output.txt
Write this content to it: "Node.js file writing - [today's date]"
After writing, read the file back and log it to confirm it was saved
Use async/await throughout */

const { writeFile, readFile } = require("fs").promises;
const today = new Date()
async function writeMyFile() {
  try {
    const write = await writeFile(
      "output.txt",
      `Node.js file writing - ${today.toLocaleDateString()}`,"utf8"
    );
    const read = await readFile("output.txt", "utf8");
    console.log(read);
  } catch (error) {
    console.log("Error", error.message);
  }
}
writeMyFile()