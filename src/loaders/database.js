const { config } = require("../configs/index");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB.DB_NAME,
  config.DB.DB_USER,
  config.DB.DB_PASSWORD,
  {
    host: config.DB.URL,
    dialect: "postgres",
    port: config.DB.DB_PORT,
  }
);
sequelize
  .authenticate()
  .then(() => console.log("Connected to Postgresql database"))
  .catch((error) => console.log(error));

module.exports = sequelize;
