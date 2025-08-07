import { createAsyncThunk } from '@reduxjs/toolkit'
import { setStages, addStage, updateStage, deleteStage, setLoading, setError } from './stagesSlice'
import type { Stage } from '@/lib/types'
import { RootState } from './store';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Function to generate dynamic colors based on stage name
const generateStageColor = (stageName: string): string => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
  ];
  
  // Use the stage name to generate a consistent color
  const hash = stageName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Fetch all stages
export const fetchStages = createAsyncThunk(
  'stages/fetchStages',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await fetch(`${BASE_URL}/Stage/GetAllStages`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch stages')
      }
      
      const data = await response.json()
      // Map API fields to Stage type
      const stages = Array.isArray(data.data) ? data.data.map((s: any) => ({
        id: String(s.stageId),
        jobId: String(s.jobId),
        name: s.stageName?.trim() || '',
        order: s.stageOrder || 0,
        color: s.stageColor && s.stageColor.trim() !== '' ? s.stageColor : generateStageColor(s.stageName?.trim() || ''),
        isActive: s.flag !== 'D',
        description: s.description || '',
        createdDate: s.createdDate || '',
        modifiedDate: s.modifiedDate || '',
      })) : [];
      dispatch(setStages(stages))
      return stages
    } catch (error: any) {
      dispatch(setError(error.message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Create new stage
export const createStage = createAsyncThunk(
  'stages/createStage',
  async (stageData: { name: string; order: number; jobId: string; color?: string }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const state = getState() as RootState;
      let userId = state.users.authUser?.userId;
      if (!userId) {
        try {
          const localUser = localStorage.getItem('currentUser');
          if (localUser) {
            const parsed = JSON.parse(localUser);
            userId = parsed.userId || parsed.id;
          }
        } catch (e) {
          userId = 0;
        }
      }
      userId = userId ? Number(userId) : 0;
      const body = {
        stageId: 0,
        jobId: Number(stageData.jobId),
        stageName: stageData.name,
        stageOrder: Number(stageData.order),
        stageColor: stageData.color || generateStageColor(stageData.name),
        flag: 'C',
        createdBy: userId,
        modifiedBy: userId,
      };
      const response = await fetch(`${BASE_URL}/Stage/CreateOrSetStage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to create stage')
      }
      const data = await response.json();
      const newStage: Stage = {
        id: data.id || `stage${Date.now()}`,
        jobId: String(body.jobId),
        name: body.stageName,
        order: body.stageOrder,
        color: body.stageColor,
        isActive: true,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
      };
      dispatch(addStage(newStage))
      return newStage
    } catch (error: any) {
      dispatch(setError(error.message))
      return rejectWithValue(error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Update stage
export const updateStageThunk = createAsyncThunk(
  'stages/updateStage',
  async (stageData: Stage, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const state = getState() as RootState;
      let userId = state.users.authUser?.userId;
      if (!userId) {
        try {
          const localUser = localStorage.getItem('currentUser');
          if (localUser) {
            const parsed = JSON.parse(localUser);
            userId = parsed.userId || parsed.id;
          }
        } catch (e) {
          userId = 0;
        }
      }
      userId = userId ? Number(userId) : 0;
      const body = {
        stageId: Number(stageData.id),
        jobId: Number(stageData.jobId),
        stageName: stageData.name,
        stageOrder: Number(stageData.order),
        stageColor: stageData.color || generateStageColor(stageData.name),
        flag: 'U',
        createdBy: userId,
        modifiedBy: userId,
      };
      const response = await fetch(`${BASE_URL}/Stage/CreateOrSetStage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to update stage')
      }
      const updatedStage: Stage = {
        ...stageData,
        color: body.stageColor,
        modifiedDate: new Date().toISOString(),
      };
      dispatch(updateStage(updatedStage))
      return updatedStage
    } catch (error: any) {
      dispatch(setError(error.message))
      return rejectWithValue(error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Delete stage
export const deleteStageThunk = createAsyncThunk(
  'stages/deleteStage',
  async (stageId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      
      const formData = new FormData()
      formData.append('id', stageId)
      formData.append('flag', 'D')
      
      const response = await fetch(`${BASE_URL}/Stage/CreateOrSetStage`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete stage')
      }
      
      dispatch(deleteStage(stageId))
      return stageId
    } catch (error: any) {
      dispatch(setError(error.message))
      return rejectWithValue(error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Get stages by job ID
export const fetchStagesByJob = createAsyncThunk(
  'stages/fetchStagesByJob',
  async (jobId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await fetch(`${BASE_URL}/Stage/GetStagesByJobId?jobId=${jobId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch stages for job')
      }
      
      const data = await response.json()
      return data
    } catch (error: any) {
      dispatch(setError(error.message))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
) 