"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditRecruiterProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    bio: "",
    location: "",
  });

  // Load profile from DB
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) return;

      const data = await res.json();
      console.log(data);

      setForm({
        name: data.name || "",
        company: data.company || "",
        bio: data.bio || "",
        location: data.location || "",
      });
    };

    loadProfile();
  }, []);

  // Save profile to DB
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated");
      setLoading(false);
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      },
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data?.error || "Failed to update profile");
      return;
    }
    toast.success("Profile updated successfully!");

    // redirect after success
    router.push("/dashboard/recruiter/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Recruiter Profile</h1>

        <form onSubmit={submit} className="space-y-5">
          <Input
            label="Full Name"
            value={form.name}
            // onChange={(e) => setForm({ ...form, name: e.target.value })}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            label="Company"
            value={form.company}
            // onChange={(e) => setForm({ ...form, company: e.target.value })}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, company: e.target.value })
            }
          />
          <Input
            label="Location"
            value={form.location}
            // onChange={(e) => setForm({ ...form, location: e.target.value })}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <Textarea
            label="Bio"
            value={form.bio}
            // onChange={(e) => setForm({ ...form, bio: e.target.value })}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, bio: e.target.value })
            }
            placeholder="About your company or hiring goals"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
