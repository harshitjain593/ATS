import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Stage } from '@/lib/types'

interface StagesState {
  stages: Stage[]
  loading: boolean
  error: string | null
}

const initialState: StagesState = {
  stages: [],
  loading: false,
  error: null,
}

const stagesSlice = createSlice({
  name: 'stages',
  initialState,
  reducers: {
    setStages: (state, action: PayloadAction<Stage[]>) => {
      state.stages = action.payload
    },
    addStage: (state, action: PayloadAction<Stage>) => {
      state.stages.push(action.payload)
    },
    updateStage: (state, action: PayloadAction<Stage>) => {
      const index = state.stages.findIndex(stage => stage.id === action.payload.id)
      if (index !== -1) {
        state.stages[index] = action.payload
      }
    },
    deleteStage: (state, action: PayloadAction<string>) => {
      state.stages = state.stages.filter(stage => stage.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    reorderStages: (state, action: PayloadAction<{ jobId: string; stageIds: string[] }>) => {
      const { jobId, stageIds } = action.payload
      const jobStages = state.stages.filter(stage => stage.jobId === jobId)
      
      stageIds.forEach((stageId, index) => {
        const stage = jobStages.find(s => s.id === stageId)
        if (stage) {
          const globalIndex = state.stages.findIndex(s => s.id === stageId)
          if (globalIndex !== -1) {
            state.stages[globalIndex].order = index + 1
          }
        }
      })
    },
  },
})

export const {
  setStages,
  addStage,
  updateStage,
  deleteStage,
  setLoading,
  setError,
  reorderStages,
} = stagesSlice.actions

export default stagesSlice.reducer 