const cron = require("node-cron");
const Container = require("typedi").Container;
const fs = require("fs");
const FileServices = require("../services/file");

class DeleteFilesScheduler {
  async registerTask({ id, expire }) {
    const expireTime = parseInt(expire);
    const hoursRemaining = expireTime * 24;
    const milliseconds = hoursRemaining * 60 * 60 * 100;
    setTimeout(async () => {
      await FileServices.removeFile({
        fileId: id,
        userId: null,
      }).catch((error) => console.log(error));
    }, milliseconds);
  }
}
module.exports = Container.get(DeleteFilesScheduler);
