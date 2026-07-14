# Backend Journey — Node.js & Express Notes

---

## NODE.JS DAY 1 — Fundamentals

---

### What is Node.js?

Node.js is the V8 JavaScript engine taken out of the browser and put on your computer/server — so you can run JavaScript outside the browser.

- **Not a language** — still JavaScript
- **Not a framework** — it's a runtime environment
- Same JS you know — different environment, different powers

```
Browser JS  → manipulate HTML, handle clicks, make API calls
              CANNOT access file system, CANNOT create servers

Node.js JS  → access file system, create servers, talk to databases
              CANNOT manipulate HTML (no DOM)
```

**Why Node.js is popular for backend:**
```
Traditional servers — one thread per request
→ 1000 users = 1000 threads = heavy, slow, expensive

Node.js — one thread, event loop handles everything async
→ 1000 users = one thread, non-blocking = fast, lightweight
```

This is called **non-blocking I/O** — Node never waits, always moves on and
comes back when data is ready. (Same Event Loop from JS Week Day 4)

---

### Running Node.js

```bash
node --version    # check version
node app.js       # run a file
node              # open Node REPL (interactive)
```

```javascript
// app.js
console.log("Hello from Node.js!");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);
```

---

### The `process` Object

Global object Node.js gives you — info about the current running process:

```javascript
process.version     // "v22.14.0" — Node version
process.platform    // "win32" / "linux" / "darwin"
process.cwd()       // current working directory
process.env         // environment variables object
process.env.PORT    // specific env variable
```

**`process.env` — most important for backend:**
```javascript
// Never hardcode sensitive values
const port = 3000; // ❌ hardcoded

// Always use environment variables
const port = process.env.PORT ?? 3000; // ✅ flexible, secure
```

Database passwords, API keys, port numbers — always in `process.env`, never in code.

---

### Built-in Modules

No installation needed — just `require` them.

#### `path` — working with file paths

```javascript
const path = require("path");

path.join("folder", "sub", "file.txt"); // "folder/sub/file.txt"
path.extname("index.js");               // ".js"
path.basename("/home/dhiraj/app.js");   // "app.js"
path.dirname("/home/dhiraj/app.js");    // "/home/dhiraj"

__dirname   // absolute path of current folder
__filename  // absolute path of current file
```

Use `path.join()` always — handles `/` vs `\` automatically across OS.

---

#### `os` — operating system info

```javascript
const os = require("os");

os.platform()      // "win32" / "linux" / "darwin"
os.arch()          // "x64"
os.hostname()      // computer name
os.cpus().length   // number of CPU cores
os.totalmem()      // total RAM in bytes
os.freemem()       // free RAM in bytes — NOTE: always call with ()

// Convert bytes to GB
const totalGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
const freeGB  = (os.freemem()  / 1024 / 1024 / 1024).toFixed(2);
```

---

#### `fs` — file system (most important)

Three ways to use it — always use async/await in production:

```javascript
// ❌ Synchronous — blocks everything, avoid in production
const data = fs.readFileSync("file.txt", "utf8");

// ⚠️  Callback style — old way
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) { console.log(err.message); return; }
  console.log(data);
});

// ✅ async/await — always use this
const { readFile, writeFile } = require("fs").promises;

async function readMyFile() {
  try {
    const data = await readFile("file.txt", "utf8");
    console.log(data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}
```

**Writing files:**
```javascript
async function writeMyFile() {
  try {
    await writeFile("output.txt", "Hello Node.js!", "utf8");
    const data = await readFile("output.txt", "utf8"); // verify
    console.log(data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}
```

**Common fs operations:**
```javascript
const { readFile, writeFile, appendFile, unlink, mkdir } = require("fs").promises;

await readFile("file.txt", "utf8");     // read file
await writeFile("file.txt", "content"); // write (overwrites if exists)
await appendFile("file.txt", "more");   // add to existing file
await unlink("file.txt");               // delete file
await mkdir("newfolder");               // create folder
```

---

### Raw HTTP Server

Node's built-in `http` module — this is what Express is built on top of:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  const { method, url } = req;

  console.log(`${method} ${url}`); // log every request

  res.setHeader("Content-Type", "application/json");

  if (method === "GET" && url === "/") {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Welcome!" }));

  } else if (method === "GET" && url === "/users") {
    res.writeHead(200);
    res.end(JSON.stringify({ users: [{ id: 1, name: "Dhiraj" }] }));

  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" })); // always res.end()!
  }
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
```

**Critical rule: Every request MUST call `res.end()` — otherwise client waits forever.**

---

### Raw Node.js vs Express

```javascript
// Raw Node.js — manual, verbose
if (method === "GET" && url === "/users") {
  res.writeHead(200);
  res.end(JSON.stringify({ users: [...] }));
}

// Express — clean, readable
app.get("/users", (req, res) => {
  res.json({ users: [...] });
});
```

Express automatically handles:
- Method checking → `app.get()`, `app.post()`
- Status 200 → set by default
- `JSON.stringify()` → done by `res.json()`
- `res.end()` → called automatically by `res.json()`

---

### Key Rules to Remember (Node.js Day 1)

1. Node.js = V8 engine outside the browser — JS on the server
2. Non-blocking I/O = Node never waits — same Event Loop from JS Week
3. `process.env` = where all secrets and config live — never hardcode
4. Always use `path.join()` for file paths — handles OS differences
5. Always call `os.freemem()` with `()` — it's a function not a property
6. Always use `fs.promises` with async/await — never sync in production
7. Every HTTP request MUST end with `res.end()` — or client hangs forever
8. Raw `http` module = what Express is built on — Express just makes it cleaner
9. `__dirname` = current folder path, `__filename` = current file path
10. `require()` = how you import built-in and installed modules in Node.js

---

## Coming Up — Node.js Day 2: Express.js

- Installing Express and setting up `package.json`
- `app.get`, `app.post`, `app.put`, `app.delete`
- `req.params`, `req.query`, `req.body`
- `res.json()`, `res.status()`
- Rebuilding today's server in Express — half the code, twice as clean



NODE.JS DAY 2 — Express.js Basics


What is Express?

Express is a minimal web framework built on top of Node's raw http module.
It makes building APIs dramatically cleaner:

javascript// Raw Node.js — verbose, manual
if (req.method === "GET" && req.url === "/users") {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ users: [...] }));
}

// Express — clean, readable
app.get("/users", (req, res) => {
  res.json({ users: [...] });
});

Express automatically handles:


Method checking → app.get(), app.post()
Status 200 → set by default
JSON.stringify() → done by res.json()
res.end() → called automatically by res.json()



Project Setup

bashmkdir my-project
cd my-project
npm init -y           # creates package.json
npm install express   # installs Express
npm install nodemon --save-dev  # auto-restart on file save

package.json scripts:

json"scripts": {
  "start": "node app.js",
  "dev":   "nodemon app.js"
}

bashnpm run dev   # development — auto restarts
npm start     # production

Always create .gitignore:

node_modules/
.env

Never push node_modules to GitHub — it's huge and unnecessary.


Basic Express Server

javascriptconst express = require("express");
const app = express();

// Middleware — ALWAYS at the top before routes
app.use(express.json()); // parse incoming JSON bodies

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my Express API!" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


The Four HTTP Methods — CRUD Mapping

HTTP MethodCRUDUse forGETReadFetch dataPOSTCreateSend new dataPUTUpdateReplace existing dataDELETEDeleteRemove data

javascriptapp.get("/users", (req, res) => { });     // get all
app.get("/users/:id", (req, res) => { }); // get one
app.post("/users", (req, res) => { });    // create
app.put("/users/:id", (req, res) => { }); // update
app.delete("/users/:id", (req, res) => { }); // delete


req.params — URL Parameters

Identify a specific resource in the URL:

javascriptapp.get("/users/:id", (req, res) => {
  const id = Number(req.params.id); // always convert to number!
  res.json({ id });
});

// Multiple params
app.get("/users/:userId/orders/:orderId", (req, res) => {
  const { userId, orderId } = req.params;
  res.json({ userId, orderId });
});

Test: http://localhost:3000/users/5 → id = "5" (string, convert with Number())

Rule: req.params values are always strings — convert to number when comparing with IDs.


req.query — Query Strings

Optional extra info after ? — used for filtering, sorting, pagination:

javascriptapp.get("/users", (req, res) => {
  const page  = Number(req.query.page)  ?? 1;
  const limit = Number(req.query.limit) ?? 10;
  const sort  = req.query.sort;

  res.json({ page, limit, sort });
});

Test: http://localhost:3000/users?page=1&limit=10&sort=name


req.body — Request Body

Data sent in POST/PUT requests — requires express.json() middleware:

javascriptapp.use(express.json()); // MUST be before routes

app.post("/users", (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email required" });
  }

  const newUser = { id: Date.now(), name, email, age };
  users.push(newUser);

  res.status(201).json({ message: "User created", data: newUser });
});


res Methods — Sending Responses

javascriptres.json({ message: "Success" });              // send JSON
res.status(201).json({ message: "Created" });  // status + JSON
res.status(404).json({ error: "Not found" });  // error response
res.send("Hello World");                        // plain text
res.status(204).send();                         // no content (delete)

HTTP Status Codes to memorize:

CodeMeaningUse when200OKSuccessful GET, PUT201CreatedSuccessful POST204No ContentSuccessful DELETE400Bad RequestMissing or invalid input401UnauthorizedNot logged in403ForbiddenLogged in but no permission404Not FoundResource doesn't exist500Server ErrorSomething crashed


Complete CRUD API Pattern

javascriptconst express = require("express");
const app = express();

app.use(express.json()); // ✅ middleware first

let users = [
  { id: 1, name: "Dhiraj", email: "dhiraj@gmail.com", age: 25 },
  { id: 2, name: "Rahul",  email: "rahul@gmail.com",  age: 30 },
];

// GET all
app.get("/api/users", (req, res) => {
  res.status(200).json({ message: "Users fetched", data: users });
});

// GET one
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) return res.status(404).json({ message: "User not found" }); // ✅ return

  res.status(200).json({ message: "User fetched", data: user });
});

// POST create
app.post("/api/users", (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  const newUser = { id: Date.now(), name, email, age };
  users.push(newUser); // ✅ actually save to array

  res.status(201).json({ message: "User created", data: newUser });
});

// PUT update
app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, age } = req.body;
  users[userIndex] = { ...users[userIndex], name, email, age }; // ✅ merge

  res.status(200).json({ message: "User updated", data: users[userIndex] });
});

// DELETE
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(userIndex, 1); // ✅ actually remove

  res.status(200).json({ message: "User deleted" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


Key Rules to Remember (Express Day 2)


Always put app.use(express.json()) at the TOP — before all routes
Always return before res.json() inside if blocks — or code keeps running
req.params.id is always a string — convert with Number() before comparing
req.body only works when express.json() middleware is added
users.push(newUser) — POST must actually save to array
findIndex returns -1 when not found — check for -1 not null
users.splice(index, 1) — DELETE must actually remove from array
{ ...users[index], name, email } — PUT merges old and new data
Date.now() — quick way to generate unique IDs (use MongoDB ObjectId in real apps)
Test every route in Postman — browser can only test GET routes



Coming Up — Node.js Day 3: Middleware & Error Handling


What middleware is and how next() works
Writing custom middleware (logger, auth guard)
Global error handling middleware
Connecting custom error classes to Express
Proper error responses with status codes