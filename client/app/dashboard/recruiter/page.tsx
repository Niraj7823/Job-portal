"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Plus } from "lucide-react";

export default function RecruiterDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recruiter/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      setJobs(data);
    };

    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <button
            onClick={() => router.push("/dashboard/recruiter/jobs/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Post Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center shadow">
            <Briefcase className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">
              You haven’t posted any jobs yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow p-6 border"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>

                <p className="text-sm text-gray-500 mt-2">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/recruiter/applications/${job._id}`
                      )
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
