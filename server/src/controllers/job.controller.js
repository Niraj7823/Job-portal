import Job from "../modules/Job.js";
import Application from "../modules/Application.js";
import User from "../modules/User.js";

export const getJobs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchJobs = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  try {
    const { title, company, location, jobType, minSalary, maxSalary } =
      req.body;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType && jobType !== "Any") {
      query.type = jobType;
    }

    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    const { title, company, description, type, salary, skills, location } =
      req.body;
    if (!type || !company || !description || !location) {
      return res.status(400).json({ error: "all field are required" });
    }

    const job = await Job.create({
      title,
      company,
      description,
      type,
      salary,
      skills,
      location,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { userId, jobId, message } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ error: "userId and jobId required" });
    }

    const alreadyApplied = await Application.findOne({ userId, jobId });
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "You have already applied to this job" });
    }

    const user = await User.findById(userId).lean();
    const resumeUrl = user?.resumeUrl || null;

    const application = await Application.create({
      userId,
      jobId,
      message,
      resumeUrl,
      createdAt: new Date(),
    });

    res.json({
      message: "Application submitted!",
      application,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.body;

    const applicants = await Application.find({ jobId }).populate(
      "userId",
      "name email",
    );

    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
