const { Sequelize, Model } = require("sequelize");

const sequelize = require("../loaders/database");

const File = require("../models/file");

class User extends Model {}

User.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    token: {
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
    modelName: "users",
    tableName: "users",
    sequelize,
  }
);

//User.sync({ force: true });

module.exports = User;
