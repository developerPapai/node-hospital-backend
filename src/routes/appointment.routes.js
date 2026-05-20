//  Appointment Routes - booking, slip download

import { Router } from "express";
import { bookAppointmentValidator } from "../validators/appointment.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import * as appointmentController from "../controllers/appointment.controller.js";
import { USER_ROLES } from "../constants.js";

const router = Router();

//  POST /appointments

router.post(
  "/",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.ADMIN),
  bookAppointmentValidator,
  validate,
  appointmentController.bookAppointment
);

//  GET /appointments
// GET /appointments?date=2024-06-30&doctor_id=123&status=scheduled&page=1&limit=20

router.get(
  "/",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.NURSE, USER_ROLES.ADMIN),
  appointmentController.getAppointments
);

//  GET /appointments/:id/slip

router.get(
  "/:id/slip",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.ADMIN),
  appointmentController.downloadSlip
);

export default router;
