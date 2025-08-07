import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './jobsSlice';
import usersReducer from './usersSlice';
import candidatesReducer from './candidatesSlice';
import stagesReducer from './stagesSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    users: usersReducer,
    candidates: candidatesReducer,
    stages: stagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 