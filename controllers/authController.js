const userModel = require("../model/userModel");
const { authDataValidator } = require("../services/data_validator");
const {
  hashPasswordGenerator,
  comparePassword,
} = require("../services/hash_password");
const {
  createAccessToken,
  createRefreshToken,
} = require("../services/jwt_handler");
const { sendOtpMail } = require("../services/mail_service");
const otpGenerator = require("../services/otpGenerator");

// Registration route handler function
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
    const hashedPassword = await hashPasswordGenerator(password);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword, // Hashing the password
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

// Registration verification or OTP verification route handler function
module.exports.verifyRegistration = async (req, res) => {
  const { otp, email } = req.body;

  // otp and email verification
  if (!otp) throw "OTP is required";
  if (!email || !email.trim()) throw "Email is required";

  const emailExists = await userModel.findOne({ email: email });

  if (!emailExists) throw "Email is not registered.";

  if (emailExists.otp !== otp) {
    throw "otp didn't match";
  } else {
    await userModel.findByIdAndUpdate(
      emailExists._id,
      {
        otp: "",
        isVerified: true,
      },
      { new: true }
    );

    return res.json({
      status: "success",
      message: "User has been successfully verified.",
      data: null,
    });
  }
};

// Sign in route handler function
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  // Data Validation here
  let errors = authDataValidator(req.body, "sign in");
  let isFormValid = true;
  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }

  // Check if form is valid or not
  if (isFormValid) {
    const emailExists = await userModel.findOne({ email });
    if (!emailExists) {
      throw "Email is not registered.";
    }

    if (!emailExists.isVerified) {
      throw "The email is not verified.";
    } else {
      const passwordMatch = await comparePassword(
        password,
        emailExists.password
      );
      if (!passwordMatch) throw "Email or password does not match.";
      const accessToken = createAccessToken(email);
      const refreshToken = createRefreshToken(email);
      const userData = {
        _id: emailExists._id,
        email: emailExists.email,
        name: emailExists.name,
        role: emailExists.role,
        image: emailExists.image,
        reviews: emailExists.reviews,
        isVerified: emailExists.isVerified,
      };

      res.json({
        status: "success",
        message: "Welcome back! You have successfully logged in.",
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: userData,
        },
      });
    }
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

// Send OTP Route handler function
