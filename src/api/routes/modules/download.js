const express = require("express");
const { uploadFiles, previewFile } = require("../../controllers/download");
const download = express.Router();

download.route("/:fileId").post(uploadFiles);
download.route("/:fileId/preview").get(previewFile);

module.exports = download;
