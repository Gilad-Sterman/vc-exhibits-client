import { configureStore } from '@reduxjs/toolkit'
import exhibitReducer from './slices/exhibitSlice'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'

const store = configureStore({
  reducer: {
    exhibit: exhibitReducer,
    auth: authReducer,
    ui: uiReducer,
  },
})

export default store
