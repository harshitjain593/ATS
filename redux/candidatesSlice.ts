import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '@/lib/types';
import { createCandidate, updateCandidateStatus, createCandidatePipeline, getCandidatesFromApi, updateApplicationStatus } from './candidatesThunk';
import { CandidatePipelineResponse } from '@/lib/types';

interface CandidatesState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  appliedJobTitles: any[]; // Add appliedJobTitles to state
  applications: any[]; // Add raw applications data
  // Add pipeline state
  pipelineLoading?: boolean;
  pipelineError?: string | null;
  pipelineResponse?: CandidatePipelineResponse | null;
}

const initialState: CandidatesState = {
  candidates: [],
  loading: false,
  error: null,
  appliedJobTitles: [], // Initialize appliedJobTitles
  applications: [], // Initialize applications
  pipelineLoading: false,
  pipelineError: null,
  pipelineResponse: null,
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action: PayloadAction<Candidate>) => {
        state.loading = false;
        state.candidates.push(action.payload);
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create candidate';
      })
      .addCase(updateCandidateStatus.fulfilled, (state, action: PayloadAction<Candidate>) => {
        const idx = state.candidates.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) {
          state.candidates[idx] = action.payload;
        }
      })
      .addCase(createCandidatePipeline.pending, (state) => {
        state.pipelineLoading = true;
        state.pipelineError = null;
        state.pipelineResponse = null;
      })
      .addCase(createCandidatePipeline.fulfilled, (state, action: PayloadAction<CandidatePipelineResponse>) => {
        state.pipelineLoading = false;
        state.pipelineResponse = action.payload;
      })
      .addCase(createCandidatePipeline.rejected, (state, action) => {
        state.pipelineLoading = false;
        state.pipelineError = action.error.message || 'Failed to process candidate pipeline';
      })
      .addCase(getCandidatesFromApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCandidatesFromApi.fulfilled, (state, action: PayloadAction<{ applications: any[], appliedJobTitles: any[] }>) => {
        state.loading = false;
        // Store raw applications data
        state.applications = action.payload.applications;
        // Store appliedJobTitles
        state.appliedJobTitles = action.payload.appliedJobTitles;
        // Map each application to a Candidate object
        state.candidates = action.payload.applications.map((app: any) => ({
          id: String(app.id), // Use application ID instead of userId
          name: app.name, 
          applicationEmail: app.applicationEmail || "", // Use applicationEmail as required by interface
          phone: app.mobile || "",
          status: app.status || "New",
          skills: Array.isArray(app.skills) ? app.skills.filter((skill: string) => skill && skill.trim() !== "") : [], // Filter out empty skills
          experience: app.experience ? [{ title: app.previousPosition || "", company: app.companyName || "", years: parseFloat(app.experience) || 0 }] : [],
          education: Array.isArray(app.education) ? app.education.filter((e: string) => e && e.trim() !== "").map((e: string) => ({ degree: e, institution: '', year: 0 })) : [],
          notes: app.coverLetter || "",
          appliedJobs: [], // Remove appliedJobs since we're using appliedJobTitles now
          offers: [],
        }));
      })
      .addCase(getCandidatesFromApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the candidates state if needed
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update application status';
      });
  },
});

export default candidatesSlice.reducer; 