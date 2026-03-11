"use client";

import { useEffect, useState } from "react";
import ApplyModal from "./ApplyModel";
import toast from "react-hot-toast";
import { use } from "react";

export default function JobDetails({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const canApply = user && user.role === "user";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const loadJob = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/${jobId}`,
        );

        if (!res.ok) throw new Error("Failed to fetch job");

        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadJob();
  }, [jobId]);

  const submitApplication = async (message: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please Login First");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            jobId,
            message,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Application failed");
        return;
      }

      toast.success("Application submitted!");
      setApplied(true);
      setShowModal(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!job)
    return (
      <p className="text-center py-20 text-gray-500 text-lg">
        Loading job details…
      </p>
    );

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>
            <p className="mt-2 text-xl opacity-90">{job.company}</p>

            <div className="mt-6 flex flex-wrap gap-6 text-lg">
              {job.location && (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
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
                  <span>{job.location}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold">{job.salary}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Job Description
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </section>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Apply Button */}
            <div className="border-t pt-8">
              {!applied ? (
                <button
                  disabled={!canApply}
                  className={`mt-6 w-full py-3 font-semibold rounded-xl transition shadow-md
    ${
      canApply
        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
        : "bg-gray-300 text-gray-600 cursor-not-allowed"
    }`}
                >
                  {canApply
                    ? "View Details & Apply"
                    : "Only candidates can apply"}
                </button>
              ) : (
                <p className="flex items-center gap-3 text-xl font-semibold text-green-600">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  You have already applied to this job.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ApplyModal
          job={job}
          user={user}
          onClose={() => setShowModal(false)}
          onSubmit={submitApplication}
        />
      )}
    </>
  );
}
