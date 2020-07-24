const DownloadServices = require("../../services/download");
const validator = require("validator");
const FileServices = require("../../services/file");
const { config } = require("../../configs/index");
const { response, isDefObject, isDefVar } = require("../../utils/utils");
const { generateSASToken } = require("../../helpers/generate-sas-token");

exports.downloadFile = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res.status(400).json(response(400, "File is not valid", null)).end();
  const { password } = req.body;
  if (isDefVar(password) && isDefObject(req.body)) {
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      password
    ).catch((error) => console.log(error));
    if (!isFileAvailable)
      return res
        .status(404)
        .json(response(404, "File not available or password is wrong", null));
    const token = generateSASToken();
    const blobURLAuth = `${config.AZURE.BLOB_URL}${filePath}?${token}`;
    return res
      .status(200)
      .json(response(200, "File Download", { downloadURL: blobURLAuth }));
  } else {
    const { isFileAvailable, filePath } = await DownloadServices.downloadFile(
      fileId,
      null
    ).catch((error) => console.log(error));
    if (!isFileAvailable)
      return res.status(404).json(response(404, "File not available", null));
    const token = generateSASToken();
    const blobURLAuth = `${config.AZURE.BLOB_URL}${filePath}?${token}`;
    return res
      .status(200)
      .json(response(200, "File Download", { downloadURL: blobURLAuth }));
  }
};

exports.previewFile = async (req, res, next) => {
  const { fileId } = req.params;
  if (!validator.isUUID(fileId))
    return res
      .status(400)
      .json(response(400, "File not available or entered invalid ID", null))
      .end();
  const fileDetails = await FileServices.getFile(fileId).catch((error) =>
    console.log(error)
  );
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
