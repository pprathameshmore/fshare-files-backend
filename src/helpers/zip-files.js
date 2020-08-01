const AdmZip = require("adm-zip");

const zip = new AdmZip();

function compressFiles(files, archiverName, dirPath) {
  files.forEach((file) => {
    zip.addLocalFile(file.path, null, file.originalname);
  });
  zip.writeZip(dirPath + archiverName);
}

delete zip;

module.exports = {
  compressFiles: compressFiles,
};
