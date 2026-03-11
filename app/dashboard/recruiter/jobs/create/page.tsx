"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    skills: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    console.log("jobs", payload);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recruiter/jobs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const text = await res.text();
      toast.error("Failed to post job: " + text);
      return;
    }

    toast.success("Job posted successfully!");
    router.push("/dashboard/recruiter");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-3 text-lg text-gray-600">
            Attract top talent by creating a detailed job posting
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8" />
              Job Details
            </h2>
          </div>

          <form onSubmit={submit} className="p-8 space-y-6">
            {/* Job Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-5 h-5 text-gray-500" />
                Job Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. TechCorp Inc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <input
                required
                type="text"
                placeholder="e.g. React, TypeScript, Node.js, Tailwind CSS"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
              <p className="mt-2 text-sm text-gray-500">
                Separate skills with commas
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                Location
              </label>
              <input
                required
                type="text"
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            {/* Job Type & Salary - Side by side on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  Employment Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  Salary Range (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $120,000 - $180,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                required
                rows={8}
                placeholder="Describe the role, responsibilities, requirements, and what makes your company great..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting Job...
                  </>
                ) : (
                  <>
                    <Briefcase className="w-6 h-6" />
                    Post Job Opening
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
