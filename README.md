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


NODE.JS DAY 3 — Middleware and Error Handling


What is Middleware?

Middleware is a function that runs between the request arriving and the response being sent.

Request comes in
      ↓
Middleware 1 (logger)      → calls next()
      ↓
Middleware 2 (auth check)  → calls next()
      ↓
Route Handler              → sends response
      ↓
Response goes out

Middleware signature — three parameters:

javascript(req, res, next) => {
  // do something with request
  next(); // MUST call next() or request hangs forever
}

next() tells Express "I'm done, pass the request forward". Forgetting next() = request hangs forever — same as forgetting res.end() in raw Node.js.


Types of Middleware

1. Application-level — runs for ALL routes:

javascriptapp.use((req, res, next) => {
  // runs for every single request
  next();
});

2. Route-level — runs for specific routes only:

javascriptapp.get("/dashboard", checkAuth, (req, res) => {
  res.json({ message: "Welcome" });
});

3. Built-in middleware:

javascriptapp.use(express.json());                        // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static("public"));              // serve static files

4. Error handling — special 4-parameter signature:

javascript(err, req, res, next) => { } // must have all 4 params


Logger Middleware

javascriptconst logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // always call next
};

app.use(logger); // apply to all routes

Output:

[2026-07-15T05:30:00.000Z] GET /api/users
[2026-07-15T05:30:01.000Z] POST /api/users


Auth (protect) Middleware

javascriptconst protect = (req, res, next) => {
  const token = req.headers.authorization; // req.headers (plural) not req.header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized — token missing" });
  }

  req.user = { id: 1, name: "Dhiraj" }; // attach user to request
  next();
};

// Apply to specific routes only
app.put("/api/users/:id", protect, (req, res, next) => { ... });
app.delete("/api/users/:id", protect, (req, res, next) => { ... });

// Apply to all routes under a path
app.use("/api/admin", protect);

Key pattern: Middleware can attach data to req — route handlers can then access it via req.user, req.data etc.


Validation Middleware

javascriptconst validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!email.includes("@")) return res.status(400).json({ message: "Invalid email" });

  next(); // validation passed
};

app.post("/api/users", validateUser, (req, res) => {
  // if we reach here, input is guaranteed valid
});


Error Handling Middleware

Special 4-parameter middleware — Express knows it's an error handler because of the 4th param. Must always be the last middleware registered.

javascriptapp.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
    },
  });
});

How errors reach the error handler:

javascript// Option 1 — next(err) in route handler
app.get("/api/users/:id", (req, res, next) => {
  const user = users.find((u) => u.id === id);
  if (!user) return next(new NotFoundError("User not found")); // goes to error handler
  res.json({ data: user });
});

// Option 2 — next(err) in try/catch
app.get("/api/users/:id", async (req, res, next) => {
  try {
    const user = await getUserById(id);
    res.json({ data: user });
  } catch (err) {
    next(err); // passes to error handler
  }
});


Custom Error Classes + Express

javascript// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

module.exports = { AppError, NotFoundError, ValidationError };

javascript// In routes
const { NotFoundError, ValidationError } = require("./errors/AppError");

app.get("/api/users/:id", (req, res, next) => {
  const user = users.find((u) => u.id === id);
  if (!user) return next(new NotFoundError("User not found")); // clean!
  res.json({ data: user });
});


404 Wildcard Route

Catches any URL that doesn't match your routes:

javascript// After ALL routes, before error handler
app.use("*", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});


Correct Middleware Order — Always Follow This

javascriptconst app = express();

// 1. Built-in middleware
app.use(express.json());

// 2. Custom application middleware
app.use(logger);

// 3. Routes
app.get("/api/users", ...);
app.post("/api/users", ...);
app.put("/api/users/:id", protect, ...);    // route-level middleware
app.delete("/api/users/:id", protect, ...); // route-level middleware

// 4. 404 handler — after all routes
app.use("*", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// 5. Global error handler — always LAST
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: { name: err.name, message: err.message }
  });
});


Complete app.js Pattern

javascriptconst express = require("express");
const { NotFoundError, ValidationError } = require("./errors/AppError");

const app = express();
app.use(express.json());

let users = [
  { id: 1, name: "Dhiraj", email: "dhiraj@gmail.com", age: 25 },
  { id: 2, name: "Rahul",  email: "rahul@gmail.com",  age: 30 },
];

// Logger
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Auth guard
const protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized — token missing" });
  req.user = { id: 1, name: "Dhiraj" };
  next();
};

app.use(logger);

app.get("/api/users", (req, res) => {
  res.status(200).json({ data: users });
});

app.get("/api/users/:id", (req, res, next) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return next(new NotFoundError("User not found"));
  res.status(200).json({ data: user });
});

app.post("/api/users", (req, res, next) => {
  const { name, email, age } = req.body;
  if (!name || !email) return next(new ValidationError("Name and email required"));
  const newUser = { id: Date.now(), name, email, age };
  users.push(newUser);
  res.status(201).json({ data: newUser });
});

app.put("/api/users/:id", protect, (req, res, next) => {
  const userIndex = users.findIndex((u) => u.id === Number(req.params.id));
  if (userIndex === -1) return next(new NotFoundError("User not found"));
  const { name, email, age } = req.body;
  users[userIndex] = { ...users[userIndex], name, email, age };
  res.status(200).json({ data: users[userIndex] });
});

app.delete("/api/users/:id", protect, (req, res, next) => {
  const userIndex = users.findIndex((u) => u.id === Number(req.params.id));
  if (userIndex === -1) return next(new NotFoundError("User not found"));
  users.splice(userIndex, 1);
  res.status(200).json({ message: "User deleted successfully" });
});

// 404 handler
app.use("*", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// Global error handler — always last
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    error: { name: err.name, message: err.message }
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


Key Rules to Remember (Day 3)


Middleware order matters — express.json() → custom middleware → routes → 404 → error handler
Always call next() in middleware — or request hangs forever
Add next as third param in route handlers when using next(err)
req.headers (plural) — not req.header
return next(err) — always return to stop code execution after passing error
Error handler needs exactly 4 params (err, req, res, next) — Express identifies it by 4 params
404 wildcard app.use("*", ...) must come BEFORE error handler
Error handler must be LAST — after all routes and 404 handler
next(new NotFoundError()) — pass custom error instances to keep statusCode
req.user — middleware can attach data to req for route handlers to use
return res.status(401).json() in middleware — always return to stop execution
Route-level middleware — pass as second argument: app.get("/path", middleware, handler)



Coming Up — Node.js Day 4: Router and Service Pattern


Splitting routes into separate files with express.Router()
Controllers — separating route logic
Services — business logic layer
Professional folder structure
Connecting everything into a clean architecture

NODE.JS DAY 4 — Router and Service Pattern


The Problem With One File

Everything in app.js works for 2 routes but becomes unreadable at scale.
Solution: split into separate files with one clear responsibility each.


Professional Folder Structure

project/
├── app.js                  ← entry point, sets up express
├── package.json
├── .env                    ← environment variables
├── .gitignore
│
├── routes/
│   └── userRoutes.js       ← only URL definitions
│
├── controller/
│   └── userController.js   ← only req/res handling
│
├── service/
│   └── userService.js      ← only business logic
│
├── middleware/
│   ├── logger.js           ← logger middleware
│   └── protect.js          ← auth middleware
│
└── errors/
    └── AppError.js         ← custom error classes

Single Responsibility Principle — each file has one job only.


Express Router

express.Router() creates mini-apps — groups of routes mounted at a path:

javascript// routes/userRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", getAllUsers);       // GET /api/users
router.get("/:id", getUserById);   // GET /api/users/:id
router.post("/", createUser);      // POST /api/users
router.put("/:id", protect, updateUser);    // PUT /api/users/:id
router.delete("/:id", protect, deleteUser); // DELETE /api/users/:id

module.exports = router;

javascript// app.js
app.use("/api/users", userRouter); // prefix added automatically

Routes inside the file use / and /:id — the /api/users prefix is added when mounted.


The Full Request Flow

Request: GET /api/users/1
         ↓
app.js   → express.json() → logger → /api/users router
         ↓
userRoutes.js → matches /:id → calls getUserById controller
         ↓
userController.js → calls userService.getUserById(1)
         ↓
userService.js → finds user → throws NotFoundError if missing
         ↓
userController.js → res.json({ data: user })
         ↓
Response sent ✅

If error thrown:
         ↓
next(err) → global error handler → res.status(404).json({ error })


Controllers — req/res only

javascript// controller/userController.js
const userService = require("../service/userService");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err); // pass ALL errors to error handler
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const user = await userService.createUser({ name, email, age });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.updateUser(id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };

Controller rules:


No business logic — only req/res handling
Always async with try/catch
Always next(err) in catch — never handle errors here
Number(req.params.id) — always convert to number



Services — business logic only

javascript// service/userService.js
const { NotFoundError, ValidationError } = require("../errors/AppError");

let users = [
  { id: 1, name: "Dhiraj", email: "dhiraj@gmail.com", age: 25 },
  { id: 2, name: "Rahul",  email: "rahul@gmail.com",  age: 30 },
];

const getAllUsers = async () => {
  return users;
};

const getUserById = async (id) => {
  const user = users.find((u) => u.id === id);
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
  return user;
};

const createUser = async ({ name, email, age }) => {
  if (!name)  throw new ValidationError("Name is required");
  if (!email) throw new ValidationError("Email is required");
  const newUser = { id: Date.now(), name, email, age };
  users.push(newUser);
  return newUser;
};

const updateUser = async (id, data) => {
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) throw new NotFoundError(`User with id ${id} not found`);
  const { name, email, age } = data;
  users[userIndex] = { ...users[userIndex], name, email, age };
  return users[userIndex];
};

const deleteUser = async (id) => {
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) throw new NotFoundError(`User with id ${id} not found`);
  users.splice(userIndex, 1);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };

Service rules:


No req, no res, no next — pure business logic only
Always throw errors — never next()
Controller catches thrown errors and passes to next(err)



Middleware Files

javascript// middleware/logger.js
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
module.exports = logger; // default export

javascript// middleware/protect.js
const protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized — token missing" });
  }
  req.user = { id: 1, name: "Dhiraj" };
  next();
};
module.exports = protect; // default export

Import default exports without curly braces:

javascriptconst protect = require("../middleware/protect"); // ✅ no { }
const { protect } = require("../middleware/protect"); // ❌ gets undefined


Clean app.js

javascriptrequire("dotenv").config(); // always first

const express = require("express");
const { NotFoundError } = require("./errors/AppError");
const logger = require("./middleware/logger");
const userRouter = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/users", userRouter);

// 404 handler — Express 5 syntax
app.use("/{*splat}", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// Global error handler — always last
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.name}: ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});


dotenv — Environment Variables

bashnpm install dotenv

javascript// .env file
PORT=3000
DB_URL=mongodb://localhost:27017/mydb
JWT_SECRET=mysecretkey

javascript// app.js — always first line
require("dotenv").config(); // loads .env into process.env

// Use anywhere in your app
const port = process.env.PORT ?? 3000;
const dbUrl = process.env.DB_URL;

Rules:


require("dotenv").config() — no need to store in variable
Always first line in app.js — before any other imports
Never commit .env to GitHub — add to .gitignore



Express 4 vs Express 5 — Wildcard Syntax

javascript// Express 4 ❌ doesn't work in Express 5
app.use("*", handler);

// Express 5 ✅
app.use("/{*splat}", handler);

Check your version: npm list express


Key Rules to Remember (Day 4)


Each file has ONE job — routes, controller, service, middleware all separate
Routes — only URL definitions and which controller handles them
Controllers — only req/res handling, always async/try/catch/next(err)
Services — only business logic, always throw never next()
Default exports import without { }, named exports import with { }
require("dotenv").config() — always first line, no need to store in variable
Never commit .env to GitHub — add to .gitignore
Express 5 wildcard is "/{*splat}" not "*"
Number(req.params.id) — always in controller, params are always strings
Router prefix added automatically — routes inside use / not /api/users
module.exports = protect (default) vs module.exports = { protect } (named) — matters on import
Controllers call services, services throw errors, controllers catch and pass to next(err)



Coming Up — Node.js Day 5: MongoDB and Mongoose


What is MongoDB — documents, collections
Connecting with Mongoose
Creating Schema and Model
CRUD with Mongoose — find, findById, create, findByIdAndUpdate, findByIdAndDelete
Replacing in-memory array with real database



`NODE.JS DAY 5 — MongoDB and Mongoose`


What is MongoDB?

MongoDB is a NoSQL database — stores data as documents (JSON-like objects):

SQL Database    →    MongoDB
─────────────        ─────────────
Table           →    Collection
Row             →    Document
Column          →    Field

Document looks exactly like a JS object:

json{
  "_id": "64abc123...",
  "name": "Dhiraj",
  "email": "dhiraj@gmail.com",
  "age": 25,
  "createdAt": "2026-07-16T05:30:00.000Z"
}

Why MongoDB + Node.js — you're already working with JS objects everywhere.


Setup

bashnpm install mongoose

# .env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp
# OR local
MONGO_URI=mongodb://localhost:27017/myapp


Database Connection

javascript// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // exit if DB fails — no point running without DB
  }
};

module.exports = connectDB;

javascript// app.js — call before starting server
require("dotenv").config(); // always first
const connectDB = require("./config/db");
connectDB();


Schema and Model

Schema defines structure and validation rules:

javascript// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,        // no duplicate emails
      lowercase: true,     // auto converts to lowercase
      trim: true,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [120, "Age seems too high"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only these values allowed
      default: "user",
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);
// "User" → collection name becomes "users" automatically

module.exports = User;

Schema field types: String, Number, Boolean, Date, Array, mongoose.Schema.Types.ObjectId


CRUD with Mongoose

javascript// CREATE
const user = await User.create({ name: "Dhiraj", email: "dhiraj@gmail.com" });

// READ ALL
const users = await User.find();
const users = await User.find({ role: "admin" }); // with filter

// READ ONE
const user = await User.findById("64abc123...");
const user = await User.findOne({ email: "dhiraj@gmail.com" });

// UPDATE — { new: true } returns updated doc not old one
const user = await User.findByIdAndUpdate(id, data, { new: true });

// DELETE
await User.findByIdAndDelete(id);

// COUNT
const count = await User.countDocuments();


Updated Service Layer — Real Database

javascript// service/userService.js
const User = require("../models/User"); // ✅ capital U — Model
const { NotFoundError, ValidationError } = require("../errors/AppError");

const getAllUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  const user = await User.findById(id); // ✅ User not users
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
  return user;
};

const createUser = async ({ name, email, age }) => {
  if (!name)  throw new ValidationError("Name is required");
  if (!email) throw new ValidationError("Email is required");

  const existing = await User.findOne({ email });
  if (existing) throw new ValidationError("Email already in use");

  return await User.create({ name, email, age });
};

const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id); // ✅ Mongoose method, not splice
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };


MongoDB ObjectId vs Number Id

javascript// Old — in-memory array used number ids
const id = Number(req.params.id); // ❌ not needed for MongoDB

// New — MongoDB uses ObjectId (24-char string)
const id = req.params.id; // ✅ keep as string

// Validate ObjectId format to avoid crashes
const mongoose = require("mongoose");
if (!mongoose.Types.ObjectId.isValid(id)) {
  return next(new NotFoundError("Invalid user id"));
}


Final Folder Structure

project/
├── app.js                  ← entry point
├── package.json
├── .env                    ← MONGO_URI, PORT, JWT_SECRET
├── .gitignore              ← node_modules/, .env
│
├── config/
│   └── db.js               ← database connection
│
├── models/
│   └── User.js             ← Mongoose schema + model
│
├── routes/
│   └── userRoutes.js       ← URL definitions only
│
├── controller/
│   └── userController.js   ← req/res handling only
│
├── service/
│   └── userService.js      ← business logic + DB calls
│
├── middleware/
│   ├── logger.js
│   └── protect.js
│
└── errors/
    └── AppError.js


Common Mongoose Mistakes

javascript// ❌ Using array variable name instead of Model
const user = await users.findById(id); // users doesn't exist
const user = await User.findById(id);  // ✅ capital U Model

// ❌ Using old array methods after switching to Mongoose
users.findIndex(...);  // array method — doesn't work
users.splice(...);     // array method — doesn't work
User.findByIdAndDelete(id); // ✅ Mongoose method

// ❌ Forgetting { new: true } in update
await User.findByIdAndUpdate(id, data);          // returns OLD document
await User.findByIdAndUpdate(id, data, { new: true }); // ✅ returns NEW document

// ❌ Not checking if document was found after update/delete
const user = await User.findByIdAndUpdate(id, data, { new: true });
// user is null if not found — always check!
if (!user) throw new NotFoundError("User not found");


Key Rules to Remember (Day 5)


MongoDB stores documents — JSON-like objects, not rows and columns
mongoose.connect(process.env.MONGO_URI) — always in config/db.js
process.exit(1) — exit if DB connection fails, no point running
Schema defines structure + validation, Model is the interface to DB
mongoose.model("User", userSchema) → collection name = "users" (auto)
timestamps: true — auto adds createdAt and updatedAt to every document
User.find() — all docs, User.findById(id) — one doc by ObjectId
{ new: true } in findByIdAndUpdate — returns updated doc not old
MongoDB ObjectId is a string — remove Number() conversion from controllers
Always check if result is null after findById/findByIdAndUpdate/findByIdAndDelete
User.findOne({ email }) — find by any field, not just id
Only service layer changes when switching from array to DB — routes and controllers unchanged
Capital User = Mongoose Model, lowercase users = old array — don't mix them up



BACKEND JOURNEY COMPLETE! 🎉

What You Built

A fully working REST API with:


Express server with proper middleware
5 CRUD routes with validation and error handling
Service pattern — clean separation of concerns
MongoDB database with Mongoose
Custom error classes with HTTP status codes
Auth middleware protecting routes
Professional folder structure


Full Stack of What You Now Know

JavaScript (Week 1)
├── Variables, Scope, Types
├── Functions, Closures, this
├── Objects, Arrays, Classes
├── Async, Promises, async/await
└── Modules, Error Handling, Modern JS

Node.js + Express (Week 2)
├── Node.js fundamentals, fs, os, path
├── Express — routes, middleware, req/res
├── Error handling — custom errors, global handler
├── Service Pattern — routes, controllers, services
└── MongoDB + Mongoose — real database CRUD

What's Next After This


JWT Authentication — real login/logout with tokens
Input Validation — joi or express-validator
Pagination — limit/skip/page for large datasets
File Uploads — multer
Deployment — Railway, Render, or VPS


WEEK 3 — AUTHENTICATION AND SECURITY
WEEK 3, DAY 1 — Password Hashing with bcrypt
Why Never Store Plain Passwords

Storing plain passwords is a critical security problem:

Database hacked → hacker sees every user's plain password
                → tries same password on Gmail, banking apps
                → most people reuse passwords → massive damage

Rule: Nobody — not even the developer — should ever see a user's password.
What is Hashing?

One-way transformation — converts password to fixed-length string. Cannot be reversed:

"123456"    →  hash  →  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh"
"password"  →  hash  →  "$2b$10$X4kv7j5ZcG39WgogSl16BeZZ2gzYvFKoKE17CuTWyFDwBBjRWCHe"

Key properties:

Same input     → always same output ✅
Different input → completely different output ✅
One way        → cannot reverse hash back to password ✅

How login works with hashing:

REGISTER:
User sends "123456" → hash it → store hash → throw away original

LOGIN:
User sends "123456" → hash it → compare with stored hash
→ match = correct ✅  |  no match = wrong ❌
What is bcrypt?

Most trusted password hashing library. Adds two important things:

1. Salt — prevents rainbow table attacks:

User 1: "123456" + random salt → "$2b$10$Abc..."
User 2: "123456" + different salt → "$2b$10$Xyz..."
Same password → completely different hashes ✅

2. Salt Rounds — controls how slow hashing is:

saltRounds = 10  → ~100ms  ← industry standard ✅
saltRounds = 12  → ~400ms  ← more secure, slower
saltRounds = 6   → ~10ms   ← too fast, easier to crack ❌

Always use 10 in production.

Setup
bash
npm install bcrypt
Two Functions You Need
javascript
const bcrypt = require("bcrypt");

// 1. HASHING — on register
const hashed = await bcrypt.hash(plainPassword, 10);

// 2. COMPARING — on login
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
// returns true or false
Complete authService.js with bcrypt
javascript
const User = require("../models/User");
const { ValidationError } = require("../errors/AppError");
const bcrypt = require("bcrypt");

const registerUser = async (data) => {
  const { name, email, password } = data;

  if (!name)     throw new ValidationError("Name is required");
  if (!email)    throw new ValidationError("Email is required");
  if (!password) throw new ValidationError("Password is required");

  // ✅ Check duplicate BEFORE hashing — no point hashing if email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ValidationError("Email already exists");

  // ✅ Hash AFTER all validation passes
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ ...data, password: hashedPassword });

  // ✅ Never return password in response
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  if (!email)    throw new ValidationError("Email is required");
  if (!password) throw new ValidationError("Password is required");

  const user = await User.findOne({ email });
  if (!user) throw new ValidationError("Invalid credentials"); // ✅ don't reveal which field is wrong

  // ✅ Compare plain password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ValidationError("Invalid credentials");

  // ✅ Never return password in response
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

module.exports = { registerUser, loginUser };
Key Rules to Remember (Week 3 Day 1)
Never store plain passwords — always hash before saving
bcrypt.hash(password, 10) — hash on register, saltRounds = 10
bcrypt.compare(plain, hashed) — compare on login, returns true/false
Check duplicate email BEFORE hashing — hashing is expensive (100ms)
Never return password field in any response
"Invalid credentials" — never say "user not found" or "wrong password" separately
Wrong credentials = ValidationError (400) not NotFoundError (404)
Salt is added automatically by bcrypt — you don't manage it manually
Hashing is one-way — impossible to reverse, that's the whole point
saltRounds below 10 = too fast = easier to brute force — always use 10+


Coming Up — Week 3 Day 2: JWT Authentication
What is a JWT token
jwt.sign() — create token on login
jwt.verify() — verify token in protect middleware
Real protect middleware replacing fake tokens
Sending token back to client on login