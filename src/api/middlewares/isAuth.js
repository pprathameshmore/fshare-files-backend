const jwt = require("jsonwebtoken");
const { response } = require("../../utils/utils");
const { tokenVerify } = require("../../helpers/jwt-verify");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const getToken = req.headers.authorization.split(" ")[1];
    req.user = tokenVerify(getToken);
    next();
  } catch (error) {
    return res
      .status(401)
      .json(response(401, "Please Signin to access this route", null));
  }
};
