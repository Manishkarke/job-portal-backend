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
const { sendOtpMail, sendResetMail } = require("../services/mail_service");
const otpGenerator = require("../services/otpGenerator");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return res.json({
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
      const updatedUser = await userModel.findByIdAndUpdate(
        emailExists._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );

      // Saving my fresh token in the cookie
      res.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });

      return res.json({
        status: "success",
        message: "Welcome back! You have successfully logged in.",
        data: {
          accessToken: accessToken,
          user: userData,
        },
      });
    }
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

// Send OTP Route handler function
module.exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) throw "Email is required";
  if (!email.match(emailRegex)) throw "Email is invalid";

  const emailExists = await userModel.findOne({ email });
  if (!emailExists) throw "Email does not exist";

  const otp = otpGenerator();
  emailExists.otp = otp;
  await emailExists.save();

  const emailOption = {
    email: email,
    otp: otp,
    userName: emailExists.name,
  };
  sendResetMail(emailOption);
  return res.json({ status: "success", message: "Otp sent successfully" });
};

// Verify OTP for reset password route handler function
module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !email.trim()) throw "Email is required";
  else if (!email.match(emailRegex)) throw "Email is invalid";

  if (!otp || !otp.trim()) throw "OTP is required";

  const emailExists = await userModel.findOne({ email: email });
  if (!emailExists) throw "Email is not registered.";

  if (emailExists.otp !== otp) throw "The OTP entered is incorrect.";

  return res.json({
    status: 200,
    message: "Otp verified successfully.",
    data: null,
  });
};

// Reset password route handler function
module.exports.resetPassword = async (req, res) => {
  const { otp, email, password } = req.body;

  if (!email || !email.trim()) throw "Email is required";
  else if (!email.match(emailRegex)) throw "Email is invalid.";

  if (!otp || !otp.trim()) throw "The OTP is required";

  if (!password || !password.trim()) throw "Password is required";

  const user = await userModel.findOne({ email });
  if (!user) throw "User is not registered.";

  if (user.otp !== otp) throw "Otp was not verified for password reset.";

  user.otp = "";
  user.password = await hashPasswordGenerator(password);
  await user.save();

  return res.json({
    status: "success",
    message: "Password has been changed.",
    data: null,
  });
};

// Generate new access token route handler function
module.exports.generateNewAccessToken = async (req, res) => {
  const { user } = req.body;
  if (!user) throw "Failed to get data from cookie.";

  const newAccessToken = createAccessToken(user.email);
  const newRefreshToken = createRefreshToken(user.email);

  const updatedUser = await userModel.findByIdAndUpdate(
    user._id,
    {
      refreshToken: newRefreshToken,
    },
    { new: true }
  );
  if (!updatedUser) throw "Failed to create new access token";

  res.json({
    status: "success",
    message: "New access token has been generated successfully",
    data: newAccessToken,
  });
};
