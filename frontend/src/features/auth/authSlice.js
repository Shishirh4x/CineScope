import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from './authAPI';

const stored = JSON.parse(localStorage.getItem('cs_user') || 'null');

// ── Thunks ────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authAPI.login({ email, password });
      const user = { ...data.user, token: data.token };
      localStorage.setItem('cs_user', JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authAPI.register({ name, email, password });
      const user = { ...data.user, token: data.token };
      localStorage.setItem('cs_user', JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authAPI.getMe();
      return data.user;
    } catch (err) {
      // Token invalid/expired — clear stored data
      localStorage.removeItem('cs_user');
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    stored,
    loading: false,
    error:   null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('cs_user');
      localStorage.removeItem('cs_favorites');
      localStorage.removeItem('cs_history');
      // Fire-and-forget backend logout
      authAPI.logout().catch(() => {});
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('cs_user', JSON.stringify(action.payload));
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(loginUser.rejected,  (state, action) => { state.error = action.payload; state.loading = false; })
      // Register
      .addCase(registerUser.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(registerUser.rejected,  (state, action) => { state.error = action.payload; state.loading = false; })
      // Fetch Me
      .addCase(fetchMe.fulfilled, (state, action) => {
        // Merge fresh user data but keep the stored token
        const stored = JSON.parse(localStorage.getItem('cs_user') || '{}');
        state.user = { ...action.payload, token: stored.token };
      })
      .addCase(fetchMe.rejected, (state) => { state.user = null; });
  },
});

export const { logout, registerSuccess, clearError } = authSlice.actions;
export default authSlice.reducer;
