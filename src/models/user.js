const { Sequelize, Model } = require("sequelize");

const sequelize = require("../loaders/database");

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
    refreshToken: {
      type: Sequelize.STRING,
    },
    premium: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      require: true,
    },
    role: {
      type: Sequelize.ENUM,
      values: ["ADMIN", "USER"],
      defaultValue: "USER",
    },
    profilePhoto: {
      type: Sequelize.STRING,
      validate: {
        isUrl: true,
      },
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

//User.hasMany(File);

//User.sync({ force: true });

module.exports = User;
