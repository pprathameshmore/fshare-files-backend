const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const { config } = require("./index");

const sharedKeyCredential = new StorageSharedKeyCredential(
  config.AZURE.AZURE_STORAGE_NAME,
  config.AZURE.AZURE_ACCOUNT_KEY
);

const blobServiceClient = new BlobServiceClient(
  config.AZURE.AZURE_STORAGE_CONNECTION_STRING,
  sharedKeyCredential
);


module.exports = blobServiceClient;
