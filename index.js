const express = require("express");
const mongoConnection = require("./database/db");
const app = express();
const cors = require("cors");
const path = require("path");

require("dotenv").config();
// const userRoute = require("./routes/userRoute");
// const adminRoute = require("./routes/adminRoute");
// const vendorRoute = require("./routes/vendorRoute");
const authRoute = require("./routes/authRoute");
const commonRoute = require("./routes/commonRoute");

mongoConnection(process.env.MONGO_URL);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL = ["http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoute);
app.use("/api/common", commonRoute);
// app.use("/api/user", userRoute);
// app.use("/api/admin", adminRoute);
// app.use("/api/vendor", vendorRoute);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
