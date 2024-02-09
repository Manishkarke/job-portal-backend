const mongoose = require("mongoose");

module.exports.validateMongooseId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) throw "This mongoose ID is invalid.";
};
