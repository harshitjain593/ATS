import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchJobs, createJob, approveJob, rejectJob, fetchJobById } from './jobsThunk';
import { Job, Application } from '@/lib/types';

interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  applications: Application[];
  loading: boolean;
  loadingSelected: boolean;
  error: string | null;
  errorSelected: string | null;
  userAppliedJobs?: any[];
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  applications: [],
  loading: false,
  loadingSelected: false,
  error: null,
  errorSelected: null,
  userAppliedJobs: [],
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      .addCase(fetchJobById.pending, (state) => {
        state.loadingSelected = true;
        state.errorSelected = null;
        state.selectedJob = null;
        state.applications = [];
        state.userAppliedJobs = [];
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<{ job: Job, applications: Application[], userAppliedJobs?: any[] }>) => {
        state.loadingSelected = false;
        state.selectedJob = action.payload.job;
        state.applications = action.payload.applications;
        state.userAppliedJobs = (action as any).payload.userAppliedJobs || [];
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.errorSelected = (action.payload as string) || 'Failed to fetch job';
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.jobs.push(action.payload);
      })
      .addCase(approveJob.fulfilled, (state, action: PayloadAction<string>) => {
        const job = state.jobs.find(j => j.id === action.payload);
        if (job) job.status = 'Open';
      })
      .addCase(rejectJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.jobs = state.jobs.filter(j => j.id !== action.payload);
      });
  },
});

export default jobsSlice.reducer; 