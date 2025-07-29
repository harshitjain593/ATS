"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VirtualInterviewPage() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Virtual Interview Session</h1>
      <p className="text-muted-foreground">Interview ID: {id}</p>
      <div className="bg-background rounded-lg shadow p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-lg mb-4">[Video Call Placeholder]</div>
        <div className="text-muted-foreground mb-2">(This is a mock virtual interview. Video integration coming soon.)</div>
        <Button variant="outline" onClick={() => router.push("/my-interviews")}>Leave Interview</Button>
      </div>
    </div>
  );
} 