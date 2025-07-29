import { createAsyncThunk } from '@reduxjs/toolkit';
import { Candidate } from '@/lib/types';
import { CandidatePipelineResponse } from '@/lib/types';

// Simulate a mock API endpoint for resume parsing
const BASE_URL = 'http://192.168.1.13:5000/api/';

export const createCandidate = createAsyncThunk<Candidate, { name?: string; email?: string; resume: File }>(
  'candidates/createCandidate',
  async ({ name, email, resume }, { rejectWithValue }) => {
    try {
      // Simulate uploading the resume and parsing it
      const formData = new FormData();
      formData.append('resume', resume);
      if (name) formData.append('name', name);
      if (email) formData.append('email', email);

      // This would be replaced with your real API endpoint
      const response = await fetch(BASE_URL, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }
      const data = await response.json();
      // Assume the API returns a Candidate object
      return data as Candidate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create candidate');
    }
  }
);

// Update candidate status thunk
export const updateCandidateStatus = createAsyncThunk<Candidate, { candidateId: string; status: Candidate['status'] }>(
  'candidates/updateCandidateStatus',
  async ({ candidateId, status }, { getState, rejectWithValue }) => {
    try {
      // Simulate API update (replace with real API call)
      // Find candidate in current state
      // In real app, send PATCH/PUT to backend
      const state: any = getState();
      const candidate = state.candidates.candidates.find((c: Candidate) => c.id === candidateId);
      if (!candidate) throw new Error('Candidate not found');
      // Return updated candidate
      return { ...candidate, status };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

export const createCandidatePipeline = createAsyncThunk<CandidatePipelineResponse, { resumeFile: File; jobDescription: string }>(
  'candidatePipeline/createCandidatePipeline',
  async ({ resumeFile, jobDescription }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resumeFile', resumeFile);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('http://192.168.1.13:5000/api/candidatePipeline/createOrSetCp', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to process candidate pipeline');
      }
      const data = await response.json();
      return data as CandidatePipelineResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to process candidate pipeline');
    }
  }
); 