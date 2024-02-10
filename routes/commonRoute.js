const router = require("express").Router();
const multer = require("multer");
const {
  getProfile,
  editProfile,
  getAllCategories,
  getAllBanners,
} = require("../controllers/commonController");
const { errorHandler } = require("../middleware/errorHandler");
const { accessTokenValidator } = require("../middleware/jwt_validator");

const { storage } = require("../services/multerConfig");
const upload = multer({ storage: storage });

router.get(
  "/profile",
  errorHandler(accessTokenValidator),
  errorHandler(getProfile)
);
router.patch(
  "/profile",
  upload.single("image"),
  errorHandler(accessTokenValidator),
  errorHandler(editProfile)
);

router.get(
  "/category",
  errorHandler(accessTokenValidator),
  errorHandler(getAllCategories)
);

router.get("/banners", errorHandler(getAllBanners));

module.exports = router;
