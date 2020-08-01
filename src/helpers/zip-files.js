const AdmZip = require("adm-zip");

function compressFiles(files, archiverName, dirPath) {
  const zip = new AdmZip();
  files.forEach((file) => {
    zip.addLocalFile(file.path, null, file.originalname);
  });
  zip.writeZip(dirPath + archiverName);
  delete zip;
}

module.exports = {
  compressFiles: compressFiles,
};
