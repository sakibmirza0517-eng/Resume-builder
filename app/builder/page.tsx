"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, Save, Download, Sparkles, Loader2 } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface ResumeData {
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: Education[];
  experience: Experience[];
  skills: string[];
}

// Wrapper component with Suspense
export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}

// Actual content component
function BuilderContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const [resumeData, setResumeData] = useState<ResumeData>({
    title: "Untitled Resume",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: [],
  });

  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [skillsText, setSkillsText] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (resumeId && user) {
      fetchResume();
    }
  }, [resumeId, user]);

  const fetchResume = async () => {
    if (!resumeId) {
      console.log("No resume ID - creating new resume");
      return;
    }

    try {
      const response = await fetch(`/api/resume/${resumeId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Failed to fetch resume:", errorData);

        if (response.status === 404) {
          console.log("Resume not found, starting fresh");
          return;
        }

        return;
      }

      const data = await response.json();

      setResumeData({
        title: data.title || "Untitled Resume",
        personalInfo: {
          fullName: data.personalInfo?.fullName || "",
          email: data.personalInfo?.email || "",
          phone: data.personalInfo?.phone || "",
          location: data.personalInfo?.location || "",
          summary: data.personalInfo?.summary || "",
        },
        education: data.education || [],
        experience: data.experience || [],
        skills: data.skills || [],
      });
      
      // FIX: Skills text ko yahan set karo
      setSkillsText(data.skills?.join(", ") || "");
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const method = resumeId ? "PUT" : "POST";
      const url = resumeId ? `/api/resume/${resumeId}` : "/api/resume";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      alert("✅ Resume saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ULTIMATE AI ENHANCER
  const enhanceWithAI = async () => {
    setAiLoading(true);
    try {
      const aiPrompt = `You are an elite Resume Writer, Career Coach, and ATS (Applicant Tracking System) Expert with 20+ years of experience. You have helped candidates get hired at FAANG and top-tier global companies.

YOUR TASK: Analyze the provided resume data. If fields are empty, GENERATE highly professional content from scratch based on the context. If fields are filled, ENHANCE them to be world-class.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

ENHANCEMENT & GENERATION GUIDELINES:

1. RESUME TITLE:
   - If the title is "Untitled Resume" or generic, generate a professional title based on the user's role (e.g., "Professional Software Engineer Resume", "Experienced Data Scientist CV").

2. PROFESSIONAL SUMMARY (Generate if empty, Enhance if filled):
   - Write 3-4 powerful lines.
   - Start with a strong professional title.
   - Highlight core competencies, years of experience (or current status if a student), and career value proposition.
   - Use power words: "Proven track record," "Expertise in," "Specialized in."

3. EXPERIENCE DESCRIPTIONS (Generate if empty, Enhance if filled):
   - For each position, write 3-4 impactful bullet points.
   - Start EVERY point with a POWERFUL ACTION VERB:
     * Leadership: Led, Spearheaded, Directed, Orchestrated, Mentored
     * Technical: Developed, Engineered, Architected, Implemented, Automated, Optimized
     * Impact: Increased, Reduced, Improved, Enhanced, Accelerated, Streamlined
   - Use the STAR method (Situation → Task → Action → Result).
   - Add QUANTIFIABLE METRICS (e.g., "Increased performance by 40%", "Reduced loading time by 2.5s").
   - Include top technical keywords naturally.

4. SKILLS ENHANCEMENT (CRITICAL):
   - Analyze the user's role, experience, and education.
   - Keep ALL the user's original skills.
   - ADD missing, highly relevant industry-standard technical and soft skills for their specific role.
   - Ensure the skills include top ATS keywords that recruiters search for.
   - Format skills professionally (e.g., use "React.js" instead of "react").
   - Return skills as a FLAT ARRAY OF STRINGS only.

CRITICAL RULES (DO NOT BREAK):
- DO NOT change: fullName, email, phone, location (keep exactly as is).
- DO NOT change: education degree names, institution names, years.
- DO NOT change: experience company names, position titles, duration.
- ONLY generate/enhance: title, summary, experience descriptions, and SKILLS.
- Maintain the exact same JSON structure.
- Return ONLY valid JSON. No markdown, no explanations, no code blocks.

RESPONSE FORMAT (MUST follow exactly):
{
  "title": "Generated Professional Title",
  "personalInfo": {
    "fullName": "EXACT SAME AS INPUT",
    "email": "EXACT SAME AS INPUT",
    "phone": "EXACT SAME AS INPUT",
    "location": "EXACT SAME AS INPUT",
    "summary": "Your enhanced or generated 3-4 line professional summary here"
  },
  "education": [
    {
      "id": "same-id",
      "degree": "SAME",
      "institution": "SAME",
      "year": "SAME"
    }
  ],
  "experience": [
    {
      "id": "same-id",
      "company": "SAME",
      "position": "SAME",
      "duration": "SAME",
      "description": "• Led development of...\n• Implemented...\n• Achieved 40% improvement..."
    }
  ],
  "skills": ["User's original skill", "AI added relevant skill 1", "AI added relevant skill 2"]
}`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "AI service error");
      }

      const data = await response.json();

      if (data.result) {
        try {
          let cleanJson = data.result;

          if (cleanJson.includes("```json")) {
            cleanJson = cleanJson.replace(/```json\n?/g, "").replace(/```\n?/g, "");
          }
          if (cleanJson.includes("```")) {
            cleanJson = cleanJson.replace(/```\n?/g, "");
          }

          const enhancedData = JSON.parse(cleanJson);

          const newSkills = enhancedData.skills || resumeData.skills;
          
          setResumeData({
            title: enhancedData.title || resumeData.title,
            personalInfo: {
              fullName: enhancedData.personalInfo?.fullName || resumeData.personalInfo.fullName,
              email: enhancedData.personalInfo?.email || resumeData.personalInfo.email,
              phone: enhancedData.personalInfo?.phone || resumeData.personalInfo.phone,
              location: enhancedData.personalInfo?.location || resumeData.personalInfo.location,
              summary: enhancedData.personalInfo?.summary || resumeData.personalInfo.summary,
            },
            education: resumeData.education.map((edu, index) => ({
              ...edu,
              degree: enhancedData.education?.[index]?.degree || edu.degree,
              institution: enhancedData.education?.[index]?.institution || edu.institution,
              year: enhancedData.education?.[index]?.year || edu.year,
            })),
            experience: resumeData.experience.map((exp, index) => ({
              ...exp,
              company: enhancedData.experience?.[index]?.company || exp.company,
              position: enhancedData.experience?.[index]?.position || exp.position,
              duration: enhancedData.experience?.[index]?.duration || exp.duration,
              description: enhancedData.experience?.[index]?.description || exp.description,
            })),
            skills: newSkills,
          });
          
          // FIX: AI enhance ke baad bhi skillsText update karo
          setSkillsText(newSkills.join(", "));

          alert("✨ Resume enhanced successfully! AI has optimized your content, added skills, and generated a professional title.");
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          console.error("AI Response was:", data.result);
          alert("⚠️ AI response format issue. Please try again.");
        }
      } else {
        alert("❌ Failed to enhance resume. Please try again.");
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      alert(`AI Error: ${error.message || "Service unavailable"}`);
    } finally {
      setAiLoading(false);
    }
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { id: Date.now().toString(), degree: "", institution: "", year: "" },
      ],
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { id: Date.now().toString(), company: "", position: "", duration: "", description: "" },
      ],
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  // FIX: Updated updateSkills function
  const updateSkills = (value: string) => {
    setSkillsText(value); // Textarea ko turant update karega
    setResumeData({
      ...resumeData,
      skills: value.split(",").map((s) => s.trim()).filter((s) => s),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8 px-4">
      <div className="max-w-7xl mx-auto mb-8 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <input
            type="text"
            value={resumeData.title}
            onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
            className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1 w-full md:w-auto"
            placeholder="Resume Title"
          />
          <div className="flex gap-3">
            <button
              onClick={saveResume}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:bg-gray-400 shadow-lg"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 no-print">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl shadow-lg border-2 border-white/20">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">✨ AI Resume Enhancer</h3>
                <p className="text-white/90 text-sm mb-4">
                  Fill your details first, then click "Enhance with AI" to make your resume professional and ATS-friendly!
                </p>
                <button
                  onClick={enhanceWithAI}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-md disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={resumeData.personalInfo?.fullName || ""}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={resumeData.personalInfo?.email || ""}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={resumeData.personalInfo?.phone || ""}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={resumeData.personalInfo?.location || ""}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Professional Summary (AI will enhance this)"
                value={resumeData.personalInfo?.summary || ""}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, summary: e.target.value },
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {resumeData.education?.map((edu) => (
                <div key={edu.id} className="border border-gray-200 p-4 rounded-lg relative">
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {resumeData.experience?.map((exp) => (
                <div key={exp.id} className="border border-gray-200 p-4 rounded-lg relative">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                  />
                  <textarea
                    placeholder="Description (AI will enhance this)"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FIX: Skills section with skillsText state */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Skills</h3>
            <textarea
              placeholder="Type skills separated by commas (e.g., React, Node.js, Python)"
              value={skillsText}
              onChange={(e) => updateSkills(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">💡 Tip: Har skill ke baad comma (,) zaroor lagayein.</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white shadow-2xl border border-gray-300 rounded-lg p-10 resume-preview" style={{ minHeight: '1100px' }}>
            <div className="border-b-4 border-blue-600 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {resumeData.personalInfo?.fullName || "Your Name"}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {resumeData.personalInfo?.email && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {resumeData.personalInfo.email}
                  </span>
                )}
                {resumeData.personalInfo?.phone && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {resumeData.personalInfo.phone}
                  </span>
                )}
                {resumeData.personalInfo?.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {resumeData.personalInfo.location}
                  </span>
                )}
              </div>
            </div>

            {resumeData.personalInfo?.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
              </div>
            )}

            {resumeData.education?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-2">Education</h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                          <p className="text-gray-700 font-medium">{edu.institution}</p>
                        </div>
                        <span className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.experience?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-2">Experience</h2>
                <div className="space-y-5">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                          <p className="text-gray-700 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-gray-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-sm">{exp.duration}</span>
                      </div>
                      {exp.description && <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.skills && resumeData.skills.length > 0 && resumeData.skills.some(s => s && s.trim() !== "") && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills
                    .filter(skill => skill && skill.trim() !== "")
                    .map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}