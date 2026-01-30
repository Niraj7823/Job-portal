import mongoose, { Schema, models } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      default: "user",
    },
    phone: String,
    location: String,
    headline: String,
    bio: String,
    experience: String,
    education: String,
    skills: [String],
    resumeUrl: String,
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
