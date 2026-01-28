import Application from "../modules/Application.js";
import User from "../modules/User.js";
import Job from "../modules/Job.js";

// aggregation, lookup
// error handling
// transactions(ACID) commit, rollback

export const getApplications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const apps = await Application.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name email")
      .populate("jobId", "title")
      .select("-__v")
      .lean();

    res.json(apps);
  } catch (error) {
    console.log("Error fetching jobs", error);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

export const approveJob = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(404).json({ message: "Job Id Is Require" });
    }

    const updateJob = await Job.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true },
    );
    if (!updateJob) {
      res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ success: true, job: updateJob });
  } catch (error) {
    console.error("Approve Job Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "recruiter ID require",
      });
    }
    const jobs = await Job.find({ recruiterId: id });
    if (!jobs) {
      res.status(404).json({
        message: "Jobs not found",
      });
    }
    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteRecruiter = async (req, res) => {
  try {
    const { id } = req.params;

    await Job.deleteMany({ recruiterId: id });

    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      res.status(404).json({ message: "Recruiter Not Found" });
    }
    res.status(200).json({ message: "Recruiter Delete Successfully" });
  } catch (error) {
    console.error("Recruiter Delete Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: "recruiter" }).select(
      "-password",
    );
    res.json(recruiters);
  } catch (error) {
    console.error("Get Recruiter Error", error);
    (res.status(500), json({ message: "Internal Server Error" }));
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
