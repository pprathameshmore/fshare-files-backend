process.env.NODE_ENV = process.env.NODE_ENV || "development";
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
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  SESSION_SECRET: process.env.SESSION_SECRET,
  REDIS: {
    HOST: process.env.REDIS_HOST_SERVER,
    PORT: process.env.REDIS_PORT,
    AZURE_KEY: process.env.REDIS_AZURE_KEY,
  },
  AZURE: {
    AZURE_STORAGE_CONNECTION_STRING:
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_NAME: process.env.AZURE_STORAGE_NAME,
    AZURE_ACCOUNT_KEY: process.env.AZURE_ACCOUNT_KEY,
    AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
    CONTAINER_NAME: process.env.STORAGE_CONTAINER_NAME,
  },
};
