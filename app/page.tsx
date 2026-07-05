import Link from "next/link";
import { FileText, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <FileText className="w-8 h-8" />
          ResumeAI
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-gray-600 font-medium hover:text-blue-600">Login</Link>
          <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6 border border-blue-100">
          ✨ Powered by Gemini AI
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight mb-6">
          Build your resume in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            seconds, not hours.
          </span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Stop staring at a blank page. Let our AI write your professional summary, skills, and experience while you focus on the design.
        </p>
        <Link href="/login" className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-bold hover:bg-gray-800 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-200">
          Build My Resume Now →
        </Link>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Sparkles className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI-Powered Writing</h3>
            <p className="text-gray-500">Just tell us your role, and watch the AI craft the perfect professional summary.</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Zap className="w-10 h-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Live Preview</h3>
            <p className="text-gray-500">See changes instantly as you type. What you see is exactly what you get in PDF.</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Shield className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-500">Your data is encrypted and stored securely. Only you can access your resumes.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 text-center text-gray-400 mt-20">
        <p>© 2024 ResumeAI. Built for students, by students.</p>
      </footer>
    </div>
  );
}