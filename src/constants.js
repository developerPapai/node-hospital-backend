// Application Wide Constants

//db name
export const DB_NAME = "hospital-db";

//user roles for RBAC
export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  STAFF: "staff",
  NURSE: "nurse",
});

//user status
export const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

//appointment status
export const APPOINTMENT_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

//gender options
export const GENDER_OPTIONS = Object.freeze(["Male", "Female", "Other"]);
