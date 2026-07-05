"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X, Home, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function NavActions() {
  const { logOut, user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
    setIsOpen(false); // Menu band kar do logout ke baad
  };

  const handleNav = (path: string) => {
    router.push(path);
    setIsOpen(false); // Menu band kar do navigation ke baad (Better UX)
  };

  return (
    <div className="relative">
      {/* Desktop Menu (md aur usse badi screens ke liye) */}
      <div className="hidden md:flex items-center gap-4">
        {user && (
          <>
            <button 
              onClick={() => handleNav("/")} 
              className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={() => handleNav("/dashboard")} 
              className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
          </>
        )}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Mobile Hamburger Button (sirf mobile pe dikhega) */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none rounded-lg hover:bg-gray-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {user && (
            <>
              <button 
                onClick={() => handleNav("/")} 
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
              >
                <Home className="w-5 h-5" /> Home
              </button>
              <button 
                onClick={() => handleNav("/dashboard")} 
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
              <div className="my-1 border-t border-gray-100"></div>
            </>
          )}
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}