import axiosInstance from './axiosInstance';

const tmdbAPI = {
  // ── Trending ──────────────────────────────────────────
  getTrending: (type = 'movie', timeWindow = 'week') =>
    axiosInstance.get(`/trending/${type}/${timeWindow}`),

  // ── Movies ────────────────────────────────────────────
  getPopularMovies: (page = 1) =>
    axiosInstance.get('/movie/popular', { params: { page } }),

  getTopRatedMovies: (page = 1) =>
    axiosInstance.get('/movie/top_rated', { params: { page } }),

  getNowPlaying: (page = 1) =>
    axiosInstance.get('/movie/now_playing', { params: { page } }),

  getUpcoming: (page = 1) =>
    axiosInstance.get('/movie/upcoming', { params: { page } }),

  getMovieDetails: (id) =>
    axiosInstance.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos,images,similar,recommendations' },
    }),

  // ── TV Shows ──────────────────────────────────────────
  getPopularTV: (page = 1) =>
    axiosInstance.get('/tv/popular', { params: { page } }),

  getTopRatedTV: (page = 1) =>
    axiosInstance.get('/tv/top_rated', { params: { page } }),

  getOnAirTV: (page = 1) =>
    axiosInstance.get('/tv/on_the_air', { params: { page } }),

  getTVDetails: (id) =>
    axiosInstance.get(`/tv/${id}`, {
      params: { append_to_response: 'credits,videos,images,similar,recommendations' },
    }),

  // ── Generic details (movie or tv) ─────────────────────
  getDetails: (type, id) =>
    axiosInstance.get(`/${type}/${id}`, {
      params: { append_to_response: 'credits,videos,images,similar,recommendations' },
    }),

  // ── Discover (genre filter) ───────────────────────────
  discoverByGenre: (type = 'movie', genreId, page = 1) =>
    axiosInstance.get(`/discover/${type}`, {
      params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
    }),

  discoverMovies: (params = {}) =>
    axiosInstance.get('/discover/movie', { params }),

  discoverTV: (params = {}) =>
    axiosInstance.get('/discover/tv', { params }),

  // ── Search ────────────────────────────────────────────
  searchMulti: (query, page = 1) =>
    axiosInstance.get('/search/multi', { params: { query, page } }),

  searchMovies: (query, page = 1) =>
    axiosInstance.get('/search/movie', { params: { query, page } }),

  searchTV: (query, page = 1) =>
    axiosInstance.get('/search/tv', { params: { query, page } }),

  searchPeople: (query, page = 1) =>
    axiosInstance.get('/search/person', { params: { query, page } }),

  // ── People ────────────────────────────────────────────
  getPopularPeople: (page = 1) =>
    axiosInstance.get('/person/popular', { params: { page } }),

  getPersonDetails: (id) =>
    axiosInstance.get(`/person/${id}`, {
      params: { append_to_response: 'movie_credits,tv_credits,images' },
    }),

  // ── Genres ────────────────────────────────────────────
  getMovieGenres: () => axiosInstance.get('/genre/movie/list'),
  getTVGenres:    () => axiosInstance.get('/genre/tv/list'),
};

export default tmdbAPI;
