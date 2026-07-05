"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function NavActions() {
  const { logOut, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-4">
      {user && (
        <>
          <button 
            onClick={() => router.push("/")} 
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => router.push("/dashboard")} 
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Dashboard
          </button>
        </>
      )}
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}