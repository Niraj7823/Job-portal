import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import jobRoutes from "./src/routes/job.routes.js";
import recruiterRoutes from "./src/routes/recruiter.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import cors from "cors";
// import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use("/api/profile", profileRoutes);

// JOB ROUTES
app.use("/api/jobs", jobRoutes);

// Recruiter
app.use("/api/recruiter", recruiterRoutes);

// User
app.use("/api/user", userRoutes);

// login
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
