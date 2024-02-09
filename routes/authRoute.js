const { errorHandler } = require("../middleware/errorHandler");

const router = require("express").Router();

router.post("/register", errorHandler())

module.exports = router;