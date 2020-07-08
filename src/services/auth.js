const Container = require("typedi").Container;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { config } = require("../configs/index");
const { GeneralError } = require("../utils/errors");

class AuthServices {
  async checkUser(email) {
    try {
      return await User.findOne({ where: { email: email } });
    } catch (error) {
      throw new GeneralError(error);
    }
  }

  async googleAuthReactClient({ email, googleToken, username }) {
    const foundUser = await User.findOne({
      where: {
        email: email,
      },
    }).catch((error) => {
      throw new GeneralError(error);
    });
    if (!foundUser) {
      const userCreated = await User.create({
        email: email,
        username: username,
        token: googleToken,
      }).catch((error) => {
        throw new GeneralError(error);
      });
      const { id } = userCreated.toJSON();
      const userEmail = userCreated.toJSON().email;
      const token = jwt.sign(
        {
          userId: id,
          email: userEmail,
          createAt: Date.now,
        },
        config.JWT_KEY,
        {
          expiresIn: config.JWT_EXPIRES,
        }
      );
      return {
        isFound: false,
        sendToken: token,
        user: userCreated,
      };
    } else {
      /* //Create new user
            const userCreated = await User.create({
                email: email,
                username: username,
                token: googleToken
            }).catch(error => {
                throw new GeneralError(error);
            });
            const { id } = foundUser.toJSON();
            const userEmail = foundUser.toJSON().email;
            const token = jwt.sign({
                userId: id,
                email: userEmail,
                createAt: Date.now
            }, config.JWT_KEY, {
                expiresIn: config.JWT_EXPIRES
            });
            return {
                isFound: false,
                sendToken: token,
                user: userCreated
            } */
      console.log("Logged");
    }
  }

  async googleSignIn({ email }) {
    const foundUser = await this.checkUser(email).catch((error) => {
      console.log(error);
      throw new GeneralError(error);
    });
    const { id } = foundUser.toJSON();
    const userEmail = foundUser.toJSON().email;
    const token = jwt.sign(
      {
        userId: id,
        email: userEmail,
        createAt: Date.now,
      },
      config.JWT_KEY,
      {
        expiresIn: config.JWT_EXPIRES,
      }
    );
    return {
      isFound: true,
      sendToken: token,
      user: foundUser.toJSON(),
    };
  }
}
module.exports = AuthServices = Container.get(AuthServices);
