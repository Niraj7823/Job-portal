import express from "express";
import {
  getJobs,
  searchJobs,
  createJob,
  applyJob,
  getApplicants,
  getJobById,
} from "../controllers/job.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/search", searchJobs); // POST /api/jobs/search
router.get("/:id", getJobById); // /api/:id
router.get("/", getJobs); // GET /api/
router.post("/", authenticateUser, createJob); // POST /api/jobs
router.post("/apply", applyJob); // POST /api/jobs/apply
router.post("/applicants", getApplicants); // POST /api/jobs/applicants

export default router;
