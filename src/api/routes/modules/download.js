const express = require("express");
const { downloadFile, previewFile } = require("../../controllers/download");
const download = express.Router();

download.route("/:fileId").post(downloadFile);
download.route("/:fileId/preview").get(previewFile);

module.exports = download;
