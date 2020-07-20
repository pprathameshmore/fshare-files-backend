const fs = require("fs");
const Container = require("typedi").Container;
const axios = require("axios").default;
const AdmZip = require("adm-zip");
const { Sequelize } = require("sequelize");
const isReachable = require("is-reachable");
const File = require("../models/file");
const { hashPassword } = require("../utils/utils");
const { BadRequest, NotFound, GeneralError } = require("../utils/errors");
const { config } = require("../configs/index");
const getFileSize = require("../utils/get-file-size");
const blobServiceClient = require("../configs/azure-blob-service");
const redisClient = require("../configs/redis");

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
    return await File.findByPk(fileId);
  }

  async uploadFiles(
    files,
    { message, expire, password, downloadLimit, userId }
  ) {
    try {
      const filePath = "uploads/";
      const fileName = `${userId}${Date.now()}fshare.zip`;

      const blobURI = `${config.AZURE.AZURE_STORAGE_CONNECTION_STRING}/${config.AZURE.CONTAINER_NAME}/${fileName}`;
      //Get path of container
      const fileContainerClient = blobServiceClient.getContainerClient("files");
      const blockBlobFile = fileContainerClient.getBlockBlobClient(fileName);
      const zip = new AdmZip();
      files.forEach((file) => {
        zip.addLocalFile(file.path, fileName, file.originalname);
      });
      zip.writeZip(filePath + fileName);
      const getReadableStream = fs.createReadStream(filePath + fileName);
      const blockBlobUploadResponse = await blockBlobFile.uploadStream(
        getReadableStream
      );
      const fileSize = getFileSize(filePath + fileName);
      if (blockBlobUploadResponse) {
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
        const { name } = file.toJSON();
        console.log(file.toJSON());
        //Remove file from Azure
        const blockBlobClient = blobServiceClient.getContainerClient("files");
        await blockBlobClient.deleteBlob(name);
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
        console.log("Deleting file");
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
        //Remove file from Azure
        const blockBlobClient = blobServiceClient.getContainerClient("files");
        await blockBlobClient.deleteBlob(name);
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
