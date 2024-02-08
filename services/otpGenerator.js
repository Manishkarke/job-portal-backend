const otp = require("otp-generator");

module.exports = function otpGenerator() {
  const generatedOtp = otp.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  return `${generatedOtp}`;
};
