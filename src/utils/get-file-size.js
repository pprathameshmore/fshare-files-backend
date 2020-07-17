const fs = require("fs");
module.exports = (filePath) => {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
};
