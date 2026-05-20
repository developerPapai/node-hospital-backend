// Route Index — all routes register here

import { Router } from "express";
import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.routes.js";
import doctorRoutes from "./doctor.routes.js";
import appointmentRoutes from "./appointment.routes.js";

const router = Router();

// Authentication Routes

router.use("/auth", authRoutes);

// Patient Routes

router.use("/patients", patientRoutes);

// Doctor Routes 

router.use("/doctors", doctorRoutes);

// Appointment Routes 

router.use("/appointments", appointmentRoutes);

export default router;
