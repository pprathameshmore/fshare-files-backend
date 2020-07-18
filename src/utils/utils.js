const bcrypt = require("bcrypt");
const { GeneralError } = require("./errors");

exports.response = (statusCode, message, data) => {
  return {
    statusCode,
    message,
    data,
  };
};

exports.isDefVar = (variable) => (variable ? true : false);

exports.isDefObject = (object) =>
  Object.keys(object).length === 0 ? false : true;

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10).catch((error) => {
    throw new GeneralError(error);
  });
};

exports.checkPassword = async (givenPassword, userPassword) => {
  return await bcrypt.compare(givenPassword, userPassword).catch((error) => {
    throw new GeneralError(error);
  });
};

exports.addDay = (days) => {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
