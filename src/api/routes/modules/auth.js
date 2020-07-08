const express = require("express");
const passport = require("../../../configs/passport");
const { callbackAuth } = require("../../controllers/auth");
const AuthServices = require("../../../services/auth");
const auth = express.Router();

const io = require("../../../loaders/socket");

const addSocketIdToSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

auth
  .route("/google")
  .get(
    addSocketIdToSession,
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
auth
  .route("/google/callback")
  .get(passport.authenticate("google", { failureRedirect: "/" }), callbackAuth);

/* auth.route('/').post((req, res, next) => {
    const {
        email,
        username,
        token } = req.body;
    const { isFound, sendToken, user } = AuthServices.googleAuthReactClient({
        email: email,
        googleToken: token,
        username: username
    });
    res.status(200).json({
        sendToken: sendToken,
        user: user
    });
}); */

module.exports = auth;
