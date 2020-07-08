const express = require("express");
const multer = require("../../../configs/multer");
const {
  getAllFiles,
  uploadFiles,
  removeFile,
} = require("../../controllers/file");
const files = express.Router();

files.route("/").get(getAllFiles).post(multer.any(), uploadFiles);

files.route("/:fileId").delete(removeFile);

module.exports = files;
