import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CourierRegisterInput } from '../../types/courier';
import { supabase } from '../../utils/supabase';
  
//  ახალ კურიერის დარეგისტრირებბა SUPABASE-ში
export const createCourier = createAsyncThunk(
  'courier/createCourier',
  async (data: CourierRegisterInput, { rejectWithValue }) => {
    try {
      const { email, password, ...courierData } = data;

      // 1. ქმნის ახალი მომხმარებელი Supabase-ში
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return rejectWithValue(authError.message);
      }

      // 2. სვამს კურიერის მონაცემებს 'couriers' ცხრილში
      const { error: insertError } = await supabase
        .from('couriers')
        .insert([{ ...courierData, email, password}]);// ამოსაღებია password, არ უნდა ინახებოდეს ცხრილში !!!

      if (insertError) {
        return rejectWithValue(insertError.message);
      }

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


// კურიერის სტეიტის ინტერფეისი
interface CourierState {
  loading: boolean;
  error: string | null;
  couriers: CourierRegisterInput[];
}

// საწყისი კურიერის სტეიტი
const initialState: CourierState = {
  loading: false,
  error: null,
  couriers: [],
};

// კურიერის Slice-ის კურიერის რეგისტრაციის პროცესის და სიისთვის
const courierSlice = createSlice({
  name: 'courier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCourier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourier.fulfilled, (state, action) => {
        state.loading = false;
        state.couriers.push(action.payload);
      })
      .addCase(createCourier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default courierSlice.reducer;
