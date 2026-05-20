//  Patient Validator — register input validation

import { body } from "express-validator";
import { GENDER_OPTIONS } from "../constants.js";

const registerPatientValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10}$/)
    .withMessage("Phone must be a 10-digit number"),

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(GENDER_OPTIONS)
    .withMessage("Gender must be one of: Male, Female, Other"),

  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 0, max: 120 })
    .withMessage("Age must be between 0 and 120")
    .toInt(),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Address must not exceed 255 characters"),
];

export { registerPatientValidator };
