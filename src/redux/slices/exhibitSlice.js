import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const authHeader = (getState) => ({
  headers: { Authorization: `Bearer ${getState().auth.token}` },
})

export const fetchExhibit = createAsyncThunk(
  'exhibit/fetchByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/exhibits/${number}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Exhibit not found')
    }
  }
)

export const fetchAllExhibits = createAsyncThunk(
  'exhibit/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/exhibits')
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load exhibits')
    }
  }
)

export const fetchAdminExhibits = createAsyncThunk(
  'exhibit/fetchAdmin',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get('/api/admin/exhibits', authHeader(getState))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load exhibits')
    }
  }
)

export const createExhibitAdmin = createAsyncThunk(
  'exhibit/createAdmin',
  async (body, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.post('/api/admin/exhibits', body, authHeader(getState))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create exhibit')
    }
  }
)

export const updateExhibitAdmin = createAsyncThunk(
  'exhibit/updateAdmin',
  async ({ id, ...body }, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.put(`/api/admin/exhibits/${id}`, body, authHeader(getState))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update exhibit')
    }
  }
)

export const deleteExhibitAdmin = createAsyncThunk(
  'exhibit/deleteAdmin',
  async (id, { rejectWithValue, getState }) => {
    try {
      await axios.delete(`/api/admin/exhibits/${id}`, authHeader(getState))
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete exhibit')
    }
  }
)

export const togglePublishAdmin = createAsyncThunk(
  'exhibit/togglePublish',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.patch(
        `/api/admin/exhibits/${id}/publish`,
        {},
        authHeader(getState)
      )
      return { id, isPublished: data.isPublished }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle publish')
    }
  }
)

const exhibitSlice = createSlice({
  name: 'exhibit',
  initialState: {
    current: null,
    allExhibits: [],
    adminExhibits: [],
    loading: false,
    adminLoading: false,
    saveLoading: false,
    error: null,
    saveError: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null
      state.error = null
    },
    clearSaveError: (state) => {
      state.saveError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExhibit.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExhibit.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
      })
      .addCase(fetchExhibit.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAllExhibits.fulfilled, (state, action) => {
        state.allExhibits = action.payload
      })
      .addCase(fetchAdminExhibits.pending, (state) => {
        state.adminLoading = true
      })
      .addCase(fetchAdminExhibits.fulfilled, (state, action) => {
        state.adminLoading = false
        state.adminExhibits = action.payload
      })
      .addCase(fetchAdminExhibits.rejected, (state) => {
        state.adminLoading = false
      })
      .addCase(createExhibitAdmin.pending, (state) => {
        state.saveLoading = true
        state.saveError = null
      })
      .addCase(createExhibitAdmin.fulfilled, (state, action) => {
        state.saveLoading = false
        state.adminExhibits.push(action.payload)
      })
      .addCase(createExhibitAdmin.rejected, (state, action) => {
        state.saveLoading = false
        state.saveError = action.payload
      })
      .addCase(updateExhibitAdmin.pending, (state) => {
        state.saveLoading = true
        state.saveError = null
      })
      .addCase(updateExhibitAdmin.fulfilled, (state, action) => {
        state.saveLoading = false
        const idx = state.adminExhibits.findIndex((e) => e._id === action.payload._id)
        if (idx !== -1) state.adminExhibits[idx] = action.payload
      })
      .addCase(updateExhibitAdmin.rejected, (state, action) => {
        state.saveLoading = false
        state.saveError = action.payload
      })
      .addCase(deleteExhibitAdmin.fulfilled, (state, action) => {
        state.adminExhibits = state.adminExhibits.filter((e) => e._id !== action.payload)
      })
      .addCase(togglePublishAdmin.fulfilled, (state, action) => {
        const exhibit = state.adminExhibits.find((e) => e._id === action.payload.id)
        if (exhibit) exhibit.isPublished = action.payload.isPublished
      })
  },
})

export const { clearCurrent, clearSaveError } = exhibitSlice.actions
export default exhibitSlice.reducer
