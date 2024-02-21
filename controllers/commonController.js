const categoryModel = require("../model/categoryModel");
const userModel = require("../model/userModel");
const { editProfileDataValidator } = require("../services/data_validator");

// Profile get route handler function
module.exports.getProfile = async (req, res) => {
  const { user } = req.body;
  const userData = await userModel
    .findById(user._id)
    // .populate("reviews")
    .select("-password");

  if (!user) throw "User does not exists";

  return res.json({
    status: "success",
    message: "User's data fetched successfully",
    data: userData,
  });
};

// Profile edit route handler function
module.exports.editProfile = async (req, res) => {
  const { name, user } = req.body;
  const image = req.file.filename;

  // For Error handling
  let errors = editProfileDataValidator(name, image);
  let isFormValid = true;

  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }

  if (isFormValid) {
    const updatedFields = { image: `http://localhost:3000/${image}` };

    if (name) {
      updatedFields.name = name;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(user._id, updatedFields, { new: true })
      .select("-password");
    if (!updatedUser) throw "Failed to update profile";

    return res.json({
      status: "success",
      message: "Profile has been updated successfully",
      data: updatedUser,
    });
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

module.exports.getAllCategories = async (req, res) => {
  const categories = await categoryModel.find();
  if (!categories) throw "No categories found";
  return res.json({
    status: "success",
    message: "Categories has been fetched successfully",
    data: categories,
  });
};

// Route handler function for Getting all the Banners
module.exports.getAllBanners = async (req, res) => {
  const banners = await bannerModel.find();
  if (!banners) throw "No any banners found.";
  return res.json({
    status: "success",
    message: "Banners has been fetched successfully",
    data: banners,
  });
};
