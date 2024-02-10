const categoryModel = require("../model/categoryModel");
const userModel = require("../model/userModel");

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

  console.log("User: ", req.body.user);
  const image = req.file.filename;

  const updatedFields = {
    image: `http://localhost:3000/${image}`,
  };

  if (name) {
    updatedFields.name = name;
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(user._id, updatedFields, { new: true })
    .select("-password");

  console.log("Updated user: ", updatedUser);

  if (updatedUser) {
    return res.json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } else {
    return res.json({ status: 400, message: "Profile not updated" });
  }
};

module.exports.getAllCategories = async (req, res) => {
  const categories = await categoryModel.find();
  return res.json({ status: 200, categories });
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
