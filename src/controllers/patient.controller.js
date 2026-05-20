//patient controller - register patient, search patients, get patient by id

import * as patientService from "../services/patient.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /patients

const registerPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.register(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, patient, "Patient registered successfully"));
});

//  GET /patients
//  GET /patients?phone=1234567890&name=John&page=1&limit=10

const searchPatients = asyncHandler(async (req, res) => {
  const { phone, name, page, limit } = req.query;

  const data = await patientService.search({ phone, name, page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Patients fetched successfully"));
});

//  GET /patients/:id

const getPatientById = asyncHandler(async (req, res) => {
  const patient = await patientService.findById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient fetched successfully"));
});

export { registerPatient, searchPatients, getPatientById };
