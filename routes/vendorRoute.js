const {
  createJob,
  individualVendorJobs,
  deleteJob,
  viewSingleJob,
  myApplicants,
  acceptOrRejectApplicant,
} = require("../controller/vendor/vendorController");
const { errorHandler } = require("../middleware/errorHandler");
const {
  accessTokenValidator,
  vendorValidator,
} = require("../middleware/jwt_validator");
const router = require("express").Router();

// Job Related
router
  .route("/jobs")
  .post(
    errorHandler(accessTokenValidator),
    errorHandler(vendorValidator),
    errorHandler(createJob)
  )
  .get(
    errorHandler(accessTokenValidator),
    errorHandler(vendorValidator),
    errorHandler(individualVendorJobs)
  );

router
  .route("/jobs/:id")
  .delete(
    errorHandler(accessTokenValidator),
    errorHandler(vendorValidator),
    errorHandler(deleteJob)
  )
  .get(
    errorHandler(accessTokenValidator),
    errorHandler(vendorValidator),
    errorHandler(viewSingleJob)
  );

//application
router
  .route("/applicants")
  .get(
    errorHandler(accessTokenValidator),
    errorHandler(vendorValidator),
    errorHandler(myApplicants)
  );
router
  .route("/applicants/action")
  .post(
    errorHandler(accessTokenValidator),
    errorHandler(vendorValidator),
    errorHandler(acceptOrRejectApplicant)
  );

module.exports = router;
