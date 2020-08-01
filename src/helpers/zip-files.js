const AdmZip = require("adm-zip");

function compressFiles(files, archiverName, dirPath) {
  const zip = new AdmZip();
  files.forEach((file) => {
    zip.addLocalFile(file.path, "", file.originalname);
  });
  zip.writeZip(dirPath + archiverName);
}

module.exports = {
  compressFiles: compressFiles,
};
