"use client";
import { useParams } from "next/navigation";

const stepLabels: Record<string, string> = {
  "jd-email": "Receive JD Email From Client",
  "jd-parse": "Parse JD From Email and Generate JobID",
  "jd-missing-fields": "Send email to client for missing fields against the JobId",
  "jd-enrich": "Enrich JD using Gemini API",
  "jd-pdf-drive": "Generate PDF and save to Google Drive",
  "jd-sheet": "Update Google Sheet with JD details",
  "resume-fetch": "Fetch resumes from Google Drive",
  "resume-parse": "Parse resumes using PyMuPDF",
  "embeddings": "Create embeddings and store in Pinecone",
  "candidate-retrieve": "Retrieve top 30 candidates by similarity",
  "match-score": "Match score & Score > 80?",
  "candidate-sheet": "Add candidate to JD sheet row",
  "call": "Call top-matching candidate using Vapi + Twilio",
  "ai-call": "AI Phone call using configured prompt variables",
  "call-feedback": "Structured call feedback using webhook",
  "results-store": "Store results in Google Sheet and Drive",
  "followup": "Trigger follow-up steps (e.g., email HR)",
};

export default function AgencyWorkflowStepPage() {
  const params = useParams();
  const step = typeof params.step === "string" ? params.step : Array.isArray(params.step) ? params.step[0] : "";
  const label = stepLabels[step] || "Unknown Step";

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">{label}</h1>
      <div className="rounded border p-6 bg-background">
        <p className="text-sm text-muted-foreground">This is a mock UI for the step: <span className="font-semibold">{label}</span>. Integrate your backend logic here.</p>
      </div>
    </div>
  );
} 