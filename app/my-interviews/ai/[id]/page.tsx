"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sparkles, Bot } from "lucide-react";

export default function AIInterviewPage() {
  const router = useRouter();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const questions = [
    "Tell us about yourself.",
    "Why are you interested in this position?",
    "Describe a challenging project you worked on.",
    "How do you handle tight deadlines?"
  ];
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 py-10 px-2">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-2">
          <div className="rounded-full bg-blue-800 p-4 shadow-lg animate-pulse">
            <Bot className="h-10 w-10 text-white drop-shadow-glow" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-blue-400 animate-spin-slow" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1 animate-text-glow">AI Interview</h1>
        <p className="text-blue-200 text-sm">Interview ID: {id}</p>
      </div>
      <div className="w-full max-w-xl bg-white/10 rounded-xl shadow-xl p-6 backdrop-blur-md">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-6 w-6 text-blue-400" />
            <span className="font-semibold text-blue-100">AI:</span>
            <span className="text-blue-100">Question {step + 1} of {questions.length}</span>
          </div>
          <div className="text-lg text-white mb-2 font-medium">{questions[step]}</div>
        </div>
        <div className="mb-4">
          <textarea
            className="w-full rounded-lg border border-blue-300 bg-white/80 p-3 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={4}
            value={answers[step]}
            onChange={e => {
              const newAnswers = [...answers];
              newAnswers[step] = e.target.value;
              setAnswers(newAnswers);
            }}
            placeholder="Type your answer here..."
          />
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="bg-white/30 text-blue-900 border-blue-300">Previous</Button>
          {step < questions.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!answers[step]} className="bg-blue-600 text-white hover:bg-blue-700">Next</Button>
          ) : (
            <Button onClick={() => router.push("/my-interviews")} className="bg-green-600 text-white hover:bg-green-700">Finish Interview</Button>
          )}
        </div>
      </div>
      <div className="text-xs text-blue-200 mt-8 animate-text-glow">(This is a mock AI interview. OpenAI integration coming soon.)</div>
      <style jsx global>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 12px #60a5fa) drop-shadow(0 0 24px #818cf8);
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 8px #60a5fa, 0 0 16px #818cf8; }
          50% { text-shadow: 0 0 24px #818cf8, 0 0 32px #60a5fa; }
        }
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
} 