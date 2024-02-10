const bannerModel = require("../model/bannerModel");
const categoryModel = require("../model/categoryModel");
const userModel = require("../model/userModel");
const vendorModel = require("../model/vendorModel");
const {
  categoryDataValidator,
  bannerDataValidator,
} = require("../services/data_validator");

// Route handler function for accepting vendor request
module.exports.changeToVendor = async (req, res) => {
  const { user } = req.body;
  const foundUser = await userModel.findById(user._id);
  foundUser.role = "vendor";
  const changeVendorStatus = await vendorModel.findOneAndUpdate(
    {
      userId: user._id,
    },
    {
      status: "approved",
    }
  );

  if (!changeVendorStatus) throw "Failed to change user to vendor.";
  await user.save();
  return res.json({
    status: "success",
    message: "User is now a vendor",
    data: null,
  });
};

// Route handler function for rejecting vendor request
module.exports.rejectVendor = async (req, res) => {
  const { user } = req.body;
  const foundUser = await userModel.findById(user._id);
  foundUser.role = "user";
  const changeVendorStatus = await vendorModel.findOneAndUpdate(
    {
      userId: user._id,
    },
    {
      status: "rejected",
    }
  );

  if (!changeVendorStatus) throw "Failed to reject vendor request";

  await user.save();
  return res.json({
    status: "success",
    message: "Request rejected successfully",
    data: null,
  });
};

// Route handler function for getting all vendors
module.exports.getAllVendors = async (req, res) => {
  const vendors = await vendorModel.find();
  if (!vendors) throw "No vendors found";

  return res.json({
    status: "success",
    message: "Vendors fetched successfully",
    data: vendors,
  });
};

// Route handler function for getting a single vendor
module.exports.getSingleVendor = async (req, res) => {
  const { id } = req.params;

  const vendor = await vendorModel.findById(id);
  if (!vendor) throw "No vendor found with id " + id;

  return res.json({
    status: "success",
    message: "Data fetched successfully",
    data: vendor,
  });
};

// Route handler function for deleting a vendor
module.exports.deleteVendor = async (req, res) => {
  const { id } = req.params;
  const vendorFound = await vendorModel.findById(id);
  if (!vendorFound) throw "No vendor found with id " + id;

  const deletedUser = await userModel.findByIdAndDelete(vendorFound.userId);
  if (!deletedUser) throw "Failed to delete vendor from user";

  const vendor = await vendorModel.findByIdAndDelete(id);
  if (!vendor) throw "Failed to delete vendor from vendor list";

  return res.json({
    status: "success",
    message: "Vendor deleted successfully",
    data: null,
  });
};

// Route handler function for creating new category
module.exports.createCategory = async (req, res) => {
  const { category } = req.body;
  const image = req.file.filename;

  // Data validation
  let errors = categoryDataValidator(category, image);
  let isFormValid = true;

  /*
  Loop throw the errors object's each key and check if there is an error.
  if there is then the form is invalid and loop is broke.
  */
  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }

  if (isFormValid) {
    // Check if category already exists
    const foundCategory = await categoryModel.findOne({ category });
    if (foundCategory) {
      throw {
        type: "VALIDATION_ERROR",
        message: { category: "Category already exists" },
      };
    } else {
      // If not already exists create new category
      const categories = await categoryModel.create({
        category,
        image: process.env.BACKEND_URL + "/" + image,
      });
      if (!categories) throw "Failed to create category";

      return res.json({
        status: "success",
        message: "Category has been created successfully",
        data: null,
      });
    }
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

// Route handler function for deleting a category
module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(id);
  if (!category) throw "Failed to delete category";

  return res.json({
    status: "success",
    message: "Category has been deleted successfully",
    data: null,
  });
};

// Route handler function for uploading banner
module.exports.createBanner = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  // Error Handling here
  let errors = bannerDataValidator(title, image);
  let isFormValid = true;
  for (const error in errors) {
    if (errors[error]) {
      isFormValid = false;
      break;
    }
  }

  if (isFormValid) {
    const existingBanner = await bannerModel.findOne({ title });
    if (existingBanner) {
      throw {
        type: "VALIDATION_ERROR",
        message: "Banner with this title already exists",
      };
    } else {
      const banner = await bannerModel.create({
        title,
        image: process.env.BACKEND_URL + "/" + image,
      });
      if (!banner) throw "Failed to add banner";

      return res.json({
        status: "success",
        message: "Banner has been added successfully",
        data: null,
      });
    }
  } else {
    throw { type: "VALIDATION_ERROR", message: errors };
  }
};

// Route handler function for deleting banner
module.exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await bannerModel.findByIdAndDelete(id);
  if (!banner) throw "Failed to delete banner";

  return res.json({
    status: "success",
    message: "Banner has been deleted successfully",
    data: null,
  });
};
