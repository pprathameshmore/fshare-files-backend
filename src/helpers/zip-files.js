const AdmZip = require("adm-zip");
const Container = require("typedi").Container;

const zip = new AdmZip();
/* class Archiver {
  constructor() {
    this.zip = new AdmZip();
  }
  compressFiles(files, archiverName, dirPath) {
    files.forEach((file) => {
      this.zip.addLocalFile(file.path, null, file.originalname);
    });
    this.zip.writeZip(dirPath + archiverName);
  }
} */

function compressFiles(files, archiverName, dirPath) {
  files.forEach((file) => {
    zip.addLocalFile(file.path, null, file.originalname);
  });
  zip.writeZip(dirPath + archiverName);
}

module.exports = {
  compressFiles: compressFiles,
};
