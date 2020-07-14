const fs = require("fs");
const Container = require("typedi").Container;
const FileServices = require("../services/file");
const File = require("../models/file");
const { checkPassword } = require("../utils/utils");
const { BadRequest, NotFound, GeneralError } = require("../utils/errors");

class DownloadServices {
  async countDownloads(fileId) {
    try {
      await File.increment("downloads", {
        where: {
          id: fileId,
        },
        returning: false,
      });
    } catch (error) {
      throw new GeneralError(error);
    }
  }

  async downloadFile(fileId, givenPassword) {
    const getFile = await File.findByPk(fileId).catch((error) => {
      throw new GeneralError(error);
    });
    if (getFile === null)
      return {
        isFileAvailable: false,
        filePath: null,
      };
    const { path, downloads, downloadLimit, password } = getFile.toJSON();
    if (password) {
      if (!givenPassword) {
        return {
          isFileAvailable: false,
          filePath: null,
        };
      }
      const isCorrect = await checkPassword(givenPassword, password).catch(
        (error) => {
          throw new GeneralError(error);
        }
      );
      if (!isCorrect)
        return {
          isFileAvailable: false,
          filePath: null,
        };
      if (downloads === downloadLimit) {
        await FileServices.removeFile({
          fileId,
          userId: null,
        });
        return {
          isFileAvailable: false,
          filePath: null,
        };
      }
      await this.countDownloads(fileId);
      return {
        isFileAvailable: true,
        filePath: path,
      };
    } else {
      if (downloads === downloadLimit) {
        await FileServices.removeFile({
          fileId,
          userId: null,
        });
        return {
          isFileAvailable: false,
          filePath: null,
        };
      }
      await this.countDownloads(fileId);
      return {
        isFileAvailable: true,
        filePath: path,
      };
    }
  }
}

module.exports = DownloadServices = Container.get(DownloadServices);
