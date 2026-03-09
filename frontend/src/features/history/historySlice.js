import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backendAPI from '../../api/backendAPI';

const stored = JSON.parse(localStorage.getItem('cs_history') || '[]');

// ── Thunks ────────────────────────────────────────────────────

export const fetchHistory = createAsyncThunk(
  'history/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await backendAPI.get('/history');
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addHistoryThunk = createAsyncThunk(
  'history/add',
  async (item, { rejectWithValue }) => {
    try {
      const movieId = String(item.id);
      const movieSnapshot = {
        title: item.title || item.name || 'Untitled',
        poster: item.poster_path || null,
        rating: item.vote_average || 0,
        year: (item.release_date || item.first_air_date || '').slice(0, 4),
      };
      await backendAPI.post('/history/add', { movieId, movieSnapshot });
      return item;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeHistoryThunk = createAsyncThunk(
  'history/remove',
  async (movieId, { rejectWithValue }) => {
    try {
      await backendAPI.delete(`/history/${movieId}`);
      return movieId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearHistoryThunk = createAsyncThunk(
  'history/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await backendAPI.delete('/history/clear');
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────

const persist = (items) => localStorage.setItem('cs_history', JSON.stringify(items));

const historySlice = createSlice({
  name: 'history',
  initialState: { items: stored, loading: false },
  reducers: {
    addToHistory: (state, { payload }) => {
      state.items = [
        { ...payload, visitedAt: Date.now() },
        ...state.items.filter((h) => h.id !== payload.id),
      ].slice(0, 50);
      persist(state.items);
    },
    clearHistory: (state) => {
      state.items = [];
      localStorage.removeItem('cs_history');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchHistory.fulfilled, (state, { payload }) => {
        state.items = payload.map((h) => ({
          id: h.movieId,
          title: h.movieSnapshot?.title || 'Untitled',
          poster_path: h.movieSnapshot?.poster || null,
          vote_average: h.movieSnapshot?.rating || 0,
          release_date: h.movieSnapshot?.year || '',
          media_type: 'movie',
          visitedAt: new Date(h.watchedAt).getTime(),
        }));
        persist(state.items);
        state.loading = false;
      })
      .addCase(fetchHistory.rejected, (state) => { state.loading = false; })
      .addCase(addHistoryThunk.fulfilled, (state, { payload }) => {
        state.items = [
          { ...payload, visitedAt: Date.now() },
          ...state.items.filter((h) => h.id !== payload.id),
        ].slice(0, 50);
        persist(state.items);
      })
      .addCase(removeHistoryThunk.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((h) => h.id !== payload);
        persist(state.items);
      })
      .addCase(clearHistoryThunk.fulfilled, (state) => {
        state.items = [];
        localStorage.removeItem('cs_history');
      });
  },
});

export const { addToHistory, clearHistory } = historySlice.actions;

// Selectors
export const selectHistory = (state) => state.history.items;

export default historySlice.reducer;
