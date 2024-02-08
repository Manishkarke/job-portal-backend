const bcrypt = require("bcrypt");
const salt = 10;

module.exports.hashPasswordGenerator = (password) => {
  const generatedPassword = bcrypt.hash(password, salt);
  return `${generatedPassword}`;
};

module.exports.comparePassword = async (password, hashPassword) => {
  const isMatched = await bcrypt.compare([password, hashPassword]);

  return isMatched;
};
