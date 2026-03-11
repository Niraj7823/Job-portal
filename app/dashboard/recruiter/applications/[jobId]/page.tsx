// app/recruiter/jobs/[jobId]/applicants/page.tsx (or similar)
"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Mail, Calendar, FileText, User, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ApplicantsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplicants = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recruiter/applications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ jobId }),
          }
        );

        if (!res.ok) {
          console.error("Error:", await res.text());
          return;
        }

        const data = await res.json();
        setApplicants(data);
      } catch (err) {
        console.error("Failed to load applicants", err);
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [jobId]);

  const updateStatus = async (
    applicationId: string,
    status: "shortlisted" | "rejected"
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recruiter/applications/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ applicationId, status: status.toUpperCase() }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error || "Failed to update status");
        return;
      }

      const updated = await res.json();

      // update UI instantly
      setApplicants((prev: any[]) =>
        prev.map((app) => (app._id === updated._id ? updated : app))
      );
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Job Applicants</h1>
          <p className="text-gray-600 mt-3 text-lg">
            Review candidates who applied to your job posting
          </p>
        </div>

        {/* Applicants List */}
        {applicants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No applicants yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Once candidates start applying, they'll appear here for you to
              review their profiles and resumes.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-8"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {app.userId?.name || "Unknown User"}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{app.userId?.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter / Message */}
                    {app.message ? (
                      <div className="mt-5 bg-gray-50 rounded-xl p-5">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Cover Letter / Application Message:
                        </p>
                        <p className="text-gray-800 leading-relaxed">
                          {app.message}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mt-4">
                        No cover letter provided
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-6">
                      <Calendar className="w-4 h-4" />
                      Applied on{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4" />
                      {(() => {
                        const now = new Date();
                        const applied = new Date(app.createdAt);
                        const diffMs = now.getTime() - applied.getTime();
                        const diffDays = Math.floor(
                          diffMs / (1000 * 60 * 60 * 24)
                        );
                        return diffDays === 0
                          ? "Today"
                          : diffDays === 1
                          ? "Yesterday"
                          : `${diffDays} days ago`;
                      })()}
                    </div>
                  </div>

                  <div className="md:w-64 space-y-4">
                    {app.userId?.resumeUrl ? (
                      <a
                        href={app.userId.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                      >
                        <FileText className="w-5 h-5" />
                        View Resume
                      </a>
                    ) : (
                      <div className="w-full text-center py-4 bg-gray-100 rounded-xl">
                        <p className="text-gray-500 text-sm">
                          No resume uploaded
                        </p>
                      </div>
                    )}

                    {app.status === "SHORTLISTED" ? (
                      <div className="w-full text-center py-3 rounded-lg bg-green-100 text-green-700 font-semibold">
                        Selected
                      </div>
                    ) : app.status === "REJECTED" ? (
                      <div className="w-full text-center py-3 rounded-lg bg-red-100 text-red-700 font-semibold">
                        Rejected
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateStatus(app._id, "shortlisted")}
                          className="flex-1 px-4 py-2 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition"
                        >
                          Shortlist
                        </button>

                        <button
                          onClick={() => updateStatus(app._id, "rejected")}
                          className="flex-1 px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {applicants.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Application Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">
                  {applicants.length}
                </p>
                <p className="text-gray-600">Total Applicants</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {applicants.filter((a) => a.userId?.resumeUrl).length}
                </p>
                <p className="text-gray-600">With Resume</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {applicants.filter((a) => a.message).length}
                </p>
                <p className="text-gray-600">With Cover Letter</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-700">
                  {applicants.length > 0
                    ? Math.round(
                        (applicants.filter((a) => a.userId?.resumeUrl).length /
                          applicants.length) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-gray-600">Resume Rate</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
