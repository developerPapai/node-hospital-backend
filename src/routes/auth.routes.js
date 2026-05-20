// authentication routes: login, logout, getMe

import { Router } from "express";
import { loginValidator } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import * as authController from "../controllers/auth.controller.js";
import { USER_ROLES } from "../constants.js";

const router = Router();

//  POST /auth/login

router.post("/login", loginValidator, validate, authController.login);

//  POST /auth/logout

router.post(
  "/logout",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.NURSE, USER_ROLES.ADMIN),
  authController.logout
);

//  GET /auth/me

router.get(
  "/me",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.NURSE, USER_ROLES.ADMIN),
  authController.getMe
);

export default router;
