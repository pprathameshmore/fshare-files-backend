const DownloadServices = require("../../services/download");
const validator = require("validator");
const FileServices = require("../../services/file");
const { config } = require("../../configs/index");
const { response, isDefObject, isDefVar } = require("../../utils/utils");

exports.downloadFile = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res.status(400).json(response(400, "File is not valid", null));
  const { password } = req.body;
  if (isDefVar(password) && isDefObject(req.body)) {
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      password
    ).catch((error) => console.log(error));
    if (!isFileAvailable)
      return res
        .status(404)
        .json(
          response(404, "File may be not available or password is wrong", null)
        );
    return res.status(200).download(filePath);
  } else {
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      null
    ).catch((error) => console.log(error));
    if (!isFileAvailable)
      return res
        .status(404)
        .json(response(404, "File may be not available", null));
    return res.status(200).download(filePath);
  }
};

exports.previewFile = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res
      .status(400)
      .json(
        response(400, "File may be not available or entered invalid ID", null)
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
