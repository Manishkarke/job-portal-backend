const { register } = require("../controllers/authController");
const { errorHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/register", errorHandler(register));
router.post("/sign-in", errorHandler())

module.exports = router;
