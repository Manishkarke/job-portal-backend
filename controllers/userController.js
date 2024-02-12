const userModel = require("../model/userModel");
const vendorModel = require("../model/vendorModel");
const jobModel = require("../model/jobModel");
const appliedJobModel = require("../model/appliedJobModel");
const reviewsModel = require("../model/reviewModel");
const {
  vendorRegistrationDataValidator,
  jobApplyDataValidator,
} = require("../services/data_validator");
const { sendJobApplicationSuccessMail } = require("../services/mail_service");

// Route handler function for vendor registration
module.exports.registerAsVendor = async (req, res) => {
  const { name, email, designation, service, contact, address, user } =
    req.body;

  let errors = vendorRegistrationDataValidator(req.body);
  let isFormValid = true;

  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }

  if (isFormValid) {
    const foundUser = await userModel.findById(user._id);
    if (!foundUser) throw "User doesn't exist";

    const existingVendor = await vendorModel.findOne({ userId: user._id });
    if (existingVendor) {
      throw "User has already applied to be a vendor";
    } else {
      const vendor = await vendorModel.create({
        name,
        email,
        designation,
        service,
        contact,
        address,
        userId: user._id,
      });
      if (!vendor) throw "Failed to send vendor request";

      return res.json({
        status: "success",
        message: "Vendor request has been sent successfully",
        data: null,
      });
    }
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

// Route handler function to get all jobs
module.exports.getAllJobs = async (req, res) => {
  const jobs = await jobModel
    .find()
    .populate("category")
    .populate({
      path: "postedBy",
      populate: {
        path: "reviews",
      },
    });
  if (!jobs) throw "No Jobs found";
  return res.json({
    status: "success",
    message: "Jobs has been fetched successfully",
    data: jobs,
  });
};

// Route handler function for getting single job
module.exports.getSingleJob = async (req, res) => {
  const { id } = req.params;
  const jobs = await jobModel
    .find({
      _id: id,
    })
    .populate("category")
    .populate({
      path: "postedBy",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
          select: ["name", "email"],
        },
      },
    });
  if (!job) throw "Job not found";

  // Loop through jobs and calculate the average rating of reviews for each job
  const jobsWithAvgRating = jobs.map((job) => {
    const reviewRatings = job.postedBy.reviews.map((review) => review.rating);
    const avgRating =
      reviewRatings.reduce((total, rating) => total + rating, 0) /
      reviewRatings.length;
    return {
      ...job.toJSON(),
      avgRating,
    };
  });

  return res.json({
    status: "success",
    message: "Job details has been fetched successfully",
    data: jobsWithAvgRating[0],
  });
};

// Route handler function to get job with category
module.exports.getJobByCategories = async (req, res) => {
  const { id } = req.params;

  const jobs = await jobModel
    .find({
      category: id,
    })
    .populate("category")
    .populate({
      path: "postedBy",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
          select: ["name", "email"],
        },
      },
    });
  if (!jobs) throw "No job has been found";

  // Loop through jobs and calculate the average rating of reviews for each job
  const jobsWithAvgRating = jobs.map((job) => {
    const reviewRatings = job.postedBy.reviews.map((review) => review.rating);
    const avgRating =
      reviewRatings.reduce((total, rating) => total + rating, 0) /
      reviewRatings.length;
    return {
      ...job.toJSON(),
      avgRating,
    };
  });

  return res.json({
    status: "success",
    message: "Job has been fetched successfully",
    data: jobsWithAvgRating,
  });
};

// Route handler function for applying a job
module.exports.applyJob = async (req, res) => {
  const { jobId, location, contact, user } = req.body;
  const cv = req.file.filename;

  let errors = jobApplyDataValidator(req.body, cv);
  let isFormValid = true;

  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }

  if (isFormValid) {
    const job = await jobModel.findOne({ _id: jobId }).populate("postedBy");
    if (!job) throw "Job doesn't exits";

    const foundUser = await userModel.findById(user._id);
    if (!foundUser) throw "User doesn't exists";

    const appliedJob = await appliedJobModel.create({
      jobId,
      userId: user._id,
      cv,
      location,
      contact,
    });
    if (!appliedJob) throw "Failed to apply for the job";

    const option = { email: user.email };
    await sendJobApplicationSuccessMail(option);
    return res.json({
      status: "success",
      message: "Job application has been sent successfully",
      data: null,
    });
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

// TODO: Need to work on rate vendor route handler function
// Route handler function for rating a vendor
module.exports.rateVendor = async (req, res) => {
  const user = await userModel.findById(req.params.id);
  const review = new Review();
  review.author = req.userId;
  review.message = req.body.message;
  review.rating = req.body.rating;
  console.log(review);
  user.reviews.push(review);
  await review.save();
  await user.save();
  res.json({ status: 200, message: "Review added successfully" });
};

// Route handler function for getting all applied jobs
module.exports.getAllAppliedJobs = async (req, res) => {
  const jobs = await appliedJobModel.find({ userId: req.user._id }).populate({
    path: "jobId",
    populate: [{ path: "postedBy" }, { path: "category" }],
  });
  if (!jobs) throw "You haven't applied for any jobs.";

  return res.json({
    status: "success",
    message: "Applied jobs has been fetched successfully",
    data: jobs,
  });
};

// Route handler function for getting all the job applications
module.exports.getSingleAppliedJob = async (req, res) => {
  const { id } = req.params;
  const job = await appliedJobModel.findById(id).populate({
    path: "jobId",
    populate: [{ path: "postedBy" }, { path: "category" }],
  });
  if (!job) throw "No job with the given id was found";

  return res.json({
    status: "success",
    message: "Job has been fetched successfully",
    data: job,
  });
};
