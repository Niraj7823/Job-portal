import User from "../modules/User.js";
import mongoose from "mongoose";
import Application from "../modules/Application.js";
import Job from "../modules/Job.js";
import { sendEmail } from "../utils/sendEmail.js";

export const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: "recruiter" }).select(
      "-password"
    );

    res.status(200).json(recruiters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/recruiter/applications/status

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: "Invalid applicationId" });
    }

    const normalizedStatus = status?.toUpperCase();
    if (!["SHORTLISTED", "REJECTED"].includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: normalizedStatus },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("jobId", "title");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (normalizedStatus === "SHORTLISTED") {
      await sendEmail({
        to: application.userId.email,
        subject: "You have been shortlisted!",
        html: `
          <h2>Congratulations ${application.userId.name}!</h2>
          <p>You have been <strong>shortlisted</strong> for the job you applied for.<strong>${application.jobId.title}</strong></p>
          <br/>
          <p>The recruiter will contact you soon.</p>
          <br/>
          <p>Best wishes,</p>
          <p><strong>Job Portal Team</strong></p>
        `,
      });
    }

    return res.json(application);
  } catch (err) {
    console.error("Update application status error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/recruiter/applications

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid or missing jobId" });
    }

    const applications = await Application.find({ jobId })
      .populate("userId", "name email")
      .populate("jobId", "title")
      .lean();

    res.json(applications);
  } catch (err) {
    console.error("getJobApplications ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/recruiter/jobs

export const createRecruiterJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      recruiterId: new mongoose.Types.ObjectId(req.user.id),
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/recruiter/jobs

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
