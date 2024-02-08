const express = require("express");
const {
  register,
  logIn,
  registerAsVendor,
  getAllJobs,
  getSingleJob,
  getJobByCategory,
  getJobByCategories,
  applyJob,
  rateVendor,
  editProfile,
  getProfile,
  getAllAppliedJobs,
  getSingleAppliedJob,
  verifyRegistration,
  sendOtp,
  verifyOtp,
  resetPassword,
} = require("../controller/user/userController");
const { isAuthenticated, userRole } = require("../middleware/isAuthenticated");
const router = express.Router();
const { multer, storage } = require("./../services/multerConfig");
const { paymentVerify } = require("../services/khaltiPayment");
const upload = multer({ storage: storage });

router.route("/register").post(register);
router.route("/verifyEmail").post(verifyRegistration);
router.route("/login").post(logIn);
router
  .route("/registerAsVendor")
  .post(isAuthenticated, userRole("user"), registerAsVendor);
router.route("/send-otp").post(sendOtp); 
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

// jobs
router.route("/jobs").get(getAllJobs);
router.route("/jobs/:id").get(getSingleJob);
router.route("/jobs/category/:id").get(getJobByCategories);

// apply job
router
  .route("/jobs/apply")
  .post(isAuthenticated, userRole("user"), upload.single("cv"), applyJob);

router
  .route("/appliedJobs")
  .get(isAuthenticated, userRole("user"), getAllAppliedJobs);
router
  .route("/appliedJobs/:id")
  .get(isAuthenticated, userRole("user"), getSingleAppliedJob);

//rating
router.route("/rate/:id").post(isAuthenticated, userRole("user"), rateVendor);

//profile
router
  .route("/profile")
  .patch(isAuthenticated, userRole("user"), upload.single("image"), editProfile)
  .get(isAuthenticated, userRole("user"), getProfile);

// khalti
router.route("/pay").post(isAuthenticated, userRole("user"), paymentVerify);

module.exports = router;
