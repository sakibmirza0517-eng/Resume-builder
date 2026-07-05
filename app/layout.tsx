import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";
import { FileText } from "lucide-react";
import NavActions from "@/components/NavActions"; // Naya component import kiya

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI - Build Professional Resumes",
  description: "AI-powered resume builder by Sakib",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <AuthProvider>
          {/* Navbar */}
          <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <FileText className="w-6 h-6 text-blue-600" />
                ResumeAI
              </Link>
              {/* Yahan NavActions use ho raha hai jo Logout handle karega */}
              <NavActions />
            </div>
          </nav>
          
          {/* Main Content */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400 text-sm">© 2025 Built by Sakib. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}