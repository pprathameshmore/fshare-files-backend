const AdmZip = require("adm-zip");
const Container = require("typedi").Container;

class Archiver {
  constructor() {
    this.zip = new AdmZip();
  }
  compressFiles(files, archiverName, dirPath) {
    files.forEach((file) => {
      this.zip.addLocalFile(file.path, archiverName, file.originalname);
    });
    this.zip.writeZip(dirPath + archiverName);
  }
}

module.exports = Container.get(Archiver);
