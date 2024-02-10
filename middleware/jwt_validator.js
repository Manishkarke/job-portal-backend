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
// module.exports.refreshTokenValidator = async (req, res, next) => {
//   const
// }

// User validator
module.exports.userValidator = (req, res, next) => {
  const { user } = req.body;

  console.log(user.role);
  if (user.role !== "user") {
    throw "You are not a user.";
  }
  next();
};

// Validate if user type is vendor
module.exports.vendorValidator = (req, res, next) => {
  const { user } = req.body;

  console.log(user.role);
  if (user.role !== "vendor") {
    throw "You are not a vendor.";
  }
  next();
};

// Validate if user type is admin
module.exports.adminValidator = (req, res, next) => {
  console.error("req.body: ", req.body);
  const { user } = req.body;
  console.log("user.role: ", user.role);
  if (user.role !== "admin") throw "You are not a admin.";
  console.log("user.role 2: ", user.role);
  next();
};
