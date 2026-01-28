import express from "express";
import {
  getUserAppliedJobs,
  getUserApplications,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/applications", protect, getUserAppliedJobs);
router.get("/applications", protect, getUserApplications);

export default router;
