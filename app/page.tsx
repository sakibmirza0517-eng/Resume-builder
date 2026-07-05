import Link from "next/link";
import { Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20 text-center">
        
        {/* Badge */}
        <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-bold mb-4 md:mb-6 border border-blue-100">
          ✨ Resume Builder
        </div>

        {/* Main Heading - Mobile pe chhota, Desktop pe bada */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
          Build your resume in <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            seconds, not hours.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 md:mb-10 max-w-2xl mx-auto px-2">
          Stop staring at a blank page. Let our AI write your professional summary, skills, and experience while you focus on the design.
        </p>

        {/* CTA Button */}
        <Link href="/login" className="inline-block px-6 py-3 md:px-8 md:py-4 bg-gray-900 text-white rounded-full text-base md:text-lg font-bold hover:bg-gray-800 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-200">
          Build My Resume Now →
        </Link>

        {/* Features Grid - Mobile pe 1 column, Desktop pe 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24 text-left px-2 sm:px-0">
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-2">AI-Powered Writing</h3>
            <p className="text-gray-500 text-sm md:text-base">Just tell us your role, and watch the AI craft the perfect professional summary.</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Live Preview</h3>
            <p className="text-gray-500 text-sm md:text-base">See changes instantly as you type. What you see is exactly what you get in PDF.</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Shield className="w-8 h-8 md:w-10 md:h-10 text-green-600 mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-500 text-sm md:text-base">Your data is encrypted and stored securely. Only you can access your resumes.</p>
          </div>
        </div>
      </main>
    </div>
  );
}