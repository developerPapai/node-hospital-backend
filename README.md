# Hospital App - Backend


A production-grade, robust backend for managing hospital operations with Role-Based Access Control (RBAC), built with **Node.js**, **Express**, and **MongoDB**. This project follows a strictly layered **MVC architecture** (Models-Views-Controllers) with dedicated service layers for business logic, ensuring scalability, maintainability, and security.

---

## 🚀 Features

- **Robust Authentication**: JWT-based secure login with server-side token revocation and role-based access control (RBAC).
- **Patient Management**: Complete CRUD with auto-generated unique Patient IDs (`PAT-YYYY-XXXX`) and history tracking.
- **Doctor Management**: Availability tracking and department-based filtering for appointment scheduling.
- **Appointment Booking**: Intelligent scheduling with auto-incrementing daily token numbers and unique Appointment IDs (`APT-YYYYMMDD-XXXX`).
- **PDF Slip Generation**: On-the-fly generation of professional A5 appointment slips using PDFKit.
- **Security & Performance**: Built with Helmet, CORS, Rate Limiting, Compression, and Morgan logging.

---

## 🛠️ Technologies Used

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Security**: [JSON Web Token (JWT)](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Validation**: [Express-Validator](https://express-validator.github.io/docs/)
- **Utility**: [PDFKit](https://pdfkit.org/) (Slip Generation), [Dotenv](https://github.com/motdotla/dotenv), [Morgan](https://github.com/expressjs/morgan)

---

## 📁 Folder Structure

```text
hospital-app-backend/
├── public/                 # Static assets (logos, etc.)
├── src/
│   ├── config/             # Database and environment configurations
│   ├── constants/          # Global constants and enums
│   ├── controllers/        # HTTP request handlers (thin layer)
│   ├── middlewares/        # Auth, Role, Error, and Validation middlewares
│   ├── models/             # Mongoose schemas and indexes
│   ├── routes/             # API route definitions
│   ├── services/           # CORE Business Logic (heavy lifting)
│   ├── utils/              # Helper functions (ID generation, PDF logic)
│   ├── app.js              # Express app initialization
│   └── server.js           # Entry point (Server listener)
├── .env                    # Environment variables (Secret)
├── Readme.md               # Original API Documentation
└── package.json            # Dependencies and scripts
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 2. Clone and Install
```bash
git clone <repository-url>
cd hospital-app-backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=8h
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 4. Run the Application
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

---

##  General Conventions

### Request Headers

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes (for POST/PUT/PATCH) |
| `Authorization` | `Bearer <jwt_token>` | Yes (all protected routes) |


### Role-Based Access Control (RBAC)

| Role | Description |
|---|---|
| `admin` | Full access — manage users, doctors, view all data |
| `staff` | Register patients, book appointments, generate slips |
| `nurse` | View appointments and patient info (read-focused) |



## 📑 API Documentation

### 1. Authentication

#### **1.1 Login**
- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Auth:** Public
- **Request Body:**

```json
{
  "email": "hospital@admin.com",
  "password": "Hospital@123"
}
```
| Field | Type | Required | Validation |
|---|---|---|---|
| `email` | String | Yes | Valid email format |
| `password` | String | Yes | Min 6 characters |

- **Response Format:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDA0MGQ4N2EzZTliYWQ5MDhmOWQ0ZiIsImVtYWlsIjoiaG9zcGl0YWxAYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc4NDE4MDMyLCJleHAiOjE3Nzg0NDY4MzJ9.Swkk0e5CTisytfzIsHzQLnUd07kVxA-Ktd-Ct_WHWh4",
    "user": {
      "_id": "6a0040d87a3e9bad908f9d4f",
      "name": "Super Admin",
      "email": "hospital@admin.com",
      "phone": "9999999999",
      "role": "admin",
      "status": "active",
      "last_login": "2026-05-10T13:00:32.804Z",
      "createdAt": "2026-05-10T08:24:56.906Z",
      "updatedAt": "2026-05-10T13:00:32.804Z"
    }
  }
}
```
**Error Responses:**

| Status | Message |
|---|---|
| `400` | Validation failed |
| `401` | Invalid email or password |
| `403` | Account is inactive. Contact administrator |

---

#### **1.2 Logout**
- **Method:** `POST`
- **URL:** `/api/v1/auth/logout`
- **Auth:** `JWT Bearer`
- **Request Body:** None
- **Response Format:** 
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

#### **1.3 Get Current User Profile**
- **Method:** `GET`
- **URL:** `/api/v1/auth/me`
- **Auth:** `JWT Bearer`
- **Request Body:** None
- **Response Format:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "6a0040d87a3e9bad908f9d4f",
    "name": "Super Admin",
    "email": "hospital@admin.com",
    "phone": "9999999999",
    "role": "admin",
    "status": "active",
    "last_login": "2026-05-10T13:00:32.804Z",
    "createdAt": "2026-05-10T08:24:56.906Z",
    "updatedAt": "2026-05-10T13:00:32.804Z"
  }
}
```

---

### 2. Patient Management

#### **2.1 Register New Patient**
- **Method:** `POST`
- **URL:** `/api/v1/patients`
- **Auth:** `JWT Bearer`
- **Access:**  `staff`, `admin`
- **Request Body:**

```json
{
  "name": "Ramesh Kumar",
  "phone": "9812345678",
  "gender": "Male",
  "age": 45,
  "address": "Kumarghat, Tripura"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | String | Yes | Min 2, Max 100 characters |
| `phone` | String | Yes | 10-digit Indian mobile number |
| `gender` | String | Yes | `Male` \| `Female` \| `Other` |
| `age` | Number | Yes | Integer, 0–120 |
| `address` | String | No | Max 255 characters |

- **Response Format:**
```json 
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "patient_id": "PAT-2026-0006",
    "name": "Ramesh Kumar",
    "phone": "9897285678",
    "gender": "Male",
    "age": 45,
    "address": "Kumarghat, Tripura",
    "registered_by": "6a0040d87a3e9bad908f9d4f",
    "registered_at": "2026-05-10T13:45:05.408Z",
    "_id": "6a008be16c9c7c39575c0494",
    "createdAt": "2026-05-10T13:45:05.413Z",
    "updatedAt": "2026-05-10T13:45:05.413Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | Validation failed |
| `409` | Patient with this phone number already exists |

---

#### **2.2 Get All Patients/ Search Patients**

Search by phone number or name. Used before booking to avoid duplicate registration.

- **Method:** `GET`
- **URL:** `/api/v1/patients`
- **Auth:** `JWT Bearer`
- **Access:** `staff`, `nurse`, `admin`
- **Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `phone` | String | Partial or full phone number |
| `name` | String | Partial name (case-insensitive) |
| `page` | Number | Page number (default: `1`) |
| `limit` | Number | Results per page (default: `10`) |
- **Request Body:** None
- **Response Format:** 
```json
{
  "success": true,
  "message": "Patients fetched successfully",
  "data": {
    "patients": [
      {
        "_id": "6a008be16c9c7c39575c0494",
        "patient_id": "PAT-2026-0006",
        "name": "Ramesh Kumar",
        "phone": "9897285678",
        "gender": "Male",
        "age": 45,
        "address": "Kumarghat, Tripura",
        "registered_by": "6a0040d87a3e9bad908f9d4f",
        "registered_at": "2026-05-10T13:45:05.408Z",
        "createdAt": "2026-05-10T13:45:05.413Z",
        "updatedAt": "2026-05-10T13:45:05.413Z",
        "__v": 0
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

#### **2.3 Get Patient by ID**
- **Method:** `GET`
- **URL:** `/api/v1/patients/:id`
- **Auth:** `JWT Bearer`
- **Access:** `staff`, `nurse`, `admin`
- **Note:** `:id` can be MongoDB `_id` or `patient_id`.
- **Request Body:** None
- **Response Format:** 
```json
{
  "success": true,
  "message": "Patient fetched successfully",
  "data": {
    "_id": "6a008be16c9c7c39575c0494",
    "patient_id": "PAT-2026-0006",
    "name": "Ramesh Kumar",
    "phone": "9897285678",
    "gender": "Male",
    "age": 45,
    "address": "Kumarghat, Tripura",
    "registered_by": {
      "_id": "6a0040d87a3e9bad908f9d4f",
      "name": "Super Admin"
    },
    "registered_at": "2026-05-10T13:45:05.408Z",
    "createdAt": "2026-05-10T13:45:05.413Z",
    "updatedAt": "2026-05-10T13:45:05.413Z"
  }
}
```
**Error Responses:**

| Status | Message |
|---|---|
| `404` | Patient not found |

---


### 3. Doctor Management

#### **3.1 Get All Doctors or Available Doctors**

Returns only doctors with `is_available: true`. Used on the appointment booking form to populate the doctor dropdown.

- **Method:** `GET`
- **URL:** `/api/v1/doctors`
- **Auth:** `JWT Bearer`
- **Access:** `staff`, `nurse`, `admin`
- **Query Params:** `available` (boolean), `department`
- **Response Format:** 
```json
{
  "success": true,
  "message": "Doctors fetched successfully",
  "data": [
    {
      "_id": "6a0040d97a3e9bad908f9d5a",
      "name": "Dr. Neha Sharma",
      "specialization": "Psychiatry",
      "department": "Mental Health",
      "is_available": true,
      "__v": 0,
      "createdAt": "2026-05-10T08:24:57.121Z",
      "updatedAt": "2026-05-10T08:24:57.121Z"
    }
  ]
}
```
- **Method:** `PATCH`
- **URL:** `/api/v1/doctors/:id`
- **Auth:** `JWT Bearer`
- **Access:** `admin` only
- **Note:** `:id` is only be MongoDB `_id` 
- **Request Body:** 
```json
{
  "is_available": false
}
```
- **Response:** 
```json
{
  "success": true,
  "message": "Doctor updated successfully",
  "data": {
    "_id": "6a0040d97a3e9bad908f9d55",
    "name": "Dr. Rahul Roy",
    "specialization": "Orthopedics",
    "department": "Surgery",
    "is_available": false,
    "createdAt": "2026-05-10T08:24:57.121Z",
    "updatedAt": "2026-05-10T19:38:36.883Z"
  }
}
```

---

### 4. Appointment Management

The core booking endpoint. Links a patient to a doctor for a specific date/time, and records the disease and symptoms for that visit.

#### **4.1 Book Appointment**
- **Method:** `POST`
- **URL:** `/api/v1/appointments`
- **Auth:** `JWT Bearer`
- **Access:** `staff`, `admin`
- **Request Body:**

```json
{
  "patient_id": "6a0040d97a3e9bad908f9d5c",
  "doctor_id": "6a0040d97a3e9bad908f9d53",
  "disease": "Typhoid",
  "symptoms": "Bukhaar, kamzori, pet dard",
  "scheduled_at": "2026-05-12"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `patient_id` | ObjectId | Yes | Must reference existing patient |
| `doctor_id` | ObjectId | Yes | Must reference available doctor |
| `disease` | String | Yes | Max 200 characters |
| `symptoms` | String | Yes | Max 500 characters |
| `scheduled_at` | DateTime | Yes | ISO 8601, must be future date |

- **Response Format:** 

```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "_id": "6a00e1696c9c7c39575c0496",
    "appointment_no": "APT-20260510-0003",
    "token_no": 1,
    "patient_id": {
      "_id": "6a0040d97a3e9bad908f9d5c",
      "patient_id": "PAT-2026-0001",
      "name": "Ramesh Kumar",
      "phone": "9812345678",
      "gender": "Male",
      "age": 45
    },
    "doctor_id": {
      "_id": "6a0040d97a3e9bad908f9d53",
      "name": "Dr. Sunil Biswas",
      "specialization": "Cardiology",
      "department": "Cardiology"
    },
    "booked_by": {
      "_id": "6a0040d87a3e9bad908f9d4f",
      "name": "Super Admin"
    },
    "disease": "Typhoid",
    "symptoms": "Bukhaar, kamzori, pet dard",
    "status": "scheduled",
    "scheduled_at": "2026-05-12T00:00:00.000Z",
    "createdAt": "2026-05-10T19:50:01.683Z",
    "updatedAt": "2026-05-10T19:50:01.683Z"
  }
}
```
**Error Responses:**

| Status | Message |
|---|---|
| `400` | Validation failed |
| `404` | Patient not found |
| `404` | Doctor not found or not available |

---

#### **4.2 Get all Appointments or Daily Scheduled Appointments**

Returns appointments filtered by date, doctor, or status. Used for the daily schedule view.

- **Method:** `GET`
- **URL:** `/api/v1/appointments`
- **Auth:** `JWT Bearer`
- **Access:** `staff`, `nurse`, `admin`
**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `date` | String | Filter by date — `YYYY-MM-DD`. If omitted, returns all appointments. |
| `doctor_id` | ObjectId | Filter by doctor |
| `status` | String | `scheduled` \| `completed` \| `cancelled` |
| `page` | Number | Default: `1` |
| `limit` | Number | Default: `20` |

- **Request Body:** None
- **Response Format:** 
```json
{
  "success": true,
  "message": "Appointments fetched successfully",
  "data": {
    "appointments": [
      {
        "_id": "6a00e1696c9c7c39575c0496",
        "appointment_no": "APT-20260510-0003",
        "token_no": 1,
        "booked_by": "6a0040d87a3e9bad908f9d4f",
        "disease": "Typhoid",
        "symptoms": "Bukhaar, kamzori, pet dard",
        "status": "scheduled",
        "scheduled_at": "2026-05-12T00:00:00.000Z",
        "createdAt": "2026-05-10T19:50:01.683Z",
        "updatedAt": "2026-05-10T19:50:01.683Z",
        "__v": 0,
        "patient": {
          "_id": "6a0040d97a3e9bad908f9d5c",
          "patient_id": "PAT-2026-0001",
          "name": "Ramesh Kumar",
          "phone": "9812345678",
          "gender": "Male",
          "age": 45
        },
        "doctor": {
          "_id": "6a0040d97a3e9bad908f9d53",
          "name": "Dr. Sunil Biswas",
          "specialization": "Cardiology"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```


Used to mark an appointment as `completed` or `cancelled`.

- **Method:** `PATCH`
- **URL:** `/api/v1/appointments/:id/status`
- **Auth:** `JWT Bearer`
- **Access:** `staff`, `nurse`, `admin`
**Request Body:**

```json
{
  "status": "completed"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `status` | String | Yes | `completed` \| `cancelled` |

- **Response Format:** 
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": {
    "_id": "6a00e1696c9c7c39575c0496",
    "appointment_no": "APT-20260510-0003",
    "token_no": 1,
    "patient_id": {
      "_id": "6a0040d97a3e9bad908f9d5c",
      "name": "Ramesh Kumar"
    },
    "doctor_id": {
      "_id": "6a0040d97a3e9bad908f9d53",
      "name": "Dr. Sunil Biswas"
    },
    "booked_by": "6a0040d87a3e9bad908f9d4f",
    "disease": "Typhoid",
    "symptoms": "Bukhaar, kamzori, pet dard",
    "status": "completed",
    "scheduled_at": "2026-05-12T00:00:00.000Z",
    "createdAt": "2026-05-10T19:50:01.683Z",
    "updatedAt": "2026-05-10T20:56:21.659Z"
  }
}
```
**Error Responses:**

| Status | Message |
|---|---|
| `400` | Cannot modify a completed or cancelled appointment |
| `404` | Appointment not found |

---

#### **4.5 Download Appointment Slip (PDF)**

Generates and streams a PDF appointment slip using **PDFKit** in the backend server. The PDF is streamed directly as a binary response — the frontend should handle it as a file download or open it in a new tab.

- **Method:** `GET`
- **URL:** `/api/v1/appointments/:id/slip`
- **Auth:** `JWT Bearer`
- **Access:** `staff`, `admin`
- **Request Body:** None
**Response Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="APT-20250510-0001.pdf"
```

**Response Body:** Binary PDF stream

---

| Status | Message (JSON) |
|---|---|
| `404` | Appointment not found |
| `400` | Cannot generate slip for cancelled appointment |

---

## 8. Error Reference

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / Validation error |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — valid token but insufficient role |
| `404` | Resource not found |
| `409` | Conflict — duplicate unique field |
| `422` | Unprocessable entity |
| `500` | Internal server error |


## Appendix — API Endpoint Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/login` | User login | Public |
| `POST` | `/auth/logout` | User logout | All |
| `GET` | `/auth/me` | Get own profile | All |
| `GET` | `/patients` | Search patients | staff, nurse, admin |
| `POST` | `/patients` | Register new patient | staff, admin |
| `GET` | `/patients/:id` | Get patient details | staff, nurse, admin |
| `GET` | `/doctors` | List doctors | staff, nurse, admin |
| `POST` | `/appointments` | Book appointment | staff, admin |
| `GET` | `/appointments` | Get all appointments (daily schedule) | staff, nurse, admin |
| `GET` | `/appointments/:id/slip` | Download appointment slip PDF | staff, admin |

Documentation last updated on: **May 21, 2026** by **Papai Roy** (Backend Developer) 
Github: [github.com/developerPapai](https://github.com/developerPapai)
---
