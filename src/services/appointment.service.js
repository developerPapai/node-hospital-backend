//  Appointment logic: book

import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAppointmentNo } from "../utils/generateId.js";
import { getNextTokenNo } from "../utils/tokenCounter.js";
import { APPOINTMENT_STATUS } from "../constants.js";

const book = async (bookingData, bookedByUserId) => {
  const { patient_id, doctor_id, disease, symptoms, scheduled_at } =
    bookingData;

  const patient = await Patient.findById(patient_id).lean();
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const doctor = await Doctor.findById(doctor_id).lean();
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  if (!doctor.is_available) {
    throw new ApiError(404, "Doctor is currently not available for bookings");
  }

  const appointment_no = await generateAppointmentNo();
  const token_no = await getNextTokenNo(doctor_id, scheduled_at);

  const appointment = await Appointment.create({
    appointment_no,
    token_no,
    patient_id,
    doctor_id,
    booked_by: bookedByUserId,
    disease,
    symptoms,
    scheduled_at,
    status: APPOINTMENT_STATUS.SCHEDULED,
  });

  return await Appointment.findById(appointment._id)
    .populate("patient_id", "patient_id name phone age gender")
    .populate("doctor_id", "name specialization department")
    .populate("booked_by", "name");
};

const getDailySchedule = async ({
  date,
  doctor_id,
  status,
  page = 1,
  limit = 20,
}) => {
  const filter = {};

  if (date) {
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
    filter.scheduled_at = { $gte: startOfDay, $lte: endOfDay };
  }

  if (doctor_id) {
    filter.doctor_id = doctor_id;
  }

  if (status) {
    filter.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const sortOption = date ? { token_no: 1 } : { scheduled_at: -1 };

  if(date || doctor_id || status){
  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate("patient_id", "patient_id name phone age gender")
      .populate("doctor_id", "name specialization")
      .lean(),
    Appointment.countDocuments(filter),
  ]);

  const formattedAppointments = appointments.map((apt) => ({
    ...apt,
    patient: apt.patient_id,
    doctor: apt.doctor_id,
    patient_id: undefined,
    doctor_id: undefined,
  }));

  return {
    appointments: formattedAppointments,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };

}
else{
  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .sort({ scheduled_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Appointment.countDocuments(filter),
  ]);

    return {
    appointments,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}


};

export { book, getDailySchedule };
