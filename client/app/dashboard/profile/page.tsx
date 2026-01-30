"use client";

import { useEffect, useState } from "react";
import { User, Briefcase, FileText, Settings, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    loadProfile();
  }, []);

  // const saveField = async (field: string) => {
  //   setIsSaving(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       toast.error("Not authenticated");
  //       return;
  //     }

  //     const body: any = { [field]: tempValue };
  //     if (field === "skills") {
  //       body[field] = tempValue.split(",").map((s: string) => s.trim());
  //     }

  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/update`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(body),
  //       }
  //     );

  //     const updatedUser = await res.json();

  //     if (!res.ok) {
  //       toast.error(updatedUser?.error || "Update failed");
  //       return;
  //     }

  //     setUser(updatedUser.user ?? updatedUser);
  //     setEditing(null);
  //     setTempValue("");
  //     toast.success("Saved successfully!");
  //   } catch (err) {
  //     toast.error("Something went wrong");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const saveField = async (field: string) => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Not authenticated");
        setIsSaving(false);
        return;
      }

      const body: any = {};

      if (field === "skills") {
        body.skills = tempValue
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      } else {
        body[field] = tempValue;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Update failed");
        return;
      }

      setUser(data.user);

      setEditing(null);
      setTempValue("");
      toast.success("Saved successfully!");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-light text-gray-600">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="font-semibold text-base">{user.name}</h2>
            <p className="text-xs text-gray-500 truncate max-w-[160px]">
              {user.headline || "No headline"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex">
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-lg shadow-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="p-6 lg:p-8 h-full flex flex-col">
            <div className="hidden lg:flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-gray-500">
                  {user.headline || "No headline"}
                </p>
              </div>
            </div>

            <div className="lg:hidden flex flex-col items-center text-center mb-10 pt-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl mb-4">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="font-bold text-xl">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {user.headline || "No headline"}
              </p>
            </div>

            <nav className="space-y-2 flex-1">
              {[
                { tab: "profile", icon: User, label: "Profile" },
                { tab: "experience", icon: Briefcase, label: "Experience" },
                { tab: "resume", icon: FileText, label: "Resume" },
                { tab: "settings", icon: Settings, label: "Settings" },
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.tab
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 lg:mb-10">
            Profile
          </h1>

          <div className="grid gap-4 max-w-4xl mx-auto">
            <GlassCard title="Personal Information">
              <EditableRow
                label="Full Name"
                value={user.name}
                field="name"
                {...{
                  editing,
                  setEditing,
                  tempValue,
                  setTempValue,
                  saveField,
                  isSaving,
                }}
              />
              <EditableRow
                label="Professional Headline"
                value={user.headline}
                field="headline"
                {...{
                  editing,
                  setEditing,
                  tempValue,
                  setTempValue,
                  saveField,
                  isSaving,
                }}
              />
              <EditableRow
                label="Phone Number"
                value={user.phone}
                field="phone"
                placeholder="Enter your phone number"
                {...{
                  editing,
                  setEditing,
                  tempValue,
                  setTempValue,
                  saveField,
                  isSaving,
                }}
              />
            </GlassCard>

            <GlassCard title="About Me">
              <EditableArea
                label="Bio"
                value={user.bio}
                field="bio"
                {...{
                  editing,
                  setEditing,
                  tempValue,
                  setTempValue,
                  saveField,
                  isSaving,
                }}
              />
            </GlassCard>

            <GlassCard title="Skills">
              <EditableRow
                label="Skills (comma separated)"
                value={user.skills?.join(", ")}
                field="skills"
                placeholder="React, TypeScript, Node.js, Tailwind"
                {...{
                  editing,
                  setEditing,
                  tempValue,
                  setTempValue,
                  saveField,
                  isSaving,
                }}
              />
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}

// GlassCard - Slightly adjusted padding for mobile
function GlassCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-6 lg:p-8">
      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-6">
        {title}
      </h3>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

// EditableRow - Mobile-friendly stacking
function EditableRow({
  label,
  value,
  field,
  editing,
  setEditing,
  tempValue,
  setTempValue,
  saveField,
  isSaving,
  placeholder,
}: any) {
  const isEditing = editing === field;

  return (
    <div className="group">
      <span className="text-sm font-medium text-gray-600 block mb-2">
        {label}
      </span>
      {!isEditing ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-base lg:text-lg text-gray-900">
            {value || <span className="text-gray-400 italic">Not set</span>}
          </p>
          <button
            onClick={() => {
              setEditing(field);
              setTempValue(value || "");
            }}
            className="opacity-0 group-hover:opacity-100 sm:opacity-100 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition self-start sm:self-center"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => saveField(field)}
              disabled={isSaving}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setTempValue("");
              }}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// EditableArea - Same improvements
function EditableArea({
  label,
  value,
  field,
  editing,
  setEditing,
  tempValue,
  setTempValue,
  saveField,
  isSaving,
}: any) {
  const isEditing = editing === field;

  return (
    <div className="group">
      <span className="text-sm font-medium text-gray-600 block mb-2">
        {label}
      </span>
      {!isEditing ? (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <p className="text-gray-900 whitespace-pre-wrap">
            {value || (
              <span className="text-gray-400 italic">
                Tell us about yourself...
              </span>
            )}
          </p>
          <button
            onClick={() => {
              setEditing(field);
              setTempValue(value || "");
            }}
            className="opacity-0 group-hover:opacity-100 sm:opacity-100 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition self-start"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <textarea
            rows={6}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-base"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => saveField(field)}
              disabled={isSaving}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setTempValue("");
              }}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
