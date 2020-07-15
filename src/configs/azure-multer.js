const MulterAzureStorage = require("multer-azure-blob-storage")
  .MulterAzureStorage;
const { config } = require("../configs/index");

const azureStorage = new MulterAzureStorage({
  connectionString: config.AZURE.AZURE_CONNECTION_STRING,
  accessKey: config.AZURE.AZURE_ACCOUNT_KEY,
  accountName: config.AZURE.AZURE_STORAGE_NAME,
  containerName: config.AZURE.CONTAINER_NAME,
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

module.exports = azureStorage;
