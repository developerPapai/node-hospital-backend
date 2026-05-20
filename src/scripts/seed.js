//  Database Seeder Script

import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import * as patientService from "../services/patient.service.js";
import * as appointmentService from "../services/appointment.service.js";
import { USER_ROLES } from "../constants.js";

const SEED_PASSWORD = "Hospital@123";

const seed = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});

    console.log("👤 Creating demo users...");
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, saltRounds);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@hospital.com",
      phone: "9999999999",
      password_hash: passwordHash,
      role: USER_ROLES.ADMIN,
      status: "active",
    });

    const staff = await User.create({
      name: "Main Staff",
      email: "staff@hospital.com",
      phone: "8888888888",
      password_hash: passwordHash,
      role: USER_ROLES.STAFF,
      status: "active",
    });

    const nurse = await User.create({
      name: "Head Nurse",
      email: "nurse@hospital.com",
      phone: "7777777777",
      password_hash: passwordHash,
      role: USER_ROLES.NURSE,
      status: "active",
    });

    console.log("✅ Admin, Staff, and Nurse accounts created.");

    console.log("👨‍⚕️ Creating 10 demo doctors...");
    const doctorsData = [
      {
        name: "Dr. Anjali Sen",
        specialization: "General Medicine",
        department: "OPD",
      },
      {
        name: "Dr. Sunil Biswas",
        specialization: "Cardiology",
        department: "Cardiology",
      },
      {
        name: "Dr. Priya Das",
        specialization: "Pediatrics",
        department: "OPD",
      },
      {
        name: "Dr. Rahul Roy",
        specialization: "Orthopedics",
        department: "Surgery",
      },
      {
        name: "Dr. Meera Nair",
        specialization: "Gynecology",
        department: "OPD",
      },
      {
        name: "Dr. Vikram Singh",
        specialization: "Neurology",
        department: "Emergency",
      },
      {
        name: "Dr. Sarah Khan",
        specialization: "Dermatology",
        department: "OPD",
      },
      {
        name: "Dr. Amit Verma",
        specialization: "Ophthalmology",
        department: "OPD",
      },
      {
        name: "Dr. Neha Sharma",
        specialization: "Psychiatry",
        department: "Mental Health",
      },
      {
        name: "Dr. Rajesh Gupta",
        specialization: "Urology",
        department: "Surgery",
      },
    ];

    const createdDoctors = await Doctor.insertMany(doctorsData);
    console.log("✅ 10 Doctors created.");

    console.log("🏥 Registering 5 demo patients...");
    const patientsData = [
      {
        name: "Ramesh Kumar",
        phone: "9812345678",
        gender: "Male",
        age: 45,
        address: "Agartala, Tripura",
      },
      {
        name: "Sunita Das",
        phone: "9876543210",
        gender: "Female",
        age: 32,
        address: "Udaipur, Tripura",
      },
      {
        name: "Suman Roy",
        phone: "9436123456",
        gender: "Male",
        age: 28,
        address: "Kailashahar, Tripura",
      },
      {
        name: "Rita Paul",
        phone: "9123456789",
        gender: "Female",
        age: 54,
        address: "Dharmanagar, Tripura",
      },
      {
        name: "Abhijit Sen",
        phone: "8794561230",
        gender: "Male",
        age: 19,
        address: "Ambassa, Tripura",
      },
    ];

    const createdPatients = [];
    for (const p of patientsData) {
      const patient = await patientService.register(p, staff._id);
      createdPatients.push(patient);
    }
    console.log("✅ 5 Patients registered.");

    console.log("📅 Booking 2 demo appointments...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    await appointmentService.book(
      {
        patient_id: createdPatients[0]._id,
        doctor_id: createdDoctors[0]._id,
        disease: "Common Flu",
        symptoms: "Fever, cough, body ache",
        scheduled_at: tomorrow.toISOString(),
      },
      staff._id
    );

    await appointmentService.book(
      {
        patient_id: createdPatients[1]._id,
        doctor_id: createdDoctors[1]._id,
        disease: "Chest Pain",
        symptoms: "Mild discomfort in chest while walking",
        scheduled_at: tomorrow.toISOString(),
      },
      staff._id
    );

    console.log("✅ 2 Appointments booked.");

    console.log("\n🚀 DATABASE SEEDED SUCCESSFULLY!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding Failed:");
    console.error(error.message);
    process.exit(1);
  }
};

seed();
