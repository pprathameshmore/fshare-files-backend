module.exports = (app) => {
  require("./express")(app);
  require("./database");
  require("../configs/azureBlobService");
};
