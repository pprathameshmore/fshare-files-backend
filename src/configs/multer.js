const fs = require("fs");
const multer = require("multer");
const azureStorage = require("./azure-multer");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const timestamp = Date.now().toString();
    console.log(file);
    req.on("aborted", () => {
      console.log("Upload canceled by user");
      setTimeout(() => {
        fs.unlink(`uploads/${timestamp}${file.originalname}`, () => {
          console.log(`uploads/${timestamp}${file.originalname}`);
        });
      }, 5000);
    });
    cb(null, timestamp + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
});

module.exports = multer({ storage: storage });
