module.exports = (app) => {
  const { config } = require("../configs/index");
  const express = require("express");
  const path = require("path");
  const passport = require("passport");
  const cors = require("cors");
  const session = require("express-session");
  const errorHandler = require("../api/middlewares/errorHandler");
  const apiRouter = require("../api/routes/index");
  require("./logger")(app);
  app.use(
    session({
      secret: "prathameshmore9420",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors());
  //app.options("*", cors({ origin: "http://localhost:3333/" }));
  //API Routes
  app.use(`/${config.API_PREFIX}`, apiRouter);
  app.use(errorHandler);
};
