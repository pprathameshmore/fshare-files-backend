process.env.NODE_ENV = process.env.NODE_ENV || "development";

const dotenv = require("dotenv");

dotenv.config();

exports.config = {
  HOSTNAME: process.env.HOSTNAME,
  PORT: parseInt(process.env.PORT) || 3000,
  DB: {
    URL: process.env.DB_URL,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: parseInt(process.env.DB_PORT),
  },
  API_PREFIX: process.env.API_PREFIX || "api",
  JWT_KEY: process.env.JWT_KEY,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  PASSPORT: {
    GOOGLE_CONSUMER_KEY: process.env.GOOGLE_CONSUMER_KEY,
    GOOGLE_CONSUMER_SECRET: process.env.GOOGLE_CONSUMER_SECRET,
  },
  SHORT_URL_HOST: process.env.SHORT_URL_HOST,
};
