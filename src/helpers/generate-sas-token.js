const {
  StorageSharedKeyCredential,
  BlobSASPermissions,
  SASProtocol,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");
const { config } = require("../configs/index");

exports.generateSASToken = () => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    config.AZURE.AZURE_STORAGE_NAME,
    config.AZURE.AZURE_ACCOUNT_KEY
  );

  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() - 1);
  const expireDate = new Date();
  expireDate.setMinutes(startDate.getMinutes() + 1);

  const result = generateBlobSASQueryParameters(
    {
      containerName: config.AZURE.CONTAINER_NAME,
      startsOn: startDate,
      expiresOn: expireDate,
      permissions: BlobSASPermissions.parse("r"),
      protocol: SASProtocol.HttpsAndHttp,
    },
    sharedKeyCredential
  );
  return result.toString();
};
