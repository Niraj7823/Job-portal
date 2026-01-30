"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecruiters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/recruiters`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Failed to fetch recruiters");
        }

        const data = await res.json();
        setRecruiters(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadRecruiters();
  }, []);

  const deleteRecruiter = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete recruiter "${name}"?\nThis will also delete all their posted jobs.`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/recruiter/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to delete recruiter");
      }

      setRecruiters((prev) => prev.filter((r) => r._id !== id));
      toast.success("Recruiter deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Error deleting recruiter. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Manage recruiters and their job postings
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center gap-4 text-gray-600">
              <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600"></div>
              <span className="text-lg sm:text-xl font-medium">
                Loading recruiters...
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
        {!loading && !error && recruiters.length === 0 && (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
              No Recruiters Found
            </h3>
            <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto">
              There are currently no registered recruiters in the system.
            </p>
          </div>
        )}

        {/* Recruiters List - Responsive: Cards on mobile, Table on larger screens */}
        {!loading && !error && recruiters.length > 0 && (
          <>
            {/* Mobile Cards */}
            <div className="block lg:hidden space-y-6">
              {recruiters.map((r) => (
                <div
                  key={r._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                      {r.name?.charAt(0)?.toUpperCase() || "R"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-lg truncate">
                        {r.name || "Unnamed Recruiter"}
                      </p>
                      <p className="text-sm text-gray-500">Recruiter Account</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900 font-medium truncate">
                      {r.email}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/dashboard/admin/recruiter/${r._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all border border-blue-200"
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      View Jobs
                    </Link>

                    <button
                      onClick={() => deleteRecruiter(r._id, r.name || r.email)}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all border border-red-200"
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
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <tr>
                      <th className="px-8 py-5 text-left text-sm font-semibold">
                        Recruiter Name
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recruiters.map((r) => (
                      <tr
                        key={r._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {r.name?.charAt(0)?.toUpperCase() || "R"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {r.name || "Unnamed Recruiter"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Recruiter Account
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-gray-700 font-medium truncate max-w-xs">
                            {r.email}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-6">
                            <Link
                              href={`/dashboard/admin/recruiter/${r._id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
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
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                              View Jobs
                            </Link>

                            <button
                              onClick={() =>
                                deleteRecruiter(r._id, r.name || r.email)
                              }
                              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors hover:bg-red-50 px-4 py-2 rounded-lg"
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
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
