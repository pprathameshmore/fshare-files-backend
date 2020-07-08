const jwt = require("jsonwebtoken");
const { response } = require("../../utils/utils");
const { config } = require("../../configs/index");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const getToken = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(getToken, config.JWT_KEY);
    next();
  } catch (error) {
    return res
      .status(403)
      .json(response(403, "Please Signin to access this route", null));
  }
};
