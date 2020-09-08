const http = require("http");

const PORT = 3000;

const handleServer = require("../app");

const server = http.createServer(handleServer);

server.listen(PORT);