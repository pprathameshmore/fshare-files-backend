const multer = require("multer");
const azureStorage = require("./azure-multer");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
});

module.exports = multer({ storage: storage });
