// doctor logic: getAll (with filters)

import Doctor from "../models/doctor.model.js";
import { ApiError } from "../utils/ApiError.js";

const getAll = async ({ available, department } = {}) => {
  const filter = {};

  if (available !== undefined && available !== "") {
    filter.is_available = available === "true" || available === true;
  }

  if (department) {
    filter.department = { $regex: `^${department}$`, $options: "i" };
  }

  const doctors = await Doctor.find(filter).sort({ name: 1 }).lean();

  return doctors;
};

export { getAll };
