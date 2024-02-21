const mongoose = require("mongoose");

// Database connection
function mongoConnection(url) {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "job-portal",
    })
    .then(() => {
      console.log("Connected to MongoDB");
    });
}

module.exports = mongoConnection;
