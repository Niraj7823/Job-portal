import mongoose from "mongoose";
const { Schema, models } = mongoose;

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
    company: String,
    bio: String,
    experience: String,
    education: String,
    skills: [String],
    resumeUrl: String,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true },
);

const User = models.User || mongoose.model("User", UserSchema);

export default User;
