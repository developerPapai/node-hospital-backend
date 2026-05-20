// Server setup and start server

import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `\n🚀 Server is running on port ${PORT}\n` +
          `   Environment : ${process.env.NODE_ENV}\n` +
          `   Health Check: http://localhost:${PORT}/health\n` +
          `   API Base    : http://localhost:${PORT}/api/v1\n`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
