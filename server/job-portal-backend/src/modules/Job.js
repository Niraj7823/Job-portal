import mongoose from "mongoose";
const { Schema, models } = mongoose;

const JobSchema = new Schema(
  {
    title: String,
    description: String,
    company: String,
    location: String,
    salary: Number,
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote", "Internship"],
      required: true,
    },
    experience: String,
    skills: [String],
    recruiterId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Job = models.Job || mongoose.model("Job", JobSchema);

export default Job;
