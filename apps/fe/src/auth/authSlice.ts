import type { User } from 'firebase/auth';
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  university: string;
}

export interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  profile: null,
  isLoading: true
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    removeUser: (state) => {
      state.user = null;
      state.profile = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
})

export const { setUser, setProfile, updateProfile, removeUser, setLoading } = userSlice.actions;

export default userSlice.reducer;
