const { Sequelize, Model } = require("sequelize");

const sequelize = require("../loaders/database");

const User = require("../models/user");

class File extends Model {}

File.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    path: {
      type: Sequelize.STRING,
    },
    shortUrl: {
      type: Sequelize.STRING,
    },
    downloads: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    downloadLimit: {
      type: Sequelize.INTEGER,
      defaultValue: 100,
    },
    message: {
      type: Sequelize.TEXT,
      defaultValue: "File shared using FShare",
    },
    expire: {
      type: Sequelize.ENUM,
      values: ["1", "2", "3", "4", "5", "6", "7"],
      defaultValue: "1",
    },
    fileSize: {
      type: Sequelize.TEXT,
    },
    password: {
      type: Sequelize.STRING,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: true,
    modelName: "file",
    tableName: "file",
    sequelize,
  }
);

File.belongsTo(User, { constraints: true, foreignKeyConstraint: true });

//File.sync({ force: true });

module.exports = File;
