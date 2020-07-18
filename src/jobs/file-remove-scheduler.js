const Container = require("typedi").Container;
const schedule = require("node-schedule");
const FileServices = require("../services/file");
const { addDay } = require("../utils/utils");

class DeleteFilesScheduler {
  async registerTask({ id, expire }) {
    const expireTime = parseInt(expire);
    const hoursRemaining = expireTime * 24;
    const milliseconds = hoursRemaining * 60 * 60 * 100;
    const expireAt = addDay(parseInt(expire));
    console.log(expireAt);

    schedule.scheduleJob(expireAt, async () => {
      console.log("Job scheduled" + expireAt);
      await FileServices.removeFile({
        fileId: id,
        userId: null,
      }).catch((error) => console.log(error));
    });

    /*   setTimeout(async () => {
      await FileServices.removeFile({
        fileId: id,
        userId: null,
      }).catch((error) => console.log(error));
    }, milliseconds); */
  }
}
module.exports = Container.get(DeleteFilesScheduler);
