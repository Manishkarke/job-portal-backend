const userModel = require("../model/userModel");
const { authDataValidator } = require("../services/data_validator");
const { hashPasswordGenerator } = require("../services/hash_password");
const { sendOtpMail } = require("../services/mail_service");
const otpGenerator = require("../services/otpGenerator");

// Registration function
module.exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  let errors = authDataValidator(req.body, "registration");
  let isFormValid = true;
  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }
  if (isFormValid) {
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      if (!userExist.isVerified) {
        throw "User already exist but is not verified";
      } else {
        throw "User already exist.";
      }
    }

    const otp = otpGenerator();

    const user = await userModel.create({
      name,
      email,
      password: hashPasswordGenerator(password), // Hashing the password
      otp: otp,
    });
    if (!user) throw "User registration failed";
    const emailOption = {
      email: email,
      otp: otp,
      userName: name,
    };
    sendOtpMail(emailOption);
    res.json({
      status: "success",
      message: "User registration successfull",
      data: null,
    });
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};


