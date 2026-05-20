//genetateId utility

import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";

const generatePatientId = async () => {
  const year = new Date().getFullYear();
  const prefix = `PAT-${year}-`;

  const lastPatient = await Patient.findOne({
    patient_id: { $regex: `^${prefix}` },
  })
    .sort({ patient_id: -1 })
    .select("patient_id")
    .lean();

  let nextSequence = 1;

  if (lastPatient) {
    const lastSequence = parseInt(lastPatient.patient_id.split("-").pop(), 10);
    nextSequence = lastSequence + 1;
  }

  const paddedSequence = String(nextSequence).padStart(4, "0");

  return `${prefix}${paddedSequence}`;
};

const generateAppointmentNo = async () => {
  const today = new Date();
  const dateString = today.toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = `APT-${dateString}-`;

  const lastAppointment = await Appointment.findOne({
    appointment_no: { $regex: `^${prefix}` },
  })
    .sort({ appointment_no: -1 })
    .select("appointment_no")
    .lean();

  let nextSequence = 1;

  if (lastAppointment) {
    const lastSequence = parseInt(
      lastAppointment.appointment_no.split("-").pop(),
      10
    );
    nextSequence = lastSequence + 1;
  }

  const paddedSequence = String(nextSequence).padStart(4, "0");

  return `${prefix}${paddedSequence}`;
};

export { generatePatientId, generateAppointmentNo };
