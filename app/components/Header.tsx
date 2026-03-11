"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, UserCircle } from "lucide-react"; // npm install lucide-react

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const syncUser = () => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  };

  useEffect(() => {
    syncUser();

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);

    window.dispatchEvent(new Event("auth-change"));

    router.push("/login");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-white tracking-tight hover:text-blue-400 transition-colors"
          >
            Job<span className="text-blue-500">Portal</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Jobs
            </Link>

            {!user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                {/* Role-based links */}
                {user.role === "user" && (
                  <>
                    <Link
                      href="/dashboard/user"
                      className="text-gray-300 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="text-gray-300 hover:text-white"
                    >
                      Profile
                    </Link>
                  </>
                )}
                {user.role === "recruiter" && (
                  <>
                    <Link
                      href="/dashboard/recruiter"
                      className="text-gray-300 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/recruiter/profile"
                      className="text-gray-300 hover:text-white"
                    >
                      Profile
                    </Link>
                  </>
                )}
                {user.role === "admin" && (
                  <Link
                    href="/dashboard/admin"
                    className="text-gray-300 hover:text-white font-semibold"
                  >
                    Admin
                  </Link>
                )}

                {/* User avatar + logout */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span className="text-gray-300 hidden lg:inline">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-400 transition flex items-center gap-1"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-md"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="text-2xl font-bold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Job<span className="text-blue-500">Portal</span>
              </Link>
              <button onClick={() => setMenuOpen(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <nav className="flex flex-col space-y-6">
              <Link
                href="/jobs"
                className="text-lg text-gray-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Jobs
              </Link>

              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="text-lg text-gray-300 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-lg bg-blue-600 text-white px-4 py-3 rounded-md text-center hover:bg-blue-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {user.role === "user" && (
                    <>
                      <Link
                        href="/dashboard/user"
                        className="text-gray-300 hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="text-gray-300 hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  {user.role === "recruiter" && (
                    <>
                      <Link
                        href="/dashboard/recruiter"
                        className="text-gray-300 hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/recruiter/profile"
                        className="text-gray-300 hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/dashboard/admin"
                      className="text-gray-300 hover:text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-white font-medium">{user.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 bg-red-600/20 text-red-400 py-3 rounded-md hover:bg-red-600/30 transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
