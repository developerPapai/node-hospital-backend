//  Doctor Controller — getDoctors

import * as doctorService from "../services/doctor.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  GET /doctors
//  GET /doctors?available=true&department=OPD

const getDoctors = asyncHandler(async (req, res) => {
  const { available, department } = req.query;

  const doctors = await doctorService.getAll({ available, department });

  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
});


export { getDoctors};
