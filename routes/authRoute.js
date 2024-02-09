const {
  register,
  verifyRegistration,
  signIn,
} = require("../controllers/authController");
const { errorHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/register", errorHandler(register));
router.post("/verify-registration", errorHandler(verifyRegistration));
router.post("/sign-in", errorHandler(signIn));

module.exports = router;
