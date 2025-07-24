import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../utils/supabase';

// ინტერფეისი, რომელიც აღწერს ავტორიზაციის სტეიტს
interface AuthState {
  user: any;
  role: 'admin' | 'user' | 'courier' | null;
  loading: boolean;
  error: string | null;
}

// საწყისი სტეიტი
const initialState: AuthState = {
  user: null,
  role: null,
  loading: true, 
  error: null,
};

// ასინქრონული ავტორიზაცია მომხმარებლის შესვლისთვის SUPABASE-ის საშუალებით
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    {
      email,
      password,
      role,
    }: { email: string; password: string; role: AuthState['role'] },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);

    return { user: data.user, role };
  }
);

// ავტორიზაციის Slice-ის შექმნა
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => { // მომხმარებლის გასვლის პროცესი
      supabase.auth.signOut();
      state.user = null;
      state.role = null;
      state.loading = false;
    },
    setUserAndRole: (state, action) => { // მომხმარებლის და როლის დაყენება
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.loading = false; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { // მომხმარებლის შესვლის პროცესის დაწყება
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUserAndRole } = authSlice.actions;
export default authSlice.reducer;
