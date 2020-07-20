module.exports = (app) => {
  const { config } = require("../configs/index");
  const express = require("express");
  const path = require("path");
  const cors = require("cors");
  const errorHandler = require("../api/middlewares/errorHandler");
  const apiRouter = require("../api/routes/index");
  require("./logger")(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  const whitelist = [
    "https://fshare.netlify.app",
    "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost",
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("You are not allowed to access this API"));
      }
    },
  };
  app.use(cors(corsOptions));
  //API Routes
  app.use(`/${config.API_PREFIX}`, apiRouter);
  app.use(errorHandler);
};
