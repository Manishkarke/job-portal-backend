const express = require("express");
const {
  registerAsVendor,
  getAllJobs,
  getSingleJob,
  getJobByCategories,
  applyJob,
  rateVendor,
  getAllAppliedJobs,
  getSingleAppliedJob,
} = require("../controllers/userController");
const {
  accessTokenValidator,
  userValidator,
} = require("../middleware/jwt_validator");
const router = express.Router();
const { multer, storage } = require("./../services/multerConfig");
const { paymentVerify } = require("../services/khaltiPayment");
const { errorHandler } = require("../middleware/errorHandler");
const upload = multer({ storage: storage });

// Register as a vendor
router
  .route("/registerAsVendor")
  .post(
    errorHandler(accessTokenValidator),
    errorHandler(userValidator),
    errorHandler(registerAsVendor)
  );

// jobs
router.route("/jobs").get(errorHandler(getAllJobs));
router.route("/jobs/:id").get(errorHandler(getSingleJob));
router.route("/jobs/category/:id").get(errorHandler(getJobByCategories));

// apply job
router
  .route("/jobs/apply")
  .post(
    errorHandler(accessTokenValidator),
    errorHandler(userValidator),
    upload.single("cv"),
    errorHandler(applyJob)
  );

router
  .route("/appliedJobs")
  .get(
    errorHandler(accessTokenValidator),
    errorHandler(userValidator),
    errorHandler(getAllAppliedJobs)
  );
router
  .route("/appliedJobs/:id")
  .get(
    errorHandler(accessTokenValidator),
    errorHandler(userValidator),
    errorHandler(getSingleAppliedJob)
  );

//rating
router
  .route("/rate/:id")
  .post(
    errorHandler(accessTokenValidator),
    errorHandler(userValidator),
    errorHandler(rateVendor)
  );

// khalti
router
  .route("/pay")
  .post(
    errorHandler(accessTokenValidator),
    errorHandler(userValidator),
    errorHandler(paymentVerify)
  );

module.exports = router;
