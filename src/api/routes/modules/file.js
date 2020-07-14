const express = require("express");

const multer = require("../../../configs/multer");
const {
  getAllFiles,
  uploadFiles,
  removeFile,
} = require("../../controllers/file");
const files = express.Router();

files.route("/").get(getAllFiles).post(multer.any(), uploadFiles);

files.route("/upload").get((req, res, next) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    '<form action="/api/v1/files/" method="post" enctype="multipart/form-data">'
  );
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit">');
  res.write("</form>");
  return res.end();
});

files.route("/:fileId").delete(removeFile);

module.exports = files;
