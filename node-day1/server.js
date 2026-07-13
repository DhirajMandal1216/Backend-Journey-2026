const http = require("http");

const server = http.createServer((req, res) => {
  const { method, url } = req;
console.log(`${method} ${url}`);
  res.setHeader("Content-Type", "application/json");

  if (method === "GET" && url === "/") {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Welcome to my API!" }));
  } else if (method === "GET" && url === "/users") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        users: [
          { id: 1, name: "Dhiraj" },
          { id: 2, name: "Rahul" },
        ],
      }),
    );
  } else if (method === "GET" && url === "/about") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        name: "My Backend API",
        version: "1.0.0",
        author: "Dhiraj",
      }),
    );
  }  else {
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" })); // sent to client
}
});

server.listen(3000,()=>{
    console.log("Server is stated on http://localhost:3000");
})
