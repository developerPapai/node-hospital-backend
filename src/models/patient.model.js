//patient model

import mongoose, { Schema } from "mongoose";
import { GENDER_OPTIONS } from "../constants.js";

const patientSchema = new Schema(
  {
    patient_id: {
      type: String,
      required: [true, "Patient ID is required"],
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10}$/, "Phone must be a 10-digit number"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: GENDER_OPTIONS,
        message: "Gender must be one of: Male, Female, Other",
      },
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot exceed 120"],
      validate: {
        validator: Number.isInteger,
        message: "Age must be a whole number",
      },
    },

    address: {
      type: String,
      trim: true,
      maxlength: [255, "Address must not exceed 255 characters"],
      default: "",
    },

    registered_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Registered by (user) is required"],
    },

    registered_at: {
      type: Date,
      default: Date.now,
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

//indexes for efficient querying

patientSchema.index({ phone: 1 });

patientSchema.index({ name: 1 });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
