const fs = require("fs");
const Container = require("typedi").Container;
const blobServiceClient = require("../configs/azure-blob-service");
const { config } = require("../configs/index");
const { GeneralError } = require("../utils/errors");

class AzureBlobService {
  constructor() {
    this.fileContainerClient = blobServiceClient.getContainerClient(
      config.AZURE.CONTAINER_NAME
    );
  }
  async downloadFile(fileName) {
    const timestamp = Date.now().toString();
    //const random = Math.floor(Math.random() * 100 + 1);
    const response = await this.fileContainerClient
      .getBlobClient(fileName)
      .downloadToFile(`download-temp/${timestamp}${fileName}`, 0, undefined)
      .catch((error) => console.log(error));

    return { response, timestamp };
  }
  async uploadFileToBlob({ blobName, dirName }) {
    const blobBlockFile = this.fileContainerClient.getBlockBlobClient(blobName);
    const getReadableStream = fs.createReadStream(dirName + blobName);
    const blockBlobUploadResponse = await blobBlockFile
      .uploadStream(getReadableStream)
      .catch((error) => {
        throw new GeneralError(error);
      });
    return blockBlobUploadResponse;
  }
  async removeFileFromBlob(blobName) {
    const removedBlob = await this.fileContainerClient
      .deleteBlob(blobName)
      .catch((error) => {
        console.log(error);
      });
    return removedBlob;
  }
}

module.exports = Container.get(AzureBlobService);
