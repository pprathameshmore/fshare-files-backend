const http = require("http");
const express = require("express");

const app = express();
const { config } = require("../src/configs/index");

require("./loaders/index")(app);
const server = http.createServer(app);
require("../src/loaders/socket")(server);
server.listen(config.PORT);
