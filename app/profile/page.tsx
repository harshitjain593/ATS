"use client";

import { useUser } from "@/context/user-context";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, User, BookOpen, Star } from "lucide-react";
import { useSelector} from "react-redux"
import { RootState } from "@/redux/store"

export default function ProfilePage() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  // Candidate fields
  const [candidate, setCandidate] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
    linkedin: "",
    portfolio: ""
  });

  // Recruiter fields
  const [recruiter, setRecruiter] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    company: "",
    department: "",
    linkedin: ""
  });

  const handleSave = () => {
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!currentUser) {
    return <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background"><p className="text-muted-foreground">Loading profile...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-200 py-10 px-2">
      <Card className="w-full max-w-2xl shadow-xl bg-white/90">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <User className="h-10 w-10 text-blue-500" />
            <h1 className="text-2xl font-bold text-blue-900">Profile</h1>
          </div>
          {currentUser.role === "candidate" ? (
            <form className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-semibold">Full Name</label>
                  <Input disabled={!editMode} value={candidate.name} onChange={e => setCandidate(c => ({ ...c, name: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">Email</label>
                  <Input disabled value={candidate.email} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-semibold">Phone</label>
                  <Input disabled={!editMode} value={candidate.phone} onChange={e => setCandidate(c => ({ ...c, phone: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">LinkedIn</label>
                  <Input disabled={!editMode} value={candidate.linkedin} onChange={e => setCandidate(c => ({ ...c, linkedin: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="font-semibold">Portfolio</label>
                <Input disabled={!editMode} value={candidate.portfolio} onChange={e => setCandidate(c => ({ ...c, portfolio: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold">Skills (comma separated)</label>
                <Input disabled={!editMode} value={candidate.skills} onChange={e => setCandidate(c => ({ ...c, skills: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold">Experience</label>
                <Textarea disabled={!editMode} value={candidate.experience} onChange={e => setCandidate(c => ({ ...c, experience: e.target.value }))} rows={2} />
              </div>
              <div>
                <label className="font-semibold">Education</label>
                <Textarea disabled={!editMode} value={candidate.education} onChange={e => setCandidate(c => ({ ...c, education: e.target.value }))} rows={2} />
              </div>
              <div className="flex gap-2 mt-6">
                {!editMode ? (
                  <Button type="button" variant="default" onClick={() => setEditMode(true)}>Edit</Button>
                ) : (
                  <Button type="button" variant="success" onClick={handleSave}>Save</Button>
                )}
                {saved && <span className="text-green-600 font-semibold ml-2">Saved!</span>}
              </div>
            </form>
          ) : (
            <form className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-semibold">Full Name</label>
                  <Input disabled={!editMode} value={recruiter.name} onChange={e => setRecruiter(r => ({ ...r, name: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">Email</label>
                  <Input disabled value={recruiter.email} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-semibold">Phone</label>
                  <Input disabled={!editMode} value={recruiter.phone} onChange={e => setRecruiter(r => ({ ...r, phone: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="font-semibold">LinkedIn</label>
                  <Input disabled={!editMode} value={recruiter.linkedin} onChange={e => setRecruiter(r => ({ ...r, linkedin: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="font-semibold">Company</label>
                <Input disabled={!editMode} value={recruiter.company} onChange={e => setRecruiter(r => ({ ...r, company: e.target.value }))} />
              </div>
              <div>
                <label className="font-semibold">Department/Role</label>
                <Input disabled={!editMode} value={recruiter.department} onChange={e => setRecruiter(r => ({ ...r, department: e.target.value }))} />
              </div>
              <div className="flex gap-2 mt-6">
                {!editMode ? (
                  <Button type="button" variant="default" onClick={() => setEditMode(true)}>Edit</Button>
                ) : (
                  <Button type="button" variant="success" onClick={handleSave}>Save</Button>
                )}
                {saved && <span className="text-green-600 font-semibold ml-2">Saved!</span>}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 