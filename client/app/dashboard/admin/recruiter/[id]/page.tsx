"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminRecruiterJobsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/jobs/recruiter/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load jobs");
        }

        setJobs(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [id]);

  const deleteJob = async (jobId: string, jobTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete the job "${jobTitle}"?`
      )
    ) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to delete job");
      }

      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Recruiter Job Postings
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              Manage all jobs posted by this recruiter
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm w-full sm:w-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Recruiters
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 sm:p-16 text-center">
            <div className="inline-flex items-center gap-4 text-gray-600">
              <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600"></div>
              <span className="text-lg sm:text-xl font-medium">
                Loading jobs...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <svg
              className="w-8 h-8 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <strong className="font-semibold">Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 sm:p-20 text-center">
            <div className="text-gray-400 mb-6">
              <svg
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 13h4m-2-2v4"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
              No Jobs Found
            </h3>
            <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto">
              This recruiter has not posted any jobs yet.
            </p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="p-5 sm:p-7 flex-1 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                  </h2>

                  <p className="text-base sm:text-lg font-medium text-blue-600 mb-4">
                    {job.company}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-gray-600 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M9 6v3m6-3v3m-3 9h.01"
                        />
                      </svg>
                      <span className="capitalize">{job.type}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 flex-1">
                    {job.description || "No description provided."}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => deleteJob(job._id, job.title)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all duration-200 border border-red-200 text-sm sm:text-base"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
