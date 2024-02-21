const {
  register,
  verifyRegistration,
  signIn,
  sendOtp,
  verifyOtp,
  resetPassword,
  generateNewAccessToken,
} = require("../controllers/authController");
const { errorHandler } = require("../middleware/errorHandler");
const { refreshTokenValidator } = require("../middleware/jwt_validator");

const router = require("express").Router();

router.post("/register", errorHandler(register));
router.post("/verify-registration", errorHandler(verifyRegistration));
router.post("/sign-in", errorHandler(signIn));

router.post("/send-otp", errorHandler(sendOtp));
router.post("/verify-otp", errorHandler(verifyOtp));
router.post("/reset-password", errorHandler(resetPassword));

router.post(
  "/generateAccessToken",
  errorHandler(refreshTokenValidator),
  errorHandler(generateNewAccessToken)
);

module.exports = router;
