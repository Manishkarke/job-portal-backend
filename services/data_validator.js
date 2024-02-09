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
  } else if (!password.match(/[A-Z]/)) {
    errors = {
      ...errors,
      password: "Password must contains atleast one uppercase character",
    };
  } else if (!password.match(/[a-z]/)) {
    errors = {
      ...errors,
      password: "Password must contains at least one lowercase character",
    };
  } else if (!password.match(/[0-9]/)) {
    errors = {
      ...errors,
      password: "Password must contains atleast one number",
    };
  } else if (password.length < 8) {
    errors = {
      ...errors,
      password: "Password must contains atleast 8 characters",
    };
  }

  return errors;
};
