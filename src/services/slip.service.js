//  Appointment Slip Service — PDF Generation

import PDFDocument from "pdfkit";
import Appointment from "../models/appointment.model.js";
import { ApiError } from "../utils/ApiError.js";

const generateSlip = async (appointmentId, res) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate("patient_id", "patient_id name phone age gender")
    .populate("doctor_id", "name specialization department")
    .populate("booked_by", "name");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  const patient = appointment.patient_id;
  const doctor = appointment.doctor_id;

  const filename = `Slip_${appointment.appointment_no}.pdf`;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/pdf");

 const doc = new PDFDocument({
    size: "A4",
    margin: 0,
    bufferPages: true,
  });

  doc.pipe(res);

  const W = 595;
  const H = 842;
  const PAD = 40;

  // ─── Background ───────────────────────────────────────────────
  doc.rect(0, 0, W, H).fill("#ffffff");


  // ─── Header: Logo ─────────────────────────────────────────────
  doc.image("public/hospital-logo.jpg", 32, 20, { width: 110 });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#65798b")
    .text("Health for everyone, everywhere", 38, 60);

  // ─── Header: Appointment info (right) ─────────────────────────
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#1a1a2e")
    .text("APPOINTMENT NO", W - 200, 18, { width: 160, align: "right" });

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#1a1a2e")
    .text(appointment.appointment_no, W - 200, 30, {
      width: 160,
      align: "right",
    });

  // Token badge
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#1a1a2e")
    .text("TOKEN NO", W - 125, 60, { width: 85, align: "center" });
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#1a1a2e")
    .text(String(appointment.token_no), W - 125, 70, {
      width: 85,
      align: "center",
    });

  // ─── Divider ──────────────────────────────────────────────────
  doc.rect(PAD, 115, W - PAD * 2, 1).fill("#c9d4e1");

  // ─── Patient + Doctor Info ────────────────────────────────────
  const ROW1 = 133;
  const ROW_GAP = 24;
  const C1 = PAD;
  const C1V = 160;
  const C2 = 320;
  const C2V = 430;

  const label = (text, x, y) =>
    doc.font("Helvetica").fontSize(9).fillColor("#4f6477").text(text, x, y);

  const value = (text, x, y, opts = {}) =>
    doc
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .fillColor("#1a1a2e")
      .text(text, x, y, opts);

  label("Patient Name :", C1, ROW1);
  value(patient.name, C1V, ROW1);

  label("Doctor :", C2, ROW1);
  value(doctor.name, C2V, ROW1);

  label("Patient ID :", C1, ROW1 + ROW_GAP);
  value(patient.patient_id, C1V, ROW1 + ROW_GAP);

  label("Department :", C2, ROW1 + ROW_GAP);
  value(doctor.department, C2V, ROW1 + ROW_GAP);

  label("Age / Gender :", C1, ROW1 + ROW_GAP * 2);
  value(`${patient.age} / ${patient.gender}`, C1V, ROW1 + ROW_GAP * 2);

  label("Specialization :", C2, ROW1 + ROW_GAP * 2);
  value(doctor.specialization, C2V, ROW1 + ROW_GAP * 2, { width: 130 });

  label("Phone :", C1, ROW1 + ROW_GAP * 3);
  value(String(patient.phone), C1V, ROW1 + ROW_GAP * 3);

  // ─── Divider ──────────────────────────────────────────────────
  doc.rect(PAD, 230, W - PAD * 2, 1).fill("#c9d4e1");

  // ─── Disease & Symptoms ───────────────────────────────────────
  const SEC2Y = 248;

  label("Disease :", C1, SEC2Y);
  value(appointment.disease, 130, SEC2Y);

  label("Symptoms :", C1, SEC2Y + ROW_GAP);
  value(appointment.symptoms, 130, SEC2Y + ROW_GAP, { width: W - 180 });

  // ─── Divider ──────────────────────────────────────────────────
  doc.rect(PAD, 318, W - PAD * 2, 1).fill("#c9d4e1");

  // ─── Footer ───────────────────────────────────────────────────
  const FOOTER_Y = 335;
  const dateOpts = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  doc.font("Helvetica").fontSize(8.5).fillColor("#65798b");

  doc.text(
    `Scheduled : ${new Date(appointment.scheduled_at).toLocaleString("en-IN", dateOpts)}`,
    PAD,
    FOOTER_Y
  );
  doc.text(
    `Booked By : ${appointment.booked_by.name}`,
    PAD,
    FOOTER_Y + 16
  );
  doc.text(
    `Generated : ${new Date().toLocaleString("en-IN", dateOpts)}`,
    PAD,
    FOOTER_Y + 32
  );

  doc
    .font("Helvetica-Oblique")
    .fontSize(8)
    .fillColor("#65798b")
    .text("This is a computer generated slip.", 0, FOOTER_Y + 32, {
      align: "center",
    });


  doc.end();
};

export { generateSlip };
