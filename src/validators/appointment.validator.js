// Appointment Validator — Booking Input validation

import { body, param } from "express-validator";
import { APPOINTMENT_STATUS } from "../constants.js";

const bookAppointmentValidator = [
  body("patient_id")
    .trim()
    .notEmpty()
    .withMessage("Patient ID is required")
    .isMongoId()
    .withMessage("Invalid Patient ID format"),

  body("doctor_id")
    .trim()
    .notEmpty()
    .withMessage("Doctor ID is required")
    .isMongoId()
    .withMessage("Invalid Doctor ID format"),

  body("disease")
    .trim()
    .notEmpty()
    .withMessage("Disease is required")
    .isLength({ max: 200 })
    .withMessage("Disease must not exceed 200 characters"),

  body("symptoms")
    .trim()
    .notEmpty()
    .withMessage("Symptoms are required")
    .isLength({ max: 500 })
    .withMessage("Symptoms must not exceed 500 characters"),

  body("scheduled_at")
    .trim()
    .notEmpty()
    .withMessage("Scheduled date/time is required")
    .isISO8601()
    .withMessage("Must be a valid ISO 8601 date")
    .custom((value) => {
      const scheduledDate = new Date(value);
      if (scheduledDate < new Date()) {
        throw new Error("Appointment must be scheduled for a future date/time");
      }
      return true;
    }),
];

export { bookAppointmentValidator };
