const Container = require("typedi").Container;
const schedule = require("node-schedule");
const FileServices = require("../services/file");
const { addDay } = require("../utils/utils");

class DeleteFilesScheduler {
  async registerTask({ id, expire }) {
    const expireTime = parseInt(expire);
    const expireAt = addDay(expireTime);
    schedule.scheduleJob(expireAt, async () => {
      await FileServices.removeFile({
        fileId: id,
        userId: null,
      });
    });
  }
}
module.exports = Container.get(DeleteFilesScheduler);
