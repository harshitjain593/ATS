import { createAsyncThunk } from '@reduxjs/toolkit';
import { Candidate } from '@/lib/types';
import { CandidatePipelineResponse } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createCandidate = createAsyncThunk<Candidate, { name?: string; email?: string; jobId: string; resume: File }>(
  'candidates/createCandidate',
  async ({ name, email, jobId, resume }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resumeFile', resume);
      formData.append('flag', 'C');
      formData.append('JobId', jobId);
      formData.append('frontEndFlag', 'N');
      if (name) formData.append('name', name);
      if (email) formData.append('ApplicationEmail', email);

      // Updated API endpoint as requested
      const response = await fetch(`${BASE_URL}/UserApplication/CreateOrSetUserApplication`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to create application');
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

      const response = await fetch(`${BASE_URL}/candidatePipeline/createOrSetCp`, {
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

export const getCandidatesFromApi = createAsyncThunk<any, void>(
  'candidates/getCandidatesFromApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/UserApplication/GetUserApplicationByApplicatoinIdOrUserId`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      // Return both applications and appliedJobTitles
      return {
        applications: data.data.applications,
        appliedJobTitles: data.data.appliedJobTitles
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch candidates');
    }
  }
);

// Update application status thunk
export const updateApplicationStatus = createAsyncThunk<any, { applicationId: number; status: string }>(
  'candidates/updateApplicationStatus',
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('id', applicationId.toString());
      formData.append('status', status);
      formData.append('flag', 'U');
      
      const response = await fetch(`${BASE_URL}/UserApplication/CreateOrSetUserApplication`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update application status');
    }
  }
); 