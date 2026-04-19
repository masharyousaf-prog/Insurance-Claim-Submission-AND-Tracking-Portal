import { configureStore } from '@reduxjs/toolkit';
// Corrected the import path to match your actual file structure
import authReducer from '../features/authSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Removed claimsReducer since claims are handled via local state (useState/Axios)
  },
});