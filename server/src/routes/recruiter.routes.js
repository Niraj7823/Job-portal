import express from "express";
import { getRecruiters } from "../controllers/recruiter.controller.js";
import {
  updateApplicationStatus,
  getJobApplications,
  createRecruiterJob,
  getRecruiterJobs,
} from "../controllers/recruiter.controller.js";
import { protect, recruiterOnly } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/applications", protect, recruiterOnly, getJobApplications);
router.patch(
  "/applications/status",
  protect,
  recruiterOnly,
  updateApplicationStatus,
);
router.put("/profile/update", protect, updateProfile);

router.post("/jobs", protect, recruiterOnly, createRecruiterJob);
router.get("/jobs", protect, recruiterOnly, getRecruiterJobs);

router.get("/", getRecruiters);

export default router;
