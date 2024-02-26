const {
  register,
  verifyRegistration,
  signIn,
  sendOtp,
  verifyOtp,
  resetPassword,
  generateNewAccessToken,
  logout,
} = require("../controllers/authController");
const { errorHandler } = require("../middleware/errorHandler");
const {
  refreshTokenValidator,
  accessTokenValidator,
} = require("../middleware/jwt_validator");

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
router.post(
  "/log-out",
  errorHandler(accessTokenValidator),
  errorHandler(logout)
);

module.exports = router;
