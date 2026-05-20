//  Global Error Handler Middleware

import dotenv from "dotenv";
dotenv.config();
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  //Handle known ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Handle Mongoose Duplicate Key Errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
      errors: [{ field, message: `${field} already exists` }],
    });
  }

  // Handle Mongoose Cast Errors (invalid ObjectId etc.)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}: ${err.value}`,
      errors: [],
    });
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
      errors: [],
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired. Please log in again.",
      errors: [],
    });
  }

  // Unknown / Unhandled Errors
  // Log full error in development for debugging; hide details in production
  console.error("🔴 Unhandled Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Something went wrong. Please try again later.";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: [],
    // Include stack trace only in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorHandler };
