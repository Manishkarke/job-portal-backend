// This file contains all the form validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports.authDataValidator = (
  { email, name, password },
  validationFor
) => {
  let errors = {};

  if (validationFor !== "sign in") {
    // Name validation
    if (!name || !name.trim()) {
      errors = { ...errors, name: "Name is required" };
    } else if (!name.match(/^[a-zA-Z\s]+$/)) {
      errors = { ...errors, name: "Name is invalid" };
    } else {
      errors = { ...errors, name: "" };
    }
  }

  // Email validation
  if (!email || !email.trim()) {
    errors = { ...errors, email: "Email is required" };
  } else if (!email.match(emailRegex)) {
    errors = { ...errors, email: "Email is invalid" };
  } else {
    errors = { ...errors, email: "" };
  }

  // Password validation
  if (!password || !password.trim()) {
    errors = { ...errors, password: "Password is required" };
  } else if (!password.match(/[A-Z]/) && validationFor === "registration") {
    errors = {
      ...errors,
      password: "Password must contains atleast one uppercase character",
    };
  } else if (!password.match(/[a-z]/) && validationFor === "registration") {
    errors = {
      ...errors,
      password: "Password must contains at least one lowercase character",
    };
  } else if (!password.match(/[0-9]/) && validationFor === "registration") {
    errors = {
      ...errors,
      password: "Password must contains atleast one number",
    };
  } else if (password.length < 8 && validationFor === "registration") {
    errors = {
      ...errors,
      password: "Password must contains atleast 8 characters",
    };
  }

  return errors;
};

module.exports.categoryDataValidator = (category, image) => {
  let errors = {};

  if (!category || !category.trim()) {
    errors = { ...errors, category: "Category name is required" };
  } else if (!category.match(/^[a-zA-Z\s]+$/)) {
    errors = { ...errors, category: "Category name is invalid" };
  } else {
    errors = { ...errors, category: "" };
  }

  if (!image || !image.trim()) {
    errors = { ...errors, image: "Image is required" };
  } else {
    errors = { ...errors, image: "" };
  }

  return errors;
};

module.exports.bannerDataValidator = (title, image) => {
  let errors = {};

  if (!title || !title.trim()) {
    errors = { ...errors, title: "Title is required" };
  } else if (!title.match(/^[a-zA-Z\s]+$/)) {
    errors = {
      ...errors,
      title: "Title is invalid. title must only contains letters and space.",
    };
  } else {
    errors = { ...errors, title: "" };
  }

  if (!image || !image.trim()) {
    errors = { ...errors, image: "Image is required." };
  } else {
    errors = { ...errors, image: "" };
  }

  return errors;
};

module.exports.editProfileDataValidator = (name, image) => {
  let errors = {};

  if (!name || !name.trim()) {
    errors = { ...errors, name: "Name is required" };
  } else if (!name.match(/^[a-zA-Z\s]+$/)) {
    errors = { ...errors, name: "Name is invalid" };
  } else {
    errors = { ...errors, name: "" };
  }

  if (!image) {
    errors = { ...errors, image: "Image is required" };
  } else {
    errors = { ...errors, image: "" };
  }

  return errors;
};

module.exports.vendorRegistrationDataValidator = ({
  name,
  email,
  designation,
  service,
  contact,
  address,
}) => {
  let errors = {};

  // Name Validation
  if (!name || !name.trim()) {
    errors = { ...errors, name: "Name is required" };
  } else if (!name.match(/^[a-zA-Z\s]+$/)) {
    errors = { ...errors, name: "Name is invalid" };
  } else {
    errors = { ...errors, name: "" };
  }

  // Email validation
  if (!email || !email.trim()) {
    errors = { ...errors, email: "Email is required" };
  } else if (!email.match(emailRegex)) {
    errors = { ...errors, email: "Email is invalid" };
  } else {
    errors = { ...errors, email: "" };
  }

  // designation validation
  if (!designation || !designation.trim()) {
    errors = { ...errors, designation: "Designation is required" };
  } else {
    errors = { ...errors, designation: "" };
  }

  // Service validation
  if (!service || !service.trim()) {
    errors = { ...errors, service: "Service is required" };
  } else {
    errors = { ...errors, service: "" };
  }

  // Contact validation
  if (!contact || !contact.trim()) {
    errors = { ...errors, contact: "Contact is required" };
  } else if (!contact.match(/^\d+$/)) {
    errors = { ...errors, contact: "Contact is invalid" };
  } else {
    errors = { ...errors, contact: "" };
  }

  // Address validation
  if (!address || !address.trim()) {
    errors = { ...errors, address: "Address is required" };
  } else {
    errors = { ...errors, errors: "" };
  }

  return errors;
};

module.exports.jobApplyDataValidator = ({ location, contact }, cv) => {
  let errors = {};

  if (!location || !location.trim()) {
    errors = { ...errors, location: "Location is required" };
  } else {
    errors = { ...errors, location: "" };
  }

  if (!contact || !contact.trim()) {
    errors = { ...errors, contact: "Contact is required" };
  } else {
    errors = { ...errors, contact: "" };
  }

  if (!cv) {
    errors = { ...errors, cv: "C.V is required" };
  } else {
    errors = { ...errors, cv: "" };
  }

  return errors;
};
