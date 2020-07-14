const redis = require("redis");
const { config } = require("../configs/index");

const client = redis.createClient(config.REDIS.PORT, config.REDIS.HOST, {
  auth_pass: config.REDIS.AZURE_KEY,
  tls: config.REDIS.HOST,
});

module.exports = client;
