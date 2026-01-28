import Application from "../modules/Application.js";
import Job from "../modules/Job.js";
import crypto from "crypto";

export const getUserAppliedJobs = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const applications = await Application.find({ userId }).lean();

    const jobsApplied = await Promise.all(
      applications.map(async (app) => {
        const job = await Job.findById(app.jobId).lean();

        if (!job) return null;

        return {
          ...job,
          appliedOn: app.createdAt,
          message: app.message,
        };
      }),
    );

    const filteredJobs = jobsApplied.filter(Boolean);

    res.json(filteredJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId }).lean();

    const jobsApplied = await Promise.all(
      applications.map(async (app) => {
        const job = await Job.findById(app.jobId).lean();
        if (!job) return null;

        return {
          ...job,
          appliedOn: app.createdAt,
          message: app.message,
        };
      }),
    );

    res.json(jobsApplied.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


