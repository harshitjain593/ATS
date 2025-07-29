import { NextResponse } from 'next/server';
import { Candidate } from '@/lib/types';

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = formData.get('name') as string | null;
  const email = formData.get('email') as string | null;
  const resume = formData.get('resume');

  // Simulate parsing the resume and extracting data
  // In a real implementation, you would parse the file and extract info
  if (!resume) {
    return NextResponse.json({ error: 'Resume is required' }, { status: 400 });
  }

  // Mock parsed data
  const candidate: Candidate = {
    id: Math.random().toString(36).substring(2, 10),
    name: name || 'Parsed Name',
    email: email || 'parsed@email.com',
    phone: '555-000-0000',
    status: 'New',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: [
      {
        title: 'Software Engineer',
        company: 'Mock Company',
        years: 2,
        description: 'Worked on various projects.'
      }
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'Mock University',
        year: 2022
      }
    ],
    appliedJobs: [],
    notes: '',
    offers: []
  };

  return NextResponse.json(candidate);
} 