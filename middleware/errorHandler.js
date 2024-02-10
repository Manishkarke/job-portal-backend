module.exports.errorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      console.log("error is here", err);
      if (typeof err === "string") {
        console.log("Error in error handler");
        res.json({ status: "error", message: err, data: null });
      } else if (err.type === "VALIDATION_ERROR") {
        res.json({ status: "error", message: err.message, data: null });
      } else {
        res.json({
          status: "error",
          message: "Internal error occurred",
          data: null,
        });
      }
    });
  };
};
