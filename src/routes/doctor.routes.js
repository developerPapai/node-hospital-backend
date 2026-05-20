//  Doctor Routes

import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import * as doctorController from "../controllers/doctor.controller.js";
import { USER_ROLES } from "../constants.js";

const router = Router();

//  GET /doctors
//  GET /doctors?available=true&department=OPD

router.get(
  "/",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.NURSE, USER_ROLES.ADMIN),
  doctorController.getDoctors
);

export default router;
