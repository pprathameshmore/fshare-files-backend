const jwt = require("jsonwebtoken");
const { config } = require("../configs");

const tokenVerify = (givenToken) => {
  return jwt.verify(givenToken, config.JWT_KEY);
};

module.exports = {
  tokenVerify,
};
