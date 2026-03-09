import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backendAPI from '../../api/backendAPI';

const stored = JSON.parse(localStorage.getItem('cs_favorites') || '[]');

// ── Thunks ────────────────────────────────────────────────────

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await backendAPI.get('/favorites');
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addFavoriteThunk = createAsyncThunk(
  'favorites/add',
  async (item, { rejectWithValue }) => {
    try {
      const movieId = String(item.id);
      const movieSnapshot = {
        title: item.title || item.name || 'Untitled',
        poster: item.poster_path || null,
        rating: item.vote_average || 0,
        year: (item.release_date || item.first_air_date || '').slice(0, 4),
      };
      await backendAPI.post('/favorites/add', { movieId, movieSnapshot });
      return item;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFavoriteThunk = createAsyncThunk(
  'favorites/remove',
  async (itemId, { rejectWithValue }) => {
    try {
      await backendAPI.delete(`/favorites/remove/${itemId}`);
      return itemId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearFavoritesThunk = createAsyncThunk(
  'favorites/clearAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Backend has no "clear all" endpoint — remove them one by one
      const items = getState().favorites.items;
      await Promise.allSettled(
        items.map((f) => backendAPI.delete(`/favorites/remove/${f.id}`))
      );
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────

const persist = (items) => localStorage.setItem('cs_favorites', JSON.stringify(items));

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: stored, loading: false },
  reducers: {
    // Keep synchronous toggle for instant UI + backward compat
    toggleFavorite: (state, { payload }) => {
      const idx = state.items.findIndex((f) => f.id === payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.unshift(payload);
        if (state.items.length > 100) state.items.pop();
      }
      persist(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem('cs_favorites');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
        // Map backend data to match frontend item shape
        state.items = payload.map((f) => ({
          id: f.movieId,
          title: f.movieSnapshot?.title || 'Untitled',
          poster_path: f.movieSnapshot?.poster || null,
          vote_average: f.movieSnapshot?.rating || 0,
          release_date: f.movieSnapshot?.year || '',
          media_type: 'movie',
        }));
        persist(state.items);
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state) => { state.loading = false; })
      .addCase(addFavoriteThunk.fulfilled, (state, { payload }) => {
        if (!state.items.find((f) => f.id === payload.id)) {
          state.items.unshift(payload);
          persist(state.items);
        }
      })
      .addCase(removeFavoriteThunk.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((f) => f.id !== payload);
        persist(state.items);
      })
      .addCase(clearFavoritesThunk.fulfilled, (state) => {
        state.items = [];
        localStorage.removeItem('cs_favorites');
      });
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites    = (state) => state.favorites.items;
export const selectIsFavorite   = (id)    => (state) =>
  state.favorites.items.some((f) => f.id === id);

export default favoritesSlice.reducer;
