const express = require("express");

const multer = require("../../../configs/multer");
const {
  getAllFilesController,
  uploadFilesToServerController,
  removeFileController,
} = require("../../controllers/file");
const files = express.Router();

files
  .route("/")
  .get(getAllFilesController)
  .post(multer.any(), uploadFilesToServerController);
files.route("/:fileId").delete(removeFileController);

module.exports = files;
