/**Exercise 1 — create fileReader.js:

Create a text file called data.txt with any content you want
Write a Node.js program that reads data.txt using async/await
Log the content to the console
Handle the error case (what if file doesn't exist?) */
const { readFile, writeFile } = require("fs").promises;
async function readMyfile() {
  try {
    const data = await readFile("./data.txt", "utf8");
    console.log(data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

readMyfile()