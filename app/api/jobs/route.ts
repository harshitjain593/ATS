import { NextResponse } from "next/server";
import { mockJobs } from "@/data/mock-data";

export async function GET() {
  return NextResponse.json(mockJobs);
} 