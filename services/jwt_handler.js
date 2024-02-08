const jwt = require("jsonwebtoken");

module.exports.createAccessToken = (userEmail) => {
  const accessToken = jwt.sign(
    { email: userEmail },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return accessToken;
};
module.exports.createRefreshToken = (userEmail) => {
  const refreshToken = jwt.sign(
    { email: userEmail },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "3d" }
  );

  return refreshToken;
};

module.exports.validateAccessToken = (accessToken) => {
  try {
    const jwtVerification = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    return jwtVerification.email;
  } catch (error) {
    if (
      error.message === "jwt malformed" ||
      error.message === "invalid token"
    ) {
      throw "Please provide a valid token. error message: " + error.message;
    }

    if (error.message === "jwt expired") throw "The access token is expired";
  }
};

module.exports.validateRefreshToken = (refreshToken) => {
  try {
    const jwtVerification = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
  } catch (error) {
    if (
      error.message === "jwt malformed" ||
      error.message === "invalid token"
    ) {
      throw "Please provide a valid token. error message: " + error.message;
    }

    if (error.message === "jwt expired") throw "The refresh token is expired";
  }
};
