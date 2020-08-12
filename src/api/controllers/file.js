const validator = require("validator");
const FileServices = require("../../services/file");

const { response, isDefVar } = require("../../utils/utils");

const getAllFilesController = async (req, res, next) => {
  const { userId } = req.user;
  if (!userId)
    return res.status(401).json(response(401, "User required", null));
  const files = await FileServices.getFiles(userId);
  return res.status(200).json(response(200, "All files", files));
};

const uploadFilesToServerController = async (req, res, next) => {
  const { message, expire, password, downloadLimit } = req.body;
  const { userId } = req.user;
  if (!userId)
    return res.status(401).json(response(401, "User required", null));
  if (req.files === undefined || req.files.length === 0) {
    return res.status(400).send("File required");
  }
  const { uploadedFiles } = await FileServices.uploadFiles(req.files, {
    message,
    expire,
    password,
    downloadLimit,
    userId,
  }).catch((error) => {
    return res.status(400).send(error);
  });
  const fileMeta = {
    id: uploadedFiles.id,
    name: uploadedFiles.name,
    message: uploadedFiles.message,
    downloadLimit: uploadedFiles.downloadLimit,
    expire: uploadedFiles.expire,
    fileSize: uploadedFiles.fileSize,
    shortUrl: uploadedFiles.shortUrl,
  };
  return res.status(201).json(response(201, "Files uploaded", fileMeta));
};

const removeFileController = async (req, res, next) => {
  const { fileId } = req.params;
  const { userId } = req.user;
  if (!userId)
    return res.status(401).json(response(401, "User required", null));
  if (!validator.isUUID(fileId))
    return res.status(400).json(response(200, "File ID is not valid", null));
  if (!validator.isUUID(userId) && !isDefVar(userId))
    return res.status(400).send("userId is not valid");
  const { fileRemoved, fileMeta } = await FileServices.removeFile({
    fileId,
    userId,
  });
  if (!fileRemoved)
    return res
      .status(200)
      .json(response(200, "You are not allowed to remove this file", fileMeta));
  return res.status(200).json(response(200, "File removed", fileMeta)).end();
};

module.exports = {
  getAllFilesController,
  uploadFilesToServerController,
  removeFileController,
};
