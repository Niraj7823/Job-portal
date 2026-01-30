"use client";

import { useEffect, useState } from "react";
import { Mail, Building2, MapPin, User, Edit2 } from "lucide-react";
import Link from "next/link";

export default function RecruiterProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      setUser(data);
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold shadow-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-blue-100 text-lg mt-1">Recruiter</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Profile Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Email - Usually not editable directly */}
            <Info
              label="Email"
              value={user.email}
              icon={<Mail className="w-5 h-5" />}
            />

            {/* Company - With Edit Button */}
            <Info
              label="Company"
              value={user.company || "Not added"}
              icon={<Building2 className="w-5 h-5" />}
              editLink="/dashboard/recruiter/edit?field=company"
            />

            {/* Location - With Edit Button */}
            <Info
              label="Location"
              value={user.location || "Not added"}
              icon={<MapPin className="w-5 h-5" />}
              editLink="/dashboard/recruiter/edit?field=location"
            />
          </div>

          {/* About Section - With Edit Button */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                About
              </h2>
              <Link
                href="/dashboard/recruiter/edit?field=bio"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Bio
              </Link>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {user.bio || (
                <span className="text-gray-500 italic">
                  No bio added yet. Add one to help candidates know more about
                  you!
                </span>
              )}
            </p>
          </div>

          {/* Main Edit Profile Button (Optional - for full edit) */}
          <div className="mt-10 text-center">
            <Link
              href="/dashboard/recruiter/edit"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              <Edit2 className="w-5 h-5" />
              Edit Full Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
  editLink,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  editLink?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 flex items-start justify-between gap-4 hover:bg-gray-100 transition">
      <div className="flex items-start gap-4">
        <div className="text-blue-600 mt-1">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium text-gray-900 mt-1">{value}</p>
        </div>
      </div>

      {editLink && (
        <Link
          href={editLink}
          className="text-blue-600 hover:text-blue-700 transition"
          title={`Edit ${label}`}
        >
          <Edit2 className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
