"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, Save, Download, Sparkles, Loader2, Github, Linkedin, Globe } from "lucide-react";

interface SocialLinks {
  linkedin: string;
  github: string;
  portfolio: string;
}

interface Project {
  id: string;
  name: string;
  techStack: string;
  description: string;
  link: string;
}

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
  socialLinks: SocialLinks;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

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

function BuilderContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const [resumeData, setResumeData] = useState<ResumeData>({
    title: "Untitled Resume",
    personalInfo: { fullName: "", email: "", phone: "", location: "", summary: "" },
    socialLinks: { linkedin: "", github: "", portfolio: "" },
    education: [],
    experience: [],
    projects: [],
    skills: [],
  });

  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [skillsText, setSkillsText] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (resumeId && user) fetchResume();
  }, [resumeId, user]);

  const fetchResume = async () => {
    if (!resumeId) return;
    try {
      const response = await fetch(`/api/resume/${resumeId}`);
      if (!response.ok) return;
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
        socialLinks: {
          linkedin: data.socialLinks?.linkedin || "",
          github: data.socialLinks?.github || "",
          portfolio: data.socialLinks?.portfolio || "",
        },
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        skills: data.skills || [],
      });
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
      if (!response.ok) throw new Error("Save failed");
      alert("✅ Resume saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to save resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const enhanceWithAI = async () => {
    setAiLoading(true);
    try {
      const aiPrompt = `You are an elite Resume Writer and ATS Expert for IT Freshers.
YOUR TASK: Analyze the provided resume data. Generate or enhance content for a fresher applying for IT/Software roles.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

GUIDELINES:
1. SUMMARY: Write 3-4 powerful lines highlighting technical skills and career goals.
2. PROJECTS: Enhance descriptions using STAR method. Add technical keywords. If empty, generate realistic academic/personal projects for a CS student.
3. EXPERIENCE: Enhance descriptions with action verbs and metrics.
4. SKILLS: Keep original skills, add missing IT industry keywords (e.g., React, Node.js, Git). Return as a FLAT ARRAY OF STRINGS.

CRITICAL RULES:
- DO NOT change: fullName, email, phone, location, socialLinks.
- DO NOT change: education degree, institution, year.
- Return ONLY valid JSON. No markdown.

RESPONSE FORMAT:
{
  "title": "Professional IT Fresher Resume",
  "personalInfo": { "fullName": "SAME", "email": "SAME", "phone": "SAME", "location": "SAME", "summary": "..." },
  "socialLinks": { "linkedin": "SAME", "github": "SAME", "portfolio": "SAME" },
  "education": [ { "id": "SAME", "degree": "SAME", "institution": "SAME", "year": "SAME" } ],
  "experience": [ { "id": "SAME", "company": "SAME", "position": "SAME", "duration": "SAME", "description": "..." } ],
  "projects": [ { "id": "SAME", "name": "SAME", "techStack": "SAME", "description": "Enhanced description...", "link": "SAME" } ],
  "skills": ["Skill 1", "Skill 2"]
}`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) throw new Error("AI service error");
      const data = await response.json();
      
      if (data.result) {
        let cleanJson = data.result.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        const enhancedData = JSON.parse(cleanJson);
        
        const newSkills = enhancedData.skills || resumeData.skills;
        
        setResumeData({
          title: enhancedData.title || resumeData.title,
          personalInfo: { ...resumeData.personalInfo, ...enhancedData.personalInfo },
          socialLinks: enhancedData.socialLinks || resumeData.socialLinks,
          education: resumeData.education.map((edu, i) => ({ ...edu, ...enhancedData.education?.[i] })),
          experience: resumeData.experience.map((exp, i) => ({ ...exp, ...enhancedData.experience?.[i] })),
          projects: resumeData.projects.map((proj, i) => ({ ...proj, ...enhancedData.projects?.[i] })),
          skills: newSkills,
        });
        setSkillsText(newSkills.join(", "));
        alert("✨ Resume enhanced successfully!");
      }
    } catch (error: any) {
      alert(`AI Error: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const addProject = () => {
    setResumeData({ ...resumeData, projects: [...resumeData.projects, { id: Date.now().toString(), name: "", techStack: "", description: "", link: "" }] });
  };
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setResumeData({ ...resumeData, projects: resumeData.projects.map(p => p.id === id ? { ...p, [field]: value } : p) });
  };
  const removeProject = (id: string) => {
    setResumeData({ ...resumeData, projects: resumeData.projects.filter(p => p.id !== id) });
  };

  const addEducation = () => {
    setResumeData({ ...resumeData, education: [...resumeData.education, { id: Date.now().toString(), degree: "", institution: "", year: "" }] });
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({ ...resumeData, education: resumeData.education.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };
  const removeEducation = (id: string) => {
    setResumeData({ ...resumeData, education: resumeData.education.filter(e => e.id !== id) });
  };

  const addExperience = () => {
    setResumeData({ ...resumeData, experience: [...resumeData.experience, { id: Date.now().toString(), company: "", position: "", duration: "", description: "" }] });
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData({ ...resumeData, experience: resumeData.experience.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };
  const removeExperience = (id: string) => {
    setResumeData({ ...resumeData, experience: resumeData.experience.filter(e => e.id !== id) });
  };

  const updateSkills = (value: string) => {
    setSkillsText(value);
    setResumeData({ ...resumeData, skills: value.split(",").map(s => s.trim()).filter(s => s) });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8 px-4">
      <div className="max-w-7xl mx-auto mb-8 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <input type="text" value={resumeData.title} onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })} className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1 w-full md:w-auto" placeholder="Resume Title" />
          <div className="flex gap-3">
            <button onClick={saveResume} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:bg-gray-400 shadow-lg"><Save className="w-5 h-5" />{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors shadow-lg"><Download className="w-5 h-5" />Download PDF</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 no-print">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl shadow-lg border-2 border-white/20">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg"><Sparkles className="w-8 h-8 text-white" /></div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">✨ AI Resume Enhancer</h3>
                <p className="text-white/90 text-sm mb-4">Enhance your projects, summary, and skills for IT roles!</p>
                <button onClick={enhanceWithAI} disabled={aiLoading} className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-md disabled:opacity-50">
                  {aiLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Enhancing...</> : <><Sparkles className="w-5 h-5" />Enhance with AI</>}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" value={resumeData.personalInfo?.fullName || ""} onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, fullName: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Email" value={resumeData.personalInfo?.email || ""} onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="tel" placeholder="Phone" value={resumeData.personalInfo?.phone || ""} onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Location" value={resumeData.personalInfo?.location || ""} onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, location: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Social Links (IT Profile)</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <input type="text" placeholder="LinkedIn URL" value={resumeData.socialLinks?.linkedin || ""} onChange={(e) => setResumeData({ ...resumeData, socialLinks: { ...resumeData.socialLinks, linkedin: e.target.value } })} className="w-full outline-none bg-transparent" />
              </div>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Github className="w-5 h-5 text-gray-800" />
                <input type="text" placeholder="GitHub URL" value={resumeData.socialLinks?.github || ""} onChange={(e) => setResumeData({ ...resumeData, socialLinks: { ...resumeData.socialLinks, github: e.target.value } })} className="w-full outline-none bg-transparent" />
              </div>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Globe className="w-5 h-5 text-green-600" />
                <input type="text" placeholder="Portfolio/Website URL" value={resumeData.socialLinks?.portfolio || ""} onChange={(e) => setResumeData({ ...resumeData, socialLinks: { ...resumeData.socialLinks, portfolio: e.target.value } })} className="w-full outline-none bg-transparent" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button onClick={addEducation} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus className="w-4 h-4" /> Add</button>
            </div>
            <div className="space-y-3">
              {resumeData.education?.map((edu) => (
                <div key={edu.id} className="border border-gray-200 p-4 rounded-lg relative">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Projects (Crucial for Freshers)</h3>
              <button onClick={addProject} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus className="w-4 h-4" /> Add</button>
            </div>
            <div className="space-y-3">
              {resumeData.projects?.map((proj) => (
                <div key={proj.id} className="border border-gray-200 p-4 rounded-lg relative">
                  <button onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <input type="text" placeholder="Tech Stack (e.g., React, Node.js)" value={proj.techStack} onChange={(e) => updateProject(proj.id, "techStack", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <textarea placeholder="Description & Contributions" value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <input type="text" placeholder="Live Link / GitHub Repo URL" value={proj.link} onChange={(e) => updateProject(proj.id, "link", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Experience / Internships</h3>
              <button onClick={addExperience} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus className="w-4 h-4" /> Add</button>
            </div>
            <div className="space-y-3">
              {resumeData.experience?.map((exp) => (
                <div key={exp.id} className="border border-gray-200 p-4 rounded-lg relative">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <input type="text" placeholder="Position" value={exp.position} onChange={(e) => updateExperience(exp.id, "position", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <input type="text" placeholder="Duration" value={exp.duration} onChange={(e) => updateExperience(exp.id, "duration", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2" />
                  <textarea placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Skills</h3>
            <textarea placeholder="Type skills separated by commas (e.g., React, Node.js, Python)" value={skillsText} onChange={(e) => updateSkills(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 mt-2">💡 Tip: Har skill ke baad comma (,) zaroor lagayein.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Professional Summary</h3>
            <textarea placeholder="Professional Summary (AI will enhance this)" value={resumeData.personalInfo?.summary || ""} onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, summary: e.target.value } })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white shadow-2xl border border-gray-300 rounded-lg p-10 resume-preview" style={{ minHeight: '1100px' }}>
            <div className="border-b-4 border-blue-600 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{resumeData.personalInfo?.fullName || "Your Name"}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                {resumeData.personalInfo?.email && <span className="flex items-center gap-1">📧 {resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo?.phone && <span className="flex items-center gap-1">📱 {resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo?.location && <span className="flex items-center gap-1">📍 {resumeData.personalInfo.location}</span>}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-blue-700 font-medium">
                {resumeData.socialLinks?.linkedin && <a href={resumeData.socialLinks.linkedin} target="_blank" className="flex items-center gap-1 hover:underline"><Linkedin className="w-4 h-4" /> LinkedIn</a>}
                {resumeData.socialLinks?.github && <a href={resumeData.socialLinks.github} target="_blank" className="flex items-center gap-1 hover:underline"><Github className="w-4 h-4" /> GitHub</a>}
                {resumeData.socialLinks?.portfolio && <a href={resumeData.socialLinks.portfolio} target="_blank" className="flex items-center gap-1 hover:underline"><Globe className="w-4 h-4" /> Portfolio</a>}
              </div>
            </div>

            {resumeData.personalInfo?.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
              </div>
            )}

            {resumeData.projects?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-1">Projects</h2>
                <div className="space-y-4">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{proj.name}</h3>
                        {proj.link && <a href={proj.link} target="_blank" className="text-blue-600 text-sm hover:underline flex items-center gap-1"><Globe className="w-3 h-3" /> View</a>}
                      </div>
                      <p className="text-blue-700 text-sm font-medium mb-1 italic">{proj.techStack}</p>
                      {proj.description && <p className="text-gray-700 leading-relaxed whitespace-pre-line">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.experience?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-1">Experience</h2>
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
                      {exp.description && <p className="text-gray-700 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.education?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-1">Education</h2>
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

            {resumeData.skills && resumeData.skills.length > 0 && resumeData.skills.some(s => s && s.trim() !== "") && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-1">Technical Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.filter(skill => skill && skill.trim() !== "").map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">{skill}</span>
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
