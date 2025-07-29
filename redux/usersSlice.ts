import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsers, fetchUserById, createUser, authenticateUser } from './usersThunk';
import { UserApi, AuthResponse } from '@/lib/types';

interface UsersState {
  users: UserApi[];
  selectedUser: UserApi | null;
  authUser: UserApi | null;
  loading: boolean;
  loadingSelected: boolean;
  loadingAuth: boolean;
  error: string | null;
  errorSelected: string | null;
  errorAuth: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  authUser: null,
  loading: false,
  loadingSelected: false,
  loadingAuth: false,
  error: null,
  errorSelected: null,
  errorAuth: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<{ id: string; email: string; role: string }>) => {
      state.authUser = action.payload as any;
    },
    logout: (state) => {
      state.authUser = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserApi[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loadingSelected = true;
        state.errorSelected = null;
        state.selectedUser = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<UserApi>) => {
        state.loadingSelected = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.errorSelected = action.error.message || 'Failed to fetch user';
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<UserApi>) => {
        state.users.push(action.payload);
      })
      .addCase(authenticateUser.pending, (state) => {
        state.loadingAuth = true;
        state.errorAuth = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.loadingAuth = false;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loadingAuth = false;
        state.errorAuth = action.error.message || 'Failed to authenticate';
      });
  },
});

export default usersSlice.reducer; 
export const {setCurrentUser, logout} = usersSlice.actions;