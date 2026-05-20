//user model

import mongoose, { Schema } from "mongoose";
import { USER_ROLES, USER_STATUS } from "../constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10}$/, "Phone must be a 10-digit number"],
    },

    password_hash: {
      type: String,
      required: [true, "Password hash is required"],
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: Object.values(USER_ROLES),
        message: "Role must be one of: staff, nurse, admin",
      },
      default: USER_ROLES.STAFF,
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(USER_STATUS),
        message: "Status must be one of: active, inactive",
      },
      default: USER_STATUS.ACTIVE,
    },

    last_login: {
      type: Date,
      default: null,
    },

    token: {
      type: String,
      default: null,
    },
  },

  { 
    timestamps: true,

    toJSON: {
      transform(doc, ret) {
        delete ret.password_hash;
        delete ret.token;
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      transform(doc, ret) {
        delete ret.password_hash;
        delete ret.token;
        delete ret.__v;
        return ret;
      },
    },

  }
);

userSchema.index({ status: 1, role: 1 });

const User = mongoose.model("User", userSchema);

export default User;
