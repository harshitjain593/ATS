import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserApi, AuthRequest, AuthResponse } from '@/lib/types';
import { setCurrentUser } from './usersSlice';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUsers = createAsyncThunk<UserApi[]>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/UserManager/GetAllUsers`);
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk<UserApi, number>(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/UserManager/GetUserById?userId=${userId}`);
      const data = await res.json();
      if (data.data) return data.data;
      throw new Error('User not found');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk<UserApi, {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password: string;
    role: "admin" | "recruiter" | "candidate";
  }>(
    'users/createUser',
    // @ts-ignore
    async (user, { rejectWithValue }) => {
      const roleMap: Record<string, number> = {
        admin: 1,
        recruiter: 2,
        candidate: 3,
      };
  
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        flag: "C",
        roleId: roleMap[user.role],
      };
  
      try {
        const res = await fetch(`${BASE_URL}/UserManager/CreateOrSetUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.code !== -1) {
            // Even if data.data is null, treat it as success
            return null;
          } else {
            throw new Error(data.msg || 'Failed to create user');
          }
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to create user');
      }
    }
  );
  

  function parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
  
  export const authenticateUser = createAsyncThunk<
    { token: string }, // returned from API
    { mobileOrEmail: string; password: string }, // input credentials
    { dispatch: any; rejectValue: string }
  >(
    'users/authenticateUser',
    async ({ mobileOrEmail, password }, { dispatch, rejectWithValue }) => {
      try {
        const res = await fetch(`${BASE_URL}/UserManager/AuthenticateUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileOrEmail, password }),
        });
  
        const data = await res.json();
  
        if (data.data) {
          const token = data.data;
          const decoded = parseJwt(token);

          if (decoded) {
            const user = {
              id: decoded.userId,
              email: decoded.unique_name,
              role: decoded.role?.toLowerCase(),
            };
            dispatch(setCurrentUser(user));
            localStorage.setItem("currentUser", JSON.stringify(user));
          }

          return { token };
        } else {
          throw new Error(data.msg || 'Invalid credentials');
        }
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to authenticate');
      }
    }
  );