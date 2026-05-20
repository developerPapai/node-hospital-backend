//  Appointment Controller — bookAppointment,  downloadSlip

import * as appointmentService from "../services/appointment.service.js";
import * as slipService from "../services/slip.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /appointments

const bookAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.book(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

// GET /appointments
// GET /appointments?date=2024-06-30&doctor_id=123&status=scheduled&page=1&limit=20

const getAppointments = asyncHandler(async (req, res) => {
  const { date, doctor_id, status, page, limit } = req.query;

  const data = await appointmentService.getDailySchedule({
    date,
    doctor_id,
    status,
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Appointments fetched successfully"));
});

//  GET /appointments/:id/slip

const downloadSlip = asyncHandler(async (req, res) => {
  await slipService.generateSlip(req.params.id, res);
});

export { bookAppointment, getAppointments, downloadSlip };
