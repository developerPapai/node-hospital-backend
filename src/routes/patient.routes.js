//patient routes: register patient, search patients, get patient by id

import { Router } from "express";
import { registerPatientValidator } from "../validators/patient.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import * as patientController from "../controllers/patient.controller.js";
import { USER_ROLES } from "../constants.js";

const router = Router();

//  POST /patients

router.post(
  "/",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.ADMIN),
  registerPatientValidator,
  validate,
  patientController.registerPatient
);

//  GET /patients
//  GET /patients?phone=9999999999&name=John&page=1&limit=10

router.get(
  "/",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.NURSE, USER_ROLES.ADMIN),
  patientController.searchPatients
);

// GET /patients/:id

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(USER_ROLES.STAFF, USER_ROLES.NURSE, USER_ROLES.ADMIN),
  patientController.getPatientById
);

export default router;
