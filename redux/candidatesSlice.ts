import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '@/lib/types';
import { createCandidate, updateCandidateStatus, createCandidatePipeline } from './candidatesThunk';
import { CandidatePipelineResponse } from '@/lib/types';

interface CandidatesState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  // Add pipeline state
  pipelineLoading?: boolean;
  pipelineError?: string | null;
  pipelineResponse?: CandidatePipelineResponse | null;
}

const initialState: CandidatesState = {
  candidates: [],
  loading: false,
  error: null,
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
      });
  },
});

export default candidatesSlice.reducer; 