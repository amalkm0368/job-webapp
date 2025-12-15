import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import apiAxios from "../../utils/api"

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const res = await apiAxios.post("/jobs/", jobData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response.data.msg || "Failed to create job")
    }
  }
)

export const getAllJobs = createAsyncThunk(
  "jobs/getAllJobs",
  async (query = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(query).toString()
      const res = await apiAxios.get(`/jobs/?${params}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response.data.msg || "Failed to fetch jobs")
    }
  }
)

export const getCompanyJobs = createAsyncThunk(
  "jobs/getCompanyJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiAxios.get(`/jobs/company`)
      return res.data
    } catch (err) {
      return rejectWithValue(
        err.response.data.msg || "Failed to fetch company jobs"
      )
    }
  }
)

export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiAxios.get(`/jobs/${id}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response.data.msg || "Job not found")
    }
  }
)

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const res = await apiAxios.put(`/jobs/${id}`, jobData)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response.data.msg || "Failed to update job")
    }
  }
)

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await apiAxios.delete(`/jobs/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.response.data.msg || "Failed to delete job")
    }
  }
)

export const filtersSearch = createAsyncThunk(
  "jobs/filters",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiAxios.get(`/jobs/filters`) // store response
      return res.data
    } catch (err) {
      return rejectWithValue(err.response.data.msg || "Failed to delete job")
    }
  }
)

// Slice
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    dbFilters: null,
    companyJobs: [],
    selectedJob: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearJobError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false
        state.companyJobs.push(action.payload)
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get All Jobs
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get Company Jobs
      .addCase(getCompanyJobs.fulfilled, (state, action) => {
        state.loading = false
        state.companyJobs = action.payload
      })

      // Get Job By ID
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedJob = action.payload
      })

      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.companyJobs.findIndex(
          (j) => j._id === action.payload._id
        )
        if (idx !== -1) state.companyJobs[idx] = action.payload
      })

      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false
        state.companyJobs = state.companyJobs.filter(
          (j) => j._id !== action.payload
        )
      })
      // filters Job
      .addCase(filtersSearch.fulfilled, (state, action) => {
        state.loading = false
        state.dbFilters = action.payload
      })
  },
})

export const { clearJobError } = jobSlice.actions
export default jobSlice.reducer
