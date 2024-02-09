const {
  register,
  verifyRegistration,
  signIn,
  sendOtp,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");
const { errorHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/register", errorHandler(register));
router.post("/verify-registration", errorHandler(verifyRegistration));
router.post("/sign-in", errorHandler(signIn));

router.post("/send-otp", errorHandler(sendOtp));
router.post("/verify-otp", errorHandler(verifyOtp));
router.post("/reset-password", errorHandler(resetPassword));

module.exports = router;
