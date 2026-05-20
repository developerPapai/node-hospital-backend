// authentication logic: login, logout, getCurrentUser

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
import { ApiError } from "../utils/ApiError.js";
import { USER_STATUS } from "../constants.js";

const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password_hash +token");
  //  console.log("AuthService.login found user:", user); // Debug log
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status === USER_STATUS.INACTIVE) {
    throw new ApiError(403, "Account is inactive. Contact administrator");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  user.token = token;
  user.last_login = new Date();
  await user.save({ validateBeforeSave: false });

  const userResponse = user.toJSON();

  return { token, user: userResponse };
};

const logout = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.token = null;
  await user.save({ validateBeforeSave: false });
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export { login, logout, getCurrentUser };
