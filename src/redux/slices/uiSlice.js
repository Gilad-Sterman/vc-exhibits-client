import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    lang: 'he',
  },
  reducers: {
    setLang: (state, action) => {
      state.lang = action.payload
    },
  },
})

export const { setLang } = uiSlice.actions
export default uiSlice.reducer
