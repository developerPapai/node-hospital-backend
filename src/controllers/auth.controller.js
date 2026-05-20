//authentication controller: login, logout, getMe

import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  POST /auth/login

const login = asyncHandler(async (req, res) => {
  // console.log("AuthController.login called with body:", req.body); // Debug log
  const { email, password } = req.body;

  const data = await authService.login(email, password);
  // console.log("AuthController.login received data from service:", data); // Debug log
  return res.status(200).json(new ApiResponse(200, data, "Login successful"));
});

//  POST /auth/logout

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

//  GET /auth/me

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

export { login, logout, getMe };
