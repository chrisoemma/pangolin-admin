import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import studentsSlice from "./slices/studentsSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    students: studentsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

