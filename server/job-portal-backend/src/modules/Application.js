import mongoose from "mongoose";

const { Schema, models } = mongoose;

const ApplicationSchema = new Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ["PENDING", "SHORTLISTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Application =
  models.Application || mongoose.model("Application", ApplicationSchema);

export default Application;
