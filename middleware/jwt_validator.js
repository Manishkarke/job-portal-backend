const userModel = require("../model/userModel");
const jwtHanlder = require("../services/jwt_handler");

module.exports.accessTokenValidator = async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken || bearerToken.trim() === "")
    throw "Access token is required.";

  const token = bearerToken.split(" ")[1];
  const userEmail = jwtHanlder.validateAccessToken(token);

  const user = await userModel
    .findOne({ email: userEmail })
    .select("-password");

  if (!user) throw "User not found with email: " + userEmail;
  req.body.user = user;
  next();
};

// TODO: Add refresh token validator middleware
module.exports.refreshTokenValidator = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw "Refresh Token not found";

  const foundUser = await userModel
    .findOne({ refreshToken: refreshToken })
    .select("-password");
  if (!foundUser) throw "User don't have refresh token";

  const userEmail = jwtHanlder.validateRefreshToken(refreshToken);
  if (foundUser.email !== userEmail) throw "Refresh token did not match";

  req.body.user = foundUser;
  next();
};

// User validator
module.exports.userValidator = async (req, res, next) => {
  const { user } = req.body;

  console.log(user.role);
  if (user.role !== "user") {
    throw "You are not a user.";
  }
  next();
};

// Validate if user type is vendor
module.exports.vendorValidator = async (req, res, next) => {
  const { user } = req.body;

  console.log("user: ", user);
  if (user.role !== "vendor") {
    throw "You are not a vendor.";
  }
  next();
};

// Validate if user type is admin
module.exports.adminValidator = async (req, res, next) => {
  console.error("req.body: ", req.body);
  const { user } = req.body;
  if (user.role !== "admin") throw "You are not a admin.";
  next();
};
