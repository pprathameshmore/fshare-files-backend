const fs = require("fs");
const DownloadServices = require("../../services/download");
const validator = require("validator");
const FileServices = require("../../services/file");
const blobServiceClient = require("../../configs/azure-blob-service");
const { config } = require("../../configs/index");
const { response, isDefObject, isDefVar } = require("../../utils/utils");

exports.downloadFile = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res.status(400).json(response(400, "File is not valid", null));
  const { password } = req.body;
  if (isDefVar(password) && isDefObject(req.body)) {
    console.log("Downloading file using password");
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      password
    ).catch((error) => console.log(error));
    if (!isFileAvailable)
      return res
        .status(404)
        .json(
          response(404, "May be file not available or password is wrong", null)
        );
    async function streamToString(readableStream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
          chunks.push(data.toString());
        });
        readableStream.on("end", () => {
          resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
      });
    }
    const blockBlobClient = blobServiceClient.getContainerClient("files");
    let blockBlobClientResponse = await blockBlobClient
      .getBlobClient(filePath)
      .downloadToFile(`uploads/${filePath}`, 0, undefined)
      .catch((error) => console.error(error));
    console.log("Response from Azure");
    if (blockBlobClientResponse) {
      return res
        .status(200)
        .set("Content-Type", "application/zip")
        .download(`uploads/${filePath}`, (error) => {
          if (error) {
            console.log(error);
          }
          fs.unlink(`uploads/${filePath}`, (error) => console.log(error));
        });
    }
  } else {
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      null
    ).catch((error) => console.log(error));
    if (!isFileAvailable)
      return res
        .status(404)
        .json(response(404, "File may be not available", null));

    const blockBlobClient = blobServiceClient.getContainerClient("files");
    let blockBlobClientResponse = await blockBlobClient
      .getBlobClient(filePath)
      .downloadToFile(`uploads/${filePath}`, 0, undefined)
      .catch((error) => console.error(error));

    if (blockBlobClientResponse) {
      return res
        .status(200)
        .set("Content-Type", "application/zip")
        .download(`uploads/${filePath}`, (error) => {
          if (error) {
            console.log(error);
          }
          fs.unlink(`uploads/${filePath}`, (error) => console.log(error));
        });
    }
  }
};

exports.previewFile = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res
      .status(400)
      .json(
        response(400, "May be file not available or entered invalid ID", null)
      );
  const fileDetails = await FileServices.getFile(fileId).catch((error) =>
    console.log(error)
  );
  if (!fileDetails)
    return res
      .status(400)
      .json(response(400, "File may be not available", null));
  const file = {
    name: fileDetails.name,
    message: fileDetails.message,
    downloadFile: `${config.HOSTNAME}:${config.PORT}/api/v1/downloads/${fileDetails.id}`,
    shortUrl: fileDetails.shortUrl,
    password: fileDetails.password,
    fileSize: fileDetails.fileSize,
    downloads: fileDetails.downloads,
    downloadLimit: fileDetails.downloadLimit,
    createdAt: fileDetails.createdAt,
  };
  return res.status(200).json(response(200, "File Details", file));
};
