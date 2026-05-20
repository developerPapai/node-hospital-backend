import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import dotenv from "dotenv";
dotenv.config();
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import routes from "./routes/index.js";

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "*"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
  })
);

// Gzip Compression (brotli disabled for compatibility with img tags)
app.use(
  compression({
    brotli: false,
  })
);

// CORS Configuration
const corsOptions = {
  origin:
    process.env.ALLOWED_ORIGINS === "*"
      ? "*"
      : process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// JSON Body Parser
app.use(express.json({ limit: "16kb" }));

// URL-encoded body parser for form data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// HTTP Request Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.RATE_LIMIT_MAX, 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: [],
  },
});
app.use("/api", apiLimiter);

// Static Files
app.use(express.static("public"));

//  API Routes
app.use("/api/v1", routes);

// Health Check Endpoint
app.get("/health", (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      },
      "Server is running"
    )
  );
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
