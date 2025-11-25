import AppError from "../config/AppError.js";

// Global error handling
//1. Cast Error
const handleCastError = (err) => {
  const message = `CastError: Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

//2: Validation Error
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data; ${errors.join(". ")}`;
  return new AppError(400, message);
};

//3. Duplicate Errors
const handleDuplicateFieldDB = (err) => {
  //Extract value from the error
  const value = err.keyValue[Object.keys(err.keyValue)[0]];
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(400, message);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error:
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming error or other unknown Error
    console.log(`Error 💥`, err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  console.log(err); //remove before deployment
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    if (err.code === 11000) {
      err = handleDuplicateFieldDB(err);
    }
    if (err.name === "ValidationError") err = handleValidationError(err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {
      ...err,
      message: err.message,
      name: err.name,
      code: err.code,
    };
    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
