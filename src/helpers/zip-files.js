const AdmZip = require("adm-zip");

function compressFiles(files, archiverName, dirPath) {
  return new Promise(async(resolve, reject) => {
    try {
      const zip = new AdmZip();
      files.forEach((file) => {
        zip.addLocalFile(file.path, "", file.originalname);
      });
      zip.writeZip(dirPath + archiverName);
      resolve(dirPath + archiverName);
    } catch (error) {
      reject(error)
    }
  });
}

module.exports = {
  compressFiles: compressFiles,
};
