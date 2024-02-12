const userModel = require("../model/userModel");
const vendorModel = require("../model/vendorModel");
const jobModel = require("../model/jobModel");
const appliedJobModel = require("../model/appliedJobModel");
const reviewsModel = require("../model/reviewModel");

exports.registerAsVendor = async (req, res) => {
  try {
    const { name, email, designation, service, contact, address } = req.body;
    const user = await userModel.findOne({
      _id: req.userId,
    });

    if (!user) {
      return res.json({ status: 400, message: "User does not exist" });
    }

    const existingVendor = await vendorModel.findOne({ userId: req.userId });

    if (existingVendor) {
      return res.json({
        status: 400,
        message: "User has already applied as a vendor",
      });
    } else {
      const vendor = await vendorModel.create({
        name,
        email,
        designation,
        service,
        contact,
        address,
        userId: req.userId,
      });

      return res.json({
        status: 200,
        message: "Vendor registered successfully",
      });
    }
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.getAllJobs = async (req, res) => {
  // const jobs = await jobModel.find().populate("postedBy");
  // multiple populate
  const jobs = await jobModel
    .find()
    .populate("category")
    .populate({
      path: "postedBy",
      populate: {
        path: "reviews",
      },
    });
  return res.json({ status: 200, jobs });
};

exports.getSingleJob = async (req, res) => {
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

  // Loop through jobs and calculate the average rating of reviews for each job
  const jobsWithAvgRating = jobs.map((job) => {
    const reviewRatings = job.postedBy.reviews.map((review) => review.rating);
    console.log(reviewRatings);
    const avgRating =
      reviewRatings.reduce((total, rating) => total + rating, 0) /
      reviewRatings.length;
    return {
      ...job.toJSON(),
      avgRating,
    };
  });
  return res.json({ status: 200, jobs: jobsWithAvgRating[0] });
};

// get job according to category
exports.getJobByCategories = async (req, res) => {
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

  return res.json({ status: 200, jobs: jobsWithAvgRating });
};

exports.applyJob = async (req, res) => {
  try {
    const { jobId, location, contact } = req.body;
    const cv = req.file.filename;

    const job = await jobModel
      .findOne({
        _id: jobId,
      })
      .populate("postedBy");
    if (!job) {
      return res.json({ status: 400, message: "Job does not exists" });
    }
    const user = await userModel.findOne({
      _id: req.userId,
    });
    if (!user) {
      return res.json({ status: 400, message: "User does not exists" });
    }
    const appliedJob = await appliedJobModel.create({
      jobId,
      userId: req.userId,
      cv,
      location,
      contact,
    });

    if (appliedJob) {
      await sendEmail({
        email: job.postedBy.email,
        subject: "Someone has applied for your job",
        message: "Here is the link to your applicants",
        text: `http://localhost:3000/${cv}`,
      });
      return res.json({ status: 200, message: "Job applied successfully" });
    } else {
      return res.json({ status: 400, message: "Job not applied" });
    }
  } catch (e) {
    console.log(e);
    res.json({
      status: 400,
      message: e.message,
    });
  }
};

exports.rateVendor = async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e);
    res.json({
      status: 400,
      message: e.message,
    });
  }
};

// profile

exports.getAllAppliedJobs = async (req, res) => {
  try {
    const jobs = await appliedJobModel.find({ userId: req.userId }).populate({
      path: "jobId",
      populate: [{ path: "postedBy" }, { path: "category" }],
    });

    return res.json({ status: 200, jobs });
  } catch (error) {
    return res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.getSingleAppliedJob = async (req, res) => {
  const { id } = req.params;
  const jobs = await appliedJobModel
    .find({
      _id: id,
    })
    .populate({
      path: "jobId",
      populate: [{ path: "postedBy" }, { path: "category" }],
    });

  return res.json({ status: 200, jobs: jobs[0] });
};
