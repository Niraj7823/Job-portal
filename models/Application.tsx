import mongoose, { Schema, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
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

export const Application =
  models.Application || mongoose.model("Application", ApplicationSchema);
