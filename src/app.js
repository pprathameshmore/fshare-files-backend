require("dotenv").config();
const { config } = require("../src/configs/index");
const http = require("http");
const express = require("express");

const app = express();

require("./loaders/index")(app);
const server = http.createServer(app);
server.listen(config.PORT, () => {
  console.log("File Server running on " + config.PORT);
});
