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

/* async function main() {
  // Create a container
  const containerName = `files`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const createContainerResponse = await containerClient.create();
  console.log(
    `Create container ${containerName} successfully`,
    createContainerResponse.requestId
  );
}
main(); */

module.exports = blobServiceClient;
