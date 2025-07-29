"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, FileText, User, BookOpen, Briefcase, Star } from "lucide-react";

const mockResume = {
  name: "Candidate John",
  email: "candidate@example.com",
  phone: "555-999-0000",
  summary: "Motivated web developer with a passion for building user-friendly applications.",
  education: [
    { degree: "Associate Degree in Web Dev", institution: "Community College", year: 2023 }
  ],
  experience: [
    { title: "Junior Web Developer", company: "Startup Co.", years: 1, description: "Developed front-end components for various web projects." }
  ],
  skills: ["JavaScript", "HTML", "CSS", "Web Development"]
};

const templates = [
  {
    id: 1,
    name: "Classic",
    render: (data: any) => (
      <div className="bg-white rounded-lg shadow p-6 text-gray-900 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">{data.name}</h1>
        <div className="text-sm text-gray-500 mb-4">{data.email} | {data.phone}</div>
        <div className="mb-4"><span className="font-semibold">Summary:</span> {data.summary}</div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Education</div>
          <ul className="list-disc list-inside">
            {data.education.map((e: any, i: number) => (
              <li key={i}>{e.degree}, {e.institution} ({e.year})</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Experience</div>
          <ul className="list-disc list-inside">
            {data.experience.map((e: any, i: number) => (
              <li key={i}>{e.title} at {e.company} ({e.years} yr): {e.description}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-1">Skills</div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s: string, i: number) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{s}</span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    name: "Modern",
    render: (data: any) => (
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-lg p-8 text-gray-900 w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <User className="h-10 w-10 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <div className="text-xs text-gray-500">{data.email} | {data.phone}</div>
          </div>
        </div>
        <div className="mb-4 italic text-blue-800">{data.summary}</div>
        <div className="mb-4">
          <BookOpen className="inline h-4 w-4 mr-1 text-blue-400" />
          <span className="font-semibold">Education:</span>
          <ul className="list-disc list-inside ml-6">
            {data.education.map((e: any, i: number) => (
              <li key={i}>{e.degree}, {e.institution} ({e.year})</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <Briefcase className="inline h-4 w-4 mr-1 text-blue-400" />
          <span className="font-semibold">Experience:</span>
          <ul className="list-disc list-inside ml-6">
            {data.experience.map((e: any, i: number) => (
              <li key={i}>{e.title} at {e.company} ({e.years} yr): {e.description}</li>
            ))}
          </ul>
        </div>
        <div>
          <Star className="inline h-4 w-4 mr-1 text-blue-400" />
          <span className="font-semibold">Skills:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.skills.map((s: string, i: number) => (
              <span key={i} className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs">{s}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }
];

export default function ResumeBuilderPage() {
  const [form, setForm] = useState(mockResume);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  // For now, Generate with AI just fills with mock data
  const handleGenerateAI = () => setForm(mockResume);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-10 px-2 flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <Sparkles className="h-10 w-10 text-blue-500 animate-pulse mb-2" />
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-1">AI Resume Builder</h1>
        <p className="text-blue-700 text-sm">Create a beautiful resume and preview templates instantly.</p>
      </div>
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="bg-white/80 shadow-xl">
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="font-semibold">Full Name</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="font-semibold">Email</label>
                <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="flex-1">
                <label className="font-semibold">Phone</label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="font-semibold">Summary</label>
              <Textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} />
            </div>
            <div>
              <label className="font-semibold">Education</label>
              {form.education.map((e, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input className="flex-1" placeholder="Degree" value={e.degree} onChange={ev => {
                    const ed = [...form.education]; ed[i].degree = ev.target.value; setForm(f => ({ ...f, education: ed }));
                  }} />
                  <Input className="flex-1" placeholder="Institution" value={e.institution} onChange={ev => {
                    const ed = [...form.education]; ed[i].institution = ev.target.value; setForm(f => ({ ...f, education: ed }));
                  }} />
                  <Input className="w-20" placeholder="Year" value={e.year} onChange={ev => {
                    const ed = [...form.education]; ed[i].year = ev.target.value; setForm(f => ({ ...f, education: ed }));
                  }} />
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setForm(f => ({ ...f, education: [...f.education, { degree: "", institution: "", year: "" }] }))}>Add</Button>
            </div>
            <div>
              <label className="font-semibold">Experience</label>
              {form.experience.map((e, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input className="flex-1" placeholder="Title" value={e.title} onChange={ev => {
                    const ex = [...form.experience]; ex[i].title = ev.target.value; setForm(f => ({ ...f, experience: ex }));
                  }} />
                  <Input className="flex-1" placeholder="Company" value={e.company} onChange={ev => {
                    const ex = [...form.experience]; ex[i].company = ev.target.value; setForm(f => ({ ...f, experience: ex }));
                  }} />
                  <Input className="w-16" placeholder="Years" value={e.years} onChange={ev => {
                    const ex = [...form.experience]; ex[i].years = ev.target.value; setForm(f => ({ ...f, experience: ex }));
                  }} />
                  <Input className="flex-1" placeholder="Description" value={e.description} onChange={ev => {
                    const ex = [...form.experience]; ex[i].description = ev.target.value; setForm(f => ({ ...f, experience: ex }));
                  }} />
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setForm(f => ({ ...f, experience: [...f.experience, { title: "", company: "", years: "", description: "" }] }))}>Add</Button>
            </div>
            <div>
              <label className="font-semibold">Skills (comma separated)</label>
              <Input value={form.skills.join(", ")} onChange={e => setForm(f => ({ ...f, skills: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="button" variant="default" onClick={handleGenerateAI} className="flex-1 gap-2"><Sparkles className="h-4 w-4" /> Generate with AI</Button>
              <Button type="button" variant="outline" className="flex-1 gap-2"><FileText className="h-4 w-4" /> Download PDF</Button>
            </div>
          </CardContent>
        </Card>
        {/* Preview & Template Selection */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 mb-2">
            {templates.map(t => (
              <Button key={t.id} variant={selectedTemplate.id === t.id ? "default" : "outline"} onClick={() => setSelectedTemplate(t)}>{t.name}</Button>
            ))}
          </div>
          <div className="overflow-auto max-h-[700px]">
            {selectedTemplate.render(form)}
          </div>
        </div>
      </div>
    </div>
  );
} 