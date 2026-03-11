"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(new Event("auth-change"));

      router.replace("/login");
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-600">
        <Loader2 className="animate-spin" />
        Logging you out...
      </div>
    </div>
  );
}
