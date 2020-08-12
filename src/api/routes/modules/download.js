const express = require("express");
const {
  downloadFileController,
  previewFileController,
} = require("../../controllers/download");
const download = express.Router();

download.route("/:fileId").post(downloadFileController);
download.route("/:fileId/preview").get(previewFileController);

module.exports = download;
