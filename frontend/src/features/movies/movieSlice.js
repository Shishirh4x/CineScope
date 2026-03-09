import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../../api/tmdb';

// ── Async thunks ──────────────────────────────────────────────

export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async ({ type = 'movie', timeWindow = 'week' } = {}) => {
    const data = await tmdbAPI.getTrending(type, timeWindow);
    return data.results || [];
  }
);

export const fetchPopular = createAsyncThunk(
  'movies/fetchPopular',
  async ({ type = 'movie', page = 1 } = {}) => {
    const data = type === 'movie'
      ? await tmdbAPI.getPopularMovies(page)
      : await tmdbAPI.getPopularTV(page);
    return { results: data.results || [], totalPages: data.total_pages || 1, page };
  }
);

export const fetchTopRated = createAsyncThunk(
  'movies/fetchTopRated',
  async ({ type = 'movie', page = 1 } = {}) => {
    const data = type === 'movie'
      ? await tmdbAPI.getTopRatedMovies(page)
      : await tmdbAPI.getTopRatedTV(page);
    return { results: data.results || [], totalPages: data.total_pages || 1, page };
  }
);

export const fetchNowPlaying = createAsyncThunk(
  'movies/fetchNowPlaying',
  async (page = 1) => {
    const data = await tmdbAPI.getNowPlaying(page);
    return data.results || [];
  }
);

export const fetchDetails = createAsyncThunk(
  'movies/fetchDetails',
  async ({ type, id }, { rejectWithValue }) => {
    try {
      return await tmdbAPI.getDetails(type, id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchByGenre = createAsyncThunk(
  'movies/fetchByGenre',
  async ({ type = 'movie', genreId, page = 1 }) => {
    const data = await tmdbAPI.discoverByGenre(type, genreId, page);
    return { results: data.results || [], totalPages: data.total_pages || 1, page };
  }
);

// ── Slice ─────────────────────────────────────────────────────

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    trending:    [],
    popular:     [],
    topRated:    [],
    nowPlaying:  [],
    details:     null,
    totalPages:  1,
    currentPage: 1,
    loading:     false,
    detailsLoading: false,
    error:       null,
  },
  reducers: {
    clearDetails: (state) => { state.details = null; },
    clearMovies:  (state) => { state.popular = []; state.currentPage = 1; },
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrending.fulfilled, (state, { payload }) => {
        state.trending = payload;
      })
      // Popular
      .addCase(fetchPopular.pending,   (state) => { state.loading = true; })
      .addCase(fetchPopular.fulfilled, (state, { payload }) => {
        const { results, totalPages, page } = payload;
        state.popular     = page === 1 ? results : [...state.popular, ...results];
        state.totalPages  = totalPages;
        state.currentPage = page;
        state.loading     = false;
      })
      .addCase(fetchPopular.rejected, (state, { error }) => {
        state.loading = false; state.error = error.message;
      })
      // Top Rated
      .addCase(fetchTopRated.fulfilled, (state, { payload }) => {
        state.topRated = payload.results;
      })
      // Now Playing
      .addCase(fetchNowPlaying.fulfilled, (state, { payload }) => {
        state.nowPlaying = payload;
      })
      // Details
      .addCase(fetchDetails.pending,   (state) => { state.detailsLoading = true; state.error = null; })
      .addCase(fetchDetails.fulfilled, (state, { payload }) => {
        state.details = payload; state.detailsLoading = false;
      })
      .addCase(fetchDetails.rejected,  (state, { payload }) => {
        state.error = payload; state.detailsLoading = false;
      })
      // By Genre
      .addCase(fetchByGenre.pending,   (state) => { state.loading = true; })
      .addCase(fetchByGenre.fulfilled, (state, { payload }) => {
        const { results, totalPages, page } = payload;
        state.popular     = page === 1 ? results : [...state.popular, ...results];
        state.totalPages  = totalPages;
        state.currentPage = page;
        state.loading     = false;
      });
  },
});

export const { clearDetails, clearMovies } = movieSlice.actions;
export default movieSlice.reducer;
