const errorHandler = (err, req, res, next) => {
  console.error("Server Error Pipeline Captured:", err.message || err);

  const statusCode = err.statusCode || 500;
  
  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;