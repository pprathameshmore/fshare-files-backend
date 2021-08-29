const fs = require("fs");
const DownloadServices = require("../../services/download");
const validator = require("validator");
const path = require("path");
const FileServices = require("../../services/file");
const { config } = require("../../configs/index");
const { response, isDefObject, isDefVar } = require("../../utils/utils");

const downloadFileController = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res.status(400).json(response(400, "File is not valid", null)).end();
  const { password } = req.body;
  if (isDefVar(password) && isDefObject(req.body)) {
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      password
    );
    if (!isFileAvailable)
      return res
        .status(404)
        .json(response(404, "File not available or password is wrong", null));

    console.log("File Path");
    console.log(filePath);
    return res
      .status(200)
      .download(path.join(process.cwd(), "uploads", filePath), () => {
        fs.unlink(path.join(process.cwd(), "uploads", filePath), (error) => {
          console.log(error);
        });
      });
  } else {
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      null
    );
    if (!isFileAvailable)
      return res.status(404).json(response(404, "File not available", null));
    console.log("File Path");
    console.log(filePath);
    return res
      .status(200)
      .download(path.join(process.cwd(), "uploads", filePath), () => {
        fs.unlink(path.join(process.cwd(), "uploads", filePath), (error) => {
          console.log(error);
        });
      });
  }
};

const previewFileController = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res
      .status(400)
      .json(response(400, "File not available or entered invalid ID", null))
      .end();
  const fileDetails = await FileServices.getFile(fileId);
  if (!fileDetails)
    return res
      .status(400)
      .json(response(400, "File not available", null))
      .end();
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
  return res.status(200).json(response(200, "File Details", file)).end();
};

module.exports = {
  downloadFileController,
  previewFileController,
};
