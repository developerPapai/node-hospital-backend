// Doctor Model

import mongoose, {Schema} from "mongoose";

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      maxlength: [100, "Specialization must not exceed 100 characters"],
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [100, "Department must not exceed 100 characters"],
    },

    is_available: {
      type: Boolean,
      default: true,
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

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
