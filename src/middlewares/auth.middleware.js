//authentication middleware

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_STATUS } from "../constants.js";

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("AuthMiddleware.authenticateToken received Authorization header:", authHeader); // Debug log

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  const token = authHeader.split(" ")[1];
  // console.log("AuthMiddleware.authenticateToken extracted token:", token); // Debug log

  if (!token) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("AuthMiddleware.authenticateToken decoded token payload:", decoded); // Debug log
  } catch (error) {
    // console.log("AuthMiddleware.authenticateToken JWT verification error:", error); // Debug log
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token has expired. Please log in again.");
    }
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await User.findById(decoded.id).select("+token");
  // console.log("AuthMiddleware.authenticateToken found user:", user); // Debug log

  if (!user) {
    throw new ApiError(
      401,
      "User associated with this token no longer exists."
    );
  }

  if (user.status === USER_STATUS.INACTIVE) {
    throw new ApiError(403, "Account is inactive. Contact administrator.");
  }

  if (user.token !== token) {
    throw new ApiError(401, "Token has been revoked. Please log in again.");
  }

  req.user = user.toJSON();
  // console.log("AuthMiddleware.authenticateToken attached user to request:", req.user); // Debug log
  next();
});

export { authenticateToken };
