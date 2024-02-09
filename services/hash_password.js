const bcrypt = require("bcrypt");
const salt = 10;

module.exports.hashPasswordGenerator = async (password) => {
  const generatedPassword = await bcrypt.hash(password, salt);
  return `${generatedPassword}`;
};

module.exports.comparePassword = async (password, hashPassword) => {
  console.log("Password: ", password);
  console.log("Hashed password new: ", bcrypt.hash(password, salt));
  console.log("Hashed password old: ", hashPassword);
  const isMatched = await bcrypt.compare(password, hashPassword);
  console.log("isMatched: ", isMatched);
  return isMatched;
};
