import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import apiAxios from "../../utils/api"

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",

  async ({ jobId, formData }, { rejectWithValue }) => {
    try {
      debugger
      const res = await apiAxios.post(`/applications/${jobId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to apply")
    }
  }
)

export const getUserApplications = createAsyncThunk(
  "applications/getUserApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiAxios.get("/applications/user")
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch apps")
    }
  }
)

export const getJobApplicants = createAsyncThunk(
  "applications/getJobApplicants",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiAxios.get(`/applications/job/`)
      return res.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to fetch applicants"
      )
    }
  }
)

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    userApplications: [],
    jobApplicants: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null
      state.success = null
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(applyToJob.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false
        state.success = "Applied successfully"
        state.userApplications.push(action.payload)
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(getUserApplications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserApplications.fulfilled, (state, action) => {
        state.loading = false
        state.userApplications = action.payload
      })
      .addCase(getUserApplications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(getJobApplicants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getJobApplicants.fulfilled, (state, action) => {
        state.loading = false
        state.userApplications = action.payload.applications
      })
      .addCase(getJobApplicants.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearStatus } = applicationSlice.actions
export default applicationSlice.reducer
