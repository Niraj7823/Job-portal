import express from "express";
import jobRoutes from "./routes/job.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

const app = express();

app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

export default app;
