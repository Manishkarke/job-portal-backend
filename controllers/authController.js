const userModel = require("../model/userModel");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  let errors = {};

  // Name validation
  if (!name || !name.trim()) errors = { ...errors, name: "Name is required" };
  else if (!name.match(/^[a-zA-Z\s]+$/))
    errors = { ...errors, name: "Name is invalid" };
  else errors = { ...errors, name: "" };

  // Email validation
  if (!email || !email.trim())
    errors = { ...errors, email: "Email is required" };
  else if (!email.match(emailRegex))
    errors = { ...errors, email: "Email is invalid" };
  else errors = { ...errors, email: "" };

  if (!password || !password.trim())
    errors = { ...errors, password: "Password is required" };
  else if (!password.match(/[A-Z]/))
    errors = {
      ...errors,
      password: "Password must contain atleast one uppercase character",
    };
  else if (!password.match(/[a-z]/))
    errors = {
      ...errors,
      password: "Password must contain at least one lowercase character",
    };
  else if (!password.match(/[0-9]/))
    errors = {
      ...errors,
      password: "Password must contain atleast one number",
    };
  else errors = { ...errors, password: "" };

  const userExist = await userModel.findOne({ email: email });
  if (userExist) {
    if (!userExist.isVerified) {
      return res.json({
        status: 400,
        message: "User is already registered but not verified.",
      });
    } else {
      return res.json({
        status: 400,
        message: "User is already registered.",
      });
    }
  }

  const otp = otpGenerator(); // Generate otp and return it

  const user = await userModel.create({
    name,
    email,
    password: bcrypt.hashSync(password, 10), // Hashing the password
    otp: otp,
  });
  const emailOption = {
    email: email,
    otp: otp,
    userName: name,
  };
  if (user) {
    sendEmail(emailOption);
    return res.json({ status: 200, message: "User registered successfully" });
  } else {
    return res.json({ status: 400, message: "User not registered" });
  }
};
