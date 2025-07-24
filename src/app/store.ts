import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courierReducer from '../features/courier/courierSlice';

// რედაქსის კონფიგურაცია
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courier: courierReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
