const express = require("express");
const router = express.Router();
const fileRouter = require("./modules/file");
const downloadRouter = require("./modules/download");
const { isAuthenticated } = require("../middlewares/isAuth");

router.use("/v1/files", isAuthenticated, fileRouter);
router.use("/v1/downloads", downloadRouter);

module.exports = router;
