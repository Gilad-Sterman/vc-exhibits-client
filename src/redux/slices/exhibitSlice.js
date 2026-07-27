import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

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

const exhibitSlice = createSlice({
  name: 'exhibit',
  initialState: {
    current: null,
    allExhibits: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null
      state.error = null
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
  },
})

export const { clearCurrent } = exhibitSlice.actions
export default exhibitSlice.reducer
