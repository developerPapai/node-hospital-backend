//patient logic: register, search, findById

import mongoose from "mongoose";
import Patient from "../models/patient.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generatePatientId } from "../utils/generateId.js";

const register = async (patientData, registeredByUserId) => {
  const { name, phone, gender, age, address } = patientData;

  const existingPatient = await Patient.findOne({ phone }).lean();

  if (existingPatient) {
    throw new ApiError(409, "Patient with this phone number already exists");
  }

  const patientId = await generatePatientId();

  const patient = await Patient.create({
    patient_id: patientId,
    name,
    phone,
    gender,
    age,
    address: address || "",
    registered_by: registeredByUserId,
    registered_at: new Date(),
  });

  return patient;
};

const search = async ({ phone, name, page = 1, limit = 10 }) => {
  const filter = {};

  if (phone) {
    filter.phone = { $regex: phone, $options: "i" };
  }

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .sort({ registered_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Patient.countDocuments(filter),
  ]);

  return {
    patients,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const findById = async (id) => {
  let patient;

  if (mongoose.Types.ObjectId.isValid(id)) {
    patient = await Patient.findById(id).populate("registered_by", "_id name");
  }

  if (!patient) {
    patient = await Patient.findOne({ patient_id: id }).populate(
      "registered_by",
      "_id name"
    );
  }

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  return patient;
};

export { register, search, findById };
