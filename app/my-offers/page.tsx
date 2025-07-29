"use client";

import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { mockJobs, mockCandidates } from "@/data/mock-data";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function MyOffersPage() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role !== "candidate")) {
      router.push("/login");
    }
  }, [currentUser, isLoadingUser, router]);

  // Example: offers are jobs where the candidate has an offer (mock logic)
  const offers = useMemo(() => {
    if (!currentUser) return [];
    // Suppose each candidate in mockCandidates has an offers array of job IDs
    const candidate = mockCandidates.find((c) => c.id === currentUser.id);
    if (!candidate || !candidate.offers) return [];
    return candidate.offers.map((jobId: string) => mockJobs.find((j) => j.id === jobId)).filter(Boolean);
  }, [currentUser]);

  if (isLoadingUser || !currentUser || currentUser.role !== "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading offers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Offers</h1>
      {offers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            You have no offers yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((job: any) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="font-semibold text-lg">{job.title}</div>
                <div className="text-muted-foreground">{job.company}</div>
                <div className="text-sm mt-2">Location: {job.location}</div>
                <div className="text-sm">Type: {job.type}</div>
                <div className="text-sm">Status: {job.status}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 