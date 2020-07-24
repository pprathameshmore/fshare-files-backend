const fs = require("fs");
const Container = require("typedi").Container;
const axios = require("axios").default;
const { Sequelize } = require("sequelize");
const isReachable = require("is-reachable");
const File = require("../models/file");
const { hashPassword, getFileSize } = require("../utils/utils");
const { GeneralError } = require("../utils/errors");
const { config } = require("../configs/index");
const redisClient = require("../configs/redis");
const Archiver = require("../helpers/zip-files");
const AzureBlobServices = require("../services/azure-blob");

class FileServices {
  async getFiles(userId) {
    try {
      redisClient.get(userId, (error, files) => {
        if (error) {
          console.log(error);
        }
        return JSON.parse(files);
      });
      const files = await File.findAll({
        where: {
          userId: userId,
        },
        order: [["createdAt", "DESC"]],
      });
      redisClient.setex(userId, 10, JSON.stringify(files));
      return files;
    } catch (error) {
      console.log(error);
    }
  }

  async getFile(fileId) {
    redisClient.get(fileId, (error, file) => {
      if (error) {
        throw new GeneralError(error);
      }
      return JSON.parse(file);
    });
    try {
      const file = await File.findByPk(fileId);
      redisClient.setex(fileId, 60, JSON.stringify(file));
      return file;
    } catch (error) {
      throw new GeneralError(error);
    }
  }

  async uploadFiles(
    files,
    { message, expire, password, downloadLimit, userId }
  ) {
    try {
      const filePath = "uploads/";
      const fileName = `${userId}${Date.now()}fshare.zip`;
      const blobURI = `${config.AZURE.BLOB_URL}${fileName}`;
      Archiver.compressFiles(files, fileName, filePath);
      const fileSize = getFileSize(filePath + fileName);
      const blockBlobUploadResponse = await AzureBlobServices.uploadFileToBlob({
        blobName: fileName,
        dirName: filePath,
      });
      if (blockBlobUploadResponse._response.status === 201) {
        files.forEach((file) => {
          fs.unlink(file.path, (error) => console.log(error));
        });
        fs.unlink(filePath + fileName, (error) => {
          console.log(error);
        });
      }
      if (password) {
        var hashedPassword = await hashPassword(password);
      }
      const uploadedFiles = await File.create({
        name: fileName,
        path: blobURI,
        message: message,
        expire: expire,
        password: hashedPassword,
        fileSize: fileSize,
        userId: userId,
        downloadLimit: downloadLimit,
      }).catch((error) => {
        throw new GeneralError(error);
      });

      const { id } = uploadedFiles.toJSON();
      if (isReachable(`https://ftinyurl.azurewebsites.net/`)) {
        const response = await axios.post(
          `https://ftinyurl.azurewebsites.net/api/v1/urls`,
          {
            originalUrl: `https://fshare.netlify.app/download/${id}`,
          }
        );
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
      require("../jobs/file-remove-scheduler").registerTask(
        uploadedFiles.toJSON()
      );
      return {
        uploadedFiles,
      };
    } catch (error) {
      console.log(error);
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
        const { name } = file.toJSON();
        console.log(file.toJSON());
        await AzureBlobServices.removeFileFromBlob(name);
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
      if (userId === null || !userId || userId === undefined) {
        const file = await File.findOne({
          where: Sequelize.and({
            id: fileId,
          }),
        });
        if (file === null)
          return {
            fileRemoved: false,
            fileMeta: null,
          };
        const { name } = file.toJSON();
        await AzureBlobServices.removeFileFromBlob(name);
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
      throw new GeneralError(error);
    }
  }
}
module.exports = Container.get(FileServices);
