import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backendAPI from '../../api/backendAPI';

// ── Thunks ────────────────────────────────────────────────────

export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const data = await backendAPI.get('/admin/stats');
    return data.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchAdminMovies = createAsyncThunk('admin/fetchMovies', async (_, { rejectWithValue }) => {
  try {
    const data = await backendAPI.get('/admin/movies');
    return data.data || [];
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const data = await backendAPI.get('/admin/users');
    return data.data || [];
  } catch (err) { return rejectWithValue(err.message); }
});

export const addMovieThunk = createAsyncThunk('admin/addMovie', async (movieData, { rejectWithValue }) => {
  try {
    const data = await backendAPI.post('/admin/movies', movieData);
    return data.data;
  } catch (err) { return rejectWithValue(err.message); }
});

export const deleteMovieThunk = createAsyncThunk('admin/deleteMovie', async (id, { rejectWithValue }) => {
  try {
    await backendAPI.delete(`/admin/movies/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.message); }
});

export const toggleBanUserThunk = createAsyncThunk('admin/toggleBan', async (userId, { rejectWithValue }) => {
  try {
    const data = await backendAPI.put(`/admin/ban/${userId}`);
    return { userId, isBanned: data.isBanned };
  } catch (err) { return rejectWithValue(err.message); }
});

export const deleteUserThunk = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    await backendAPI.delete(`/admin/delete-user/${userId}`);
    return userId;
  } catch (err) { return rejectWithValue(err.message); }
});

// ── Slice ─────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    movies:  [],
    users:   [],
    stats: {
      totalMovies:  0,
      totalUsers:   0,
      totalFavorites: 0,
      totalHistory: 0,
      newUsersLast30Days: 0,
      recentUsers: [],
    },
    loading: false,
  },
  reducers: {
    // Keep synchronous versions as fallbacks
    addMovie: (state, { payload }) => {
      state.movies.unshift({ ...payload, _id: payload._id || Date.now() });
    },
    updateMovie: (state, { payload }) => {
      const idx = state.movies.findIndex((m) => (m._id || m.id) === (payload._id || payload.id));
      if (idx >= 0) state.movies[idx] = payload;
    },
    deleteMovie: (state, { payload }) => {
      state.movies = state.movies.filter((m) => (m._id || m.id) !== payload);
    },
    toggleBanUser: (state, { payload }) => {
      const user = state.users.find((u) => (u._id || u.id) === payload);
      if (user) user.isBanned = !user.isBanned;
    },
    deleteUser: (state, { payload }) => {
      state.users = state.users.filter((u) => (u._id || u.id) !== payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.fulfilled, (state, { payload }) => {
        state.stats = payload;
      })
      // Movies
      .addCase(fetchAdminMovies.pending,   (state) => { state.loading = true; })
      .addCase(fetchAdminMovies.fulfilled, (state, { payload }) => { state.movies = payload; state.loading = false; })
      .addCase(fetchAdminMovies.rejected,  (state) => { state.loading = false; })
      // Users
      .addCase(fetchAdminUsers.fulfilled,  (state, { payload }) => { state.users  = payload; })
      // Add movie
      .addCase(addMovieThunk.fulfilled, (state, { payload }) => {
        state.movies.unshift(payload);
      })
      // Delete movie
      .addCase(deleteMovieThunk.fulfilled, (state, { payload }) => {
        state.movies = state.movies.filter((m) => (m._id || m.id) !== payload);
      })
      // Toggle ban
      .addCase(toggleBanUserThunk.fulfilled, (state, { payload }) => {
        const user = state.users.find((u) => (u._id || u.id) === payload.userId);
        if (user) user.isBanned = payload.isBanned;
      })
      // Delete user
      .addCase(deleteUserThunk.fulfilled, (state, { payload }) => {
        state.users = state.users.filter((u) => (u._id || u.id) !== payload);
      });
  },
});

export const { addMovie, updateMovie, deleteMovie, toggleBanUser, deleteUser } = adminSlice.actions;
export default adminSlice.reducer;
