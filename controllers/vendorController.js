const appliedJobModel = require("../model/appliedJobModel");
const jobModel = require("../model/jobModel");
const { createJobDataValidator } = require("../services/data_validator");

// route handler function for creating job
module.exports.createJob = async (req, res) => {
  const { title, description, location, salary, deadline, categoryId } =
    req.body;

  let errors = createJobDataValidator(req.body);
  let isFormValid = true;

  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }

  if (isFormValid) {
    const job = await jobModel.create({
      title,
      description,
      location,
      salary,
      deadline,
      postedBy: req.user._id,
      category: categoryId,
    });
    if (!job) throw "Failed to create job";

    return res.json({
      status: "success",
      message: "Job has been created successfully",
      data: null,
    });
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

// Route handler function for getting individual job
module.exports.individualVendorJobs = async (req, res) => {
  const jobs = await jobModel.find({ postedBy: req.user._id });
  if (!jobs) throw "No jobs has been posted";
  return res.json({
    status: "success",
    message: "Jobs has been fetched successfully",
    data: jobs,
  });
};

// Route handler function for deleting a job
module.exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await jobModel.findByIdAndDelete(id);
  if (!job) throw "Failed to delete the job";
  return res.json({
    status: "success",
    message: "Job has been deleted successfully",
    data: null,
  });
};

// Route handler function for viewing single job
module.exports.viewSingleJob = async (req, res) => {
  const { id } = req.params;
  const job = await jobModel.findById(id);
  if (!job) throw "Failed to fetch job details";
  return res.json({
    status: "success",
    message: "Job details has been fetched successfully",
    data: job,
  });
};

// Route handler function for viewing applicants
module.exports.myApplicants = async (req, res) => {
  const jobs = await jobModel.find({ postedBy: req.user._id });

  //find all the applicants for the jobs posted by the vendor
  const applicants = await appliedJobModel
    .find({
      jobId: { $in: jobs.map((job) => job._id) },
    })
    .populate("userId");
  if (!applicants) throw "No applicants for this job has been found";
  return res.json({
    status: "success",
    message: "Applicants has been fetched successfully",
    data: applicants,
  });
};

// TODO: Need to remove this accept or reject applicants 
// Route handler function for accepting or rejecting applicants
module.exports.acceptOrRejectApplicant = async (req, res) => {
  const { applicantId } = req.body;
  let applicant;
  if (req.body.status === "accepted") {
    applicant = await appliedJobModel.findByIdAndUpdate(
      applicantId,
      {
        status: "accepted",
      },
      {
        new: true,
      }
    );
  } else if (req.body.status === "rejected") {
    applicant = await appliedJobModel.findByIdAndUpdate(
      applicantId,
      {
        status: "rejected",
      },
      {
        new: true,
      }
    );
  } else {
    return res.json({ status: 400, message: "Invalid status" });
  }

  if (applicant) {
    return res.json({
      status: 200,
      message:
        "Applicant status changed to " + applicant.status + " successfully ",
    });
  } else {
    return res.json({ status: 400, message: "Applicant not accepted" });
  }
};
