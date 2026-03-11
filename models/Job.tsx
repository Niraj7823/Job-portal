import mongoose, { Schema, models } from "mongoose";

const JobSchema = new Schema(
  {
    title: String,
    description: String,
    company: String,
    location: String,
    salary: Number,
    experience: String,
    skills: [String],
    recruiterId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Job = models.Job || mongoose.model("Job", JobSchema);
