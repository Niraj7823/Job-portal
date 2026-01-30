"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Filter,
} from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const canApply = user && user.role === "user";
  const [page, setPage] = useState(1);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Any",
    minSalary: "",
    maxSalary: "",
  });
  const buildFilters = () => {
    const clean: any = {};

    if (filters.title.trim()) clean.title = filters.title;
    if (filters.company.trim()) clean.company = filters.company;
    if (filters.location.trim()) clean.location = filters.location;

    if (filters.jobType !== "Any") {
      clean.jobType = filters.jobType;
    }

    if (filters.minSalary) {
      clean.minSalary = Number(filters.minSalary);
    }

    if (filters.maxSalary) {
      clean.maxSalary = Number(filters.maxSalary);
    }

    return clean;
  };

  const loadJobs = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const cleanFilters = buildFilters();

      console.log("Sending filters:", cleanFilters);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/search?page=${pageNumber}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanFilters),
        }
      );

      if (!res.ok) throw new Error("Failed to load jobs");

      const data = await res.json();

      setJobs((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadJobs(1);
  };

  const JobTypeBadge = ({ type }: { type: string }) => {
    const colors: Record<string, string> = {
      "Full-time": "bg-blue-100 text-blue-800",
      "Part-time": "bg-purple-100 text-purple-800",
      Remote: "bg-green-100 text-green-800",
      Internship: "bg-orange-100 text-orange-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colors[type] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of opportunities from top companies. Your next
            career move starts here.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Search & Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Job Title */}
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                suppressHydrationWarning
                type="text"
                placeholder="Job Title or Keywords"
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>

            {/* Company */}
            <div className="relative">
              <Building2 className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Company Name"
                value={filters.company}
                onChange={(e) =>
                  setFilters({ ...filters, company: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location (City, Remote)"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <select
                value={filters.jobType}
                onChange={(e) =>
                  setFilters({ ...filters, jobType: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 appearance-none"
              >
                <option value="Any">Any Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="relative">
              <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="Min Salary"
                value={filters.minSalary}
                onChange={(e) =>
                  setFilters({ ...filters, minSalary: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>

            <div className="relative">
              <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="Max Salary (₹)"
                value={filters.maxSalary}
                onChange={(e) =>
                  setFilters({ ...filters, maxSalary: e.target.value })
                }
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-70"
            >
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-lg text-gray-700">
            <strong>{jobs.length}</strong> job{jobs.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job: any) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                onClick={() => (window.location.href = `/jobs/${job._id}`)}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {job.title}
                    </h3>
                    <JobTypeBadge type={job.type || "Full-time"} />
                  </div>

                  <p className="text-lg font-medium text-gray-700 flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    {job.company}
                  </p>

                  <div className="space-y-3 text-gray-600">
                    {job.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {job.location}
                      </p>
                    )}

                    {job.salary && (
                      <p className="flex items-center gap-2 font-semibold text-gray-800">
                        <DollarSign className="w-5 h-5" />
                        {job.salary.toLocaleString()} / year
                      </p>
                    )}

                    <p className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      Posted {Math.floor(Math.random() * 10 + 1)} days ago
                    </p>
                  </div>

                  <p className="mt-5 text-gray-700 line-clamp-3">
                    {job.description}
                  </p>

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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadJobs(nextPage);
          }}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
