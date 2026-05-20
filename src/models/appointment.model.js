//  Appointment Model

import mongoose, { Schema } from "mongoose";
import { APPOINTMENT_STATUS } from "../constants.js";

const appointmentSchema = new Schema(
  {
    appointment_no: {
      type: String,
      required: [true, "Appointment number is required"],
      unique: true,
      trim: true,
    },

    token_no: {
      type: Number,
      required: [true, "Token number is required"],
      min: [1, "Token number must be at least 1"],
    },

    patient_id: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
    },

    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
    },

    booked_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booked by (user) is required"],
    },

    disease: {
      type: String,
      required: [true, "Disease is required"],
      trim: true,
      maxlength: [200, "Disease must not exceed 200 characters"],
    },

    symptoms: {
      type: String,
      required: [true, "Symptoms are required"],
      trim: true,
      maxlength: [500, "Symptoms must not exceed 500 characters"],
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(APPOINTMENT_STATUS),
        message: "Status must be one of: scheduled, completed, cancelled",
      },
      default: APPOINTMENT_STATUS.SCHEDULED,
    },

    scheduled_at: {
      type: Date,
      required: [true, "Scheduled date/time is required"],
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

appointmentSchema.index({ doctor_id: 1, scheduled_at: 1 });

appointmentSchema.index({ scheduled_at: 1 });

appointmentSchema.index({ patient_id: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
