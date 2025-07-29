"use client";
import { useState } from "react";

const steps = [
  "JD Received",
  "JD Parsed",
  "Missing Fields Requested",
  "JD Enriched",
  "PDF Saved",
  "Sheet Updated",
  "Resumes Fetched",
  "Resumes Parsed",
  "Embeddings Created",
  "Top Candidates",
  "Scored",
  "Candidate Shortlisted",
  "Candidate Called",
  "Candidate Offered",
  "AI Call",
  "Call Feedback",
  "Results Stored",
  "Follow-up",
];

type CandidateStatus = "Shortlisted" | "Called" | "Offered";
type Candidate = {
  name: string;
  phone: string;
  matchScore: number;
  status: CandidateStatus;
  aiCallResult: string;
  callFeedback: string;
  offer: null | { salary: string; startDate: string };
};
type JD = {
  id: string;
  client: string;
  title: string;
  status: number;
  receivedAt: string;
  jdInitial: string;
  jdMissingFieldsRequest: string;
  jdEnriched: string;
  candidates: Candidate[];
};

const mockJDs: JD[] = [
  {
    id: "jd1",
    client: "Acme Corp",
    title: "Senior Backend Engineer",
    status: 13,
    receivedAt: "2024-07-01",
    jdInitial: "We need a Senior Backend Engineer with 5+ years experience in Node.js, PostgreSQL, and AWS. Location: Remote. Immediate joiners preferred.",
    jdMissingFieldsRequest: "Please provide details on salary range, benefits, and preferred timezone.",
    jdEnriched: "Senior Backend Engineer, 5+ years Node.js, PostgreSQL, AWS. Salary: $120k-$140k, Benefits: Health, Remote, Flexible hours. Timezone: US/EU. Immediate joiners preferred.",
    candidates: [
      {
        name: "Alice Johnson",
        phone: "555-111-2222",
        matchScore: 92,
        status: "Shortlisted",
        aiCallResult: "Strong communication, relevant experience, interested in the role.",
        callFeedback: "Candidate is a great fit. Willing to relocate.",
        offer: null
      },
      {
        name: "Bob Williams",
        phone: "555-333-4444",
        matchScore: 88,
        status: "Called",
        aiCallResult: "Good technical background, needs more info on benefits.",
        callFeedback: "Requested more details about remote work.",
        offer: null
      },
      {
        name: "Carol Smith",
        phone: "555-777-8888",
        matchScore: 95,
        status: "Offered",
        aiCallResult: "Excellent fit, accepted offer.",
        callFeedback: "Ready to join in 2 weeks.",
        offer: {
          salary: "$135,000",
          startDate: "2024-08-01"
        }
      }
    ]
  },
  {
    id: "jd2",
    client: "Globex Inc",
    title: "Product Manager",
    status: 10,
    receivedAt: "2024-07-02",
    jdInitial: "Looking for a Product Manager with SaaS experience. Must have strong leadership skills.",
    jdMissingFieldsRequest: "Please specify required years of experience and reporting manager.",
    jdEnriched: "Product Manager, SaaS, 4+ years, Reports to VP Product. Leadership, Agile, Remote possible.",
    candidates: [
      {
        name: "Charlie Brown",
        phone: "555-555-6666",
        matchScore: 85,
        status: "Shortlisted",
        aiCallResult: "Understands product lifecycle, strong leadership skills.",
        callFeedback: "Available for interview next week.",
        offer: null
      }
    ]
  },
  {
    id: "jd3",
    client: "Initech",
    title: "Data Scientist",
    status: 7,
    receivedAt: "2024-07-03",
    jdInitial: "Data Scientist needed for analytics team. Python, ML, SQL required.",
    jdMissingFieldsRequest: "Please provide project details and expected deliverables.",
    jdEnriched: "Data Scientist, Python, ML, SQL. Project: Predictive analytics for sales. Deliverables: Models, dashboards.",
    candidates: []
  },
  {
    id: "jd4",
    client: "Umbrella Co",
    title: "UX Designer",
    status: 1,
    receivedAt: "2024-07-04",
    jdInitial: "UX Designer for mobile app redesign.",
    jdMissingFieldsRequest: "Please share Figma link and design system details.",
    jdEnriched: "UX Designer, Mobile, Figma, Design System. Project: App redesign Q3.",
    candidates: []
  },
];

const stepPanels = (jd: JD) => [
  {
    label: "JD Received",
    content: <div><strong>Initial JD:</strong><br /><span className="text-sm">{jd.jdInitial}</span></div>
  },
  {
    label: "JD Parsed",
    content: <div><span className="text-sm">JD parsed and JobID generated: <span className="font-mono">JD-{jd.id.toUpperCase()}</span></span></div>
  },
  {
    label: "Missing Fields Requested",
    content: <div><strong>Requested from client:</strong><br /><span className="text-sm">{jd.jdMissingFieldsRequest}</span></div>
  },
  {
    label: "JD Enriched",
    content: <div><strong>Enriched JD:</strong><br /><span className="text-sm">{jd.jdEnriched}</span></div>
  },
  {
    label: "PDF Saved",
    content: <div><span className="text-sm">JD PDF generated and saved to Google Drive.</span></div>
  },
  {
    label: "Sheet Updated",
    content: <div><span className="text-sm">Google Sheet updated with JD details.</span></div>
  },
  {
    label: "Resumes Fetched",
    content: <div><span className="text-sm">Fetched 23 resumes from Google Drive.</span></div>
  },
  {
    label: "Resumes Parsed",
    content: <div><span className="text-sm">Resumes parsed using PyMuPDF.</span></div>
  },
  {
    label: "Embeddings Created",
    content: <div><span className="text-sm">Candidate embeddings created and stored in Pinecone.</span></div>
  },
  {
    label: "Top Candidates",
    content: <div><span className="text-sm">Top 30 candidates retrieved by similarity.</span></div>
  },
  {
    label: "Scored",
    content: <div><span className="text-sm">Candidates scored and filtered (Score &gt; 80%).</span></div>
  },
  {
    label: "Candidate Shortlisted",
    content: <div>{jd.candidates.filter((c: Candidate) => c.status === "Shortlisted").length > 0 ? (
      <ul className="list-disc list-inside text-sm">
        {jd.candidates.filter((c: Candidate) => c.status === "Shortlisted").map((c: Candidate, i: number) => (
          <li key={i}><span className="font-medium">{c.name}</span> (Match: {c.matchScore}%)</li>
        ))}
      </ul>
    ) : <span className="text-sm">No candidates shortlisted yet.</span>}</div>
  },
  {
    label: "Candidate Called",
    content: <div>{jd.candidates.filter((c: Candidate) => c.status === "Called").length > 0 ? (
      <ul className="list-disc list-inside text-sm">
        {jd.candidates.filter((c: Candidate) => c.status === "Called").map((c: Candidate, i: number) => (
          <li key={i}><span className="font-medium">{c.name}</span> (Match: {c.matchScore}%)</li>
        ))}
      </ul>
    ) : <span className="text-sm">No candidates called yet.</span>}</div>
  },
  {
    label: "Candidate Offered",
    content: <div>{jd.candidates.filter((c: Candidate) => c.status === "Offered").length > 0 ? (
      <ul className="list-disc list-inside text-sm">
        {jd.candidates.filter((c: Candidate) => c.status === "Offered").map((c: Candidate, i: number) => (
          <li key={i}><span className="font-medium">{c.name}</span> (Offer: {c.offer?.salary}, Start: {c.offer?.startDate})</li>
        ))}
      </ul>
    ) : <span className="text-sm">No offers made yet.</span>}</div>
  },
  {
    label: "AI Call",
    content: <div>{jd.candidates.length > 0 ? (
      <ul className="list-disc list-inside text-sm">
        {jd.candidates.map((c: Candidate, i: number) => (
          <li key={i}><span className="font-medium">{c.name}</span>: {c.aiCallResult}</li>
        ))}
      </ul>
    ) : <span className="text-sm">No AI calls yet.</span>}</div>
  },
  {
    label: "Call Feedback",
    content: <div>{jd.candidates.length > 0 ? (
      <ul className="list-disc list-inside text-sm">
        {jd.candidates.map((c: Candidate, i: number) => (
          <li key={i}><span className="font-medium">{c.name}</span>: {c.callFeedback}</li>
        ))}
      </ul>
    ) : <span className="text-sm">No call feedback yet.</span>}</div>
  },
  {
    label: "Results Stored",
    content: <div><span className="text-sm">Results stored in Google Sheet and Drive.</span></div>
  },
  {
    label: "Follow-up",
    content: <div><span className="text-sm">Follow-up steps triggered (e.g., email HR).</span></div>
  },
];

export default function AgencyWorkflowDashboard() {
  const [selectedJD, setSelectedJD] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const handleCardClick = (id: string) => {
    setSelectedJD(id);
    setActiveStep(null);
  };
  const handleBack = () => setSelectedJD(null);

  if (selectedJD) {
    const jd = mockJDs.find((j) => j.id === selectedJD)!;
    const panels = stepPanels(jd);
    return (
      <div className="max-w-2xl mx-auto py-10">
        <button className="mb-4 text-blue-600 hover:underline" onClick={handleBack}>&larr; Back to all positions</button>
        <div className="rounded border p-6 bg-background mb-6 shadow">
          <h2 className="text-xl font-bold mb-2">{jd.title}</h2>
          <p className="text-muted-foreground mb-1">Client: <span className="font-semibold">{jd.client}</span></p>
          <p className="text-xs text-gray-400 mb-4">Received: {jd.receivedAt}</p>
          <div className="mb-4">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {steps.map((step, idx) => (
                <li key={step} className="mb-4 ml-4 cursor-pointer group" onClick={() => setActiveStep(idx)}>
                  <div className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border ${idx <= jd.status ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'} group-hover:ring-2 group-hover:ring-blue-300`}></div>
                  <span className={`font-semibold ${idx === jd.status ? 'text-blue-700' : 'text-gray-500'} group-hover:text-blue-900`}>{step}</span>
                  {idx === jd.status && activeStep === null && (
                    <p className="text-xs text-muted-foreground mt-1">Currently at this step.</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
          {activeStep !== null ? (
            <div className="rounded bg-white border border-blue-200 p-4 mb-6 animate-fade-in">
              <h3 className="font-semibold mb-2 text-blue-700 text-sm">{panels[activeStep].label}</h3>
              <div>{panels[activeStep].content}</div>
              <button className="mt-4 text-xs text-blue-600 hover:underline" onClick={() => setActiveStep(null)}>Close</button>
            </div>
          ) : (
            <div className="rounded bg-blue-50 border border-blue-200 p-4 mb-6">
              <p className="text-blue-900 text-sm mb-2">Status: <span className="font-semibold">{steps[jd.status]}</span></p>
              <p className="text-xs text-blue-800 mb-2">{jd.candidates.length > 0 ? `${jd.candidates.length} candidate(s) processed for this position.` : "No candidates processed yet."}</p>
              {jd.candidates.length > 0 && (
                <div className="space-y-4">
                  {jd.candidates.map((c: Candidate, idx: number) => (
                    <div key={idx} className="rounded border bg-white p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{c.name}</span>
                        <span className="text-xs text-blue-700 font-semibold">Match: {c.matchScore}%</span>
                        <span className={`text-xs font-semibold ${c.status === "Shortlisted" ? "text-green-700" : c.status === "Called" ? "text-blue-700" : c.status === "Offered" ? "text-purple-700" : "text-gray-400"}`}>{c.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">Phone: {c.phone}</div>
                      {c.offer && <div className="text-xs text-purple-700 mb-1">Offer: {c.offer.salary}, Start: {c.offer.startDate}</div>}
                      <div className="text-xs text-green-700 mb-1">AI Call Result: <span className="font-normal text-gray-800">{c.aiCallResult}</span></div>
                      <div className="text-xs text-purple-700">Call Feedback: <span className="font-normal text-gray-800">{c.callFeedback}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="rounded bg-gray-50 border border-gray-200 p-4">
            <h3 className="font-semibold mb-2 text-gray-700 text-sm">Next Steps</h3>
            <ul className="list-disc list-inside text-xs text-gray-600">
              {steps.slice(jd.status + 1, jd.status + 4).map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Client Job Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockJDs.map((jd) => (
          <div
            key={jd.id}
            className="rounded-xl border bg-background p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
            onClick={() => handleCardClick(jd.id)}
          >
            <div>
              <h2 className="text-lg font-semibold mb-1">{jd.title}</h2>
              <p className="text-muted-foreground mb-2">Client: <span className="font-medium">{jd.client}</span></p>
              <p className="text-xs text-gray-400 mb-4">Received: {jd.receivedAt}</p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${((jd.status + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-blue-700 font-semibold ml-2">{steps[jd.status]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 