const {
  changeToVendor,
  getAllVendors,
  getSingleVendor,
  deleteVendor,
  createCategory,
  getAllCategories,
  createBanner,
  getAllBanners,
  deleteBanner,
  deleteCategory,
  rejectVendor,
} = require("../controllers/adminController");
const { errorHandler } = require("../middleware/errorHandler");
const {
  accessTokenValidator,
  adminValidator,
} = require("../middleware/jwt_validator");

const router = require("express").Router();
const { multer, storage } = require("./../services/multerConfig");
const upload = multer({ storage: storage });

router.post(
  "/changeToVendor",
  errorHandler(accessTokenValidator),
  errorHandler(adminValidator),
  errorHandler(changeToVendor)
);

router.post(
  "/rejectVendor",
  errorHandler(accessTokenValidator),
  errorHandler(adminValidator),
  errorHandler(rejectVendor)
);

router.get(
  "/vendors",
  errorHandler(accessTokenValidator),
  errorHandler(adminValidator),
  errorHandler(getAllVendors)
);

router
  .route("/vendors/:id")
  .get(
    errorHandler(accessTokenValidator),
    errorHandler(adminValidator),
    errorHandler(getSingleVendor)
  )
  .delete(
    errorHandler(accessTokenValidator),
    errorHandler(adminValidator),
    errorHandler(deleteVendor)
  );

// category api
router.post(
  "/category",
  errorHandler(accessTokenValidator),
  errorHandler(adminValidator),
  upload.single("image"),
  errorHandler(createCategory)
);

router.delete(
  "/category/:id",
  errorHandler(accessTokenValidator),
  errorHandler(adminValidator),
  errorHandler(deleteCategory)
);

//banner api end
router.post(
  "/banner",
  upload.single("image"),
  errorHandler(accessTokenValidator),
  errorHandler(adminValidator),
  errorHandler(createBanner)
);

router.delete(
  "/banner/:id",
  errorHandler(accessTokenValidator),
  errorHandler(adminValidator),
  errorHandler(deleteBanner)
);

module.exports = router;
