import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../auth/authSlice.ts";
import fileReducer from "./fileSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    files: fileReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
