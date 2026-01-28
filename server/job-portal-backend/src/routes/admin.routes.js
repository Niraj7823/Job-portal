import express from "express";
import {
  getApplications,
  approveJob,
  deleteJob,
  getRecruiterJobs,
  deleteRecruiter,
  getRecruiters,
  getUsers,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/applications", requireAdmin, getApplications);
router.post("/jobs/approve", requireAdmin, approveJob);
router.delete("/jobs/:jobId", requireAdmin, deleteJob);
router.get("/jobs/recruiter/:id", requireAdmin, getRecruiterJobs);

router.get("/recruiters", requireAdmin, getRecruiters);
router.delete("/recruiter/:id", requireAdmin, deleteRecruiter);

router.get("/users", requireAdmin, getUsers);

export default router;
