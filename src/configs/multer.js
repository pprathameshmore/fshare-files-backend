const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const timestamp = Date.now().toString();
    req.on("aborted", () => {
      setTimeout(() => {
        if (fs.existsSync(`uploads/${timestamp}${file.originalname}`)) {
          fs.unlink(`uploads/${timestamp}${file.originalname}`, (error) => {
            if (error) {
              console.log(error);
            }
            return;
          });
        } else {
          console.log("File not exists");
        }
      }, 10000);
    });
    cb(null, timestamp + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
});

module.exports = multer({ storage: storage });
