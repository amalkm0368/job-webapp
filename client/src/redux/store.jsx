import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducer/authSlice"
import jobReducer from "./reducer/jobSlice"
import applicationReducer from "./reducer/applicationSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
  },
})
