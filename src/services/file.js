const fs = require("fs");
const Container = require("typedi").Container;
const axios = require("axios").default;
const archiver = require("archiver");
const { Sequelize } = require("sequelize");
const isReachable = require("is-reachable");
const File = require("../models/file");
const { hashPassword } = require("../utils/utils");
const { BadRequest, NotFound, GeneralError } = require("../utils/errors");
const { config } = require("../configs/index");

class FileServices {
  async getFiles(userId) {
    try {
      return await File.findAll({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getFile(fileId) {
    return await File.findByPk(fileId);
  }

  async uploadFiles(
    files,
    { message, expire, password, downloadLimit, userId }
  ) {
    try {
      const filePath = "uploads/";
      const fileName = `${userId}${Date.now()}send-files.zip`;
      const output = fs.createWriteStream(filePath + fileName);
      const archive = archiver("zip", {
        zlib: {
          level: 9,
        }, // Sets the compression level.
      });
      archive.pipe(output);
      files.forEach((file) => {
        archive.append(fs.createReadStream(file.path), {
          name: `${file.originalname}`,
        });
      });
      await archive.finalize().catch((error) => {
        throw new GeneralError(error);
      });
      files.forEach((file) => {
        fs.unlink(file.path, (error) => console.log(error));
      });
      if (password) {
        var hashedPassword = await hashPassword(password);
      }
      const uploadedFiles = await File.create({
        name: fileName,
        path: filePath + fileName,
        message: message,
        expire: expire,
        password: hashedPassword,
        userId: userId,
        downloadLimit: downloadLimit,
      }).catch((error) => {
        throw new GeneralError(error);
      });
      const { id } = uploadedFiles.toJSON();
      if (await isReachable(`${config.SHORT_URL_HOST}/api/urls`)) {
        const response = await axios.post(`${config.SHORT_URL_HOST}/api/urls`, {
          originalUrl: `${config.HOSTNAME}:${config.PORT}/api/v1/download/${id}/preview`,
        });
        await File.update(
          {
            shortUrl: response.data.data.link,
          },
          {
            where: {
              id: id,
            },
          }
        ).catch((error) => {
          throw new GeneralError(error);
        });
      }
      require("../jobs/deleteFile").registerTask(uploadedFiles.toJSON());
      return {
        uploadedFiles,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequest(error);
    }
  }

  async removeFile({ fileId, userId }) {
    try {
      if (userId) {
        const file = await File.findOne({
          where: Sequelize.and({
            id: fileId,
            userId: userId,
          }),
        });
        if (file === null)
          return {
            fileRemoved: false,
            fileMeta: null,
          };
        const { path } = file.toJSON();
        fs.unlink(path, (error) => console.log(error));
        await File.destroy({
          where: {
            id: fileId,
          },
        });
        return {
          fileRemoved: true,
          fileMeta: file,
        };
      }
    } catch (error) {
      console.log(error);
      throw new NotFound("File is not found");
    }
  }
}
module.exports = Container.get(FileServices);
