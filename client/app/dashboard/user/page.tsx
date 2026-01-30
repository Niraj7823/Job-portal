// app/dashboard/user/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Briefcase,
  Upload,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  // const [jobs, setJobs] = useState([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [resume, setResume] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchedPages = useRef(new Set<number>());

  interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary?: number;
  }
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
    }
  }, []);

  // Load all jobs
  // useEffect(() => {
  //   const loadJobs = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`
  //       );

  //       if (!res.ok) throw new Error("Failed to load jobs");

  //       const data = await res.json();
  //       setJobs(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   loadJobs();
  // }, []);
  useEffect(() => {
    if (fetchedPages.current.has(page)) return;

    fetchedPages.current.add(page);

    const loadJobs = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs?page=${page}`,
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("API error:", res.status, text);
          throw new Error("Failed to fetch job");
        }

        const data = await res.json();

        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        setJobs((prev) => [...prev, ...data]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [page]);

  useEffect(() => {
    if (!user) return;

    const loadApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("API error:", res.status, text);
          throw new Error("Failed to fetch job");
        }

        const data = await res.json();
        setAppliedJobs(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadApplications();
  }, [user]);

  const uploadResume = async () => {
    if (!resume || !user) return;

    setUploading(true);
    const form = new FormData();
    form.append("resume", resume);
    form.append("userId", user._id);

    try {
      const res = await fetch("/api/upload/resume", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.resumeUrl) {
        const updatedUser = { ...user, resumeUrl: data.resumeUrl };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Resume uploaded successfully!");
        setResume(null);
      } else {
        toast.error(data.error || "Upload failed!");
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track your applications and discover new opportunities
          </p>
        </div>

        {/* Applied Jobs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            Jobs You've Applied To
          </h2>

          {appliedJobs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">
                You haven’t applied to any jobs yet.
              </p>
              <p className="text-gray-500 mt-2">
                Start exploring jobs below and apply today!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {appliedJobs.map((job: any) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Applied
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">{job.company}</p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Applied on {new Date(job.appliedOn).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {job.description}
                  </p>
                  <button
                    onClick={() => (window.location.href = `/jobs/${job._id}`)}
                    className="mt-5 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resume Upload Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Your Resume
            </h2>

            {user?.resumeUrl ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-12 h-12 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Resume Uploaded
                    </p>
                    <a
                      href={user.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View your resume →
                    </a>
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload your resume to apply faster
                </p>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload New Resume (PDF or DOCX)
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />

                {resume && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-700">
                      Selected: <strong>{resume.name}</strong>
                    </span>
                    <button
                      onClick={() => setResume(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-4">
                <button
                  onClick={uploadResume}
                  disabled={!resume || uploading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* All Available Jobs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Job Opportunities
          </h2>

          {jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              No jobs posted yet. Check back soon!
            </p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job: any) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 hover:border-blue-200 cursor-pointer"
                    onClick={() => (window.location.href = `/jobs/${job._id}`)}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-700 font-medium mb-4">
                      {job.company}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-5">
                      {job.location && (
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </p>
                      )}
                      {job.salary && (
                        <p className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {job.type || "Full-time"}
                      </p>
                    </div>

                    <p className="text-gray-600 line-clamp-3 mb-5">
                      {job.description
                        ? job.description.substring(0, 120)
                        : "No description available"}
                    </p>

                    <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                      View Job Details
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
