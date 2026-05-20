//  Token Counter Utility

import Appointment from "../models/appointment.model.js";

const getNextTokenNo = async (doctorId, date) => {
  const appointmentDate = new Date(date);

  const startOfDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(appointmentDate.setHours(23, 59, 59, 999));

  const lastAppointment = await Appointment.findOne({
    doctor_id: doctorId,
    scheduled_at: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })
    .sort({ token_no: -1 })
    .select("token_no")
    .lean();

  return lastAppointment ? lastAppointment.token_no + 1 : 1;
};

export { getNextTokenNo };
