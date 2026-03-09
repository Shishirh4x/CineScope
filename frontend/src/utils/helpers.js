import { IMG_BASE, IMAGE_SIZES, PLACEHOLDER_POSTER, PLACEHOLDER_BACKDROP, PLACEHOLDER_AVATAR } from './constants';

export const getPosterUrl = (path, size = 'lg') =>
  path ? `${IMG_BASE}${IMAGE_SIZES.poster[size]}${path}` : PLACEHOLDER_POSTER;

export const getBackdropUrl = (path, size = 'xl') =>
  path ? `${IMG_BASE}${IMAGE_SIZES.backdrop[size]}${path}` : PLACEHOLDER_BACKDROP;

export const getProfileUrl = (path, size = 'md') =>
  path ? `${IMG_BASE}${IMAGE_SIZES.profile[size]}${path}` : PLACEHOLDER_AVATAR;

export const getTitle      = (item) => item?.title || item?.name || 'Untitled';
export const getReleaseDate = (item) => item?.release_date || item?.first_air_date || '';
export const getYear       = (item) => getReleaseDate(item).slice(0, 4) || '—';
export const getMediaType  = (item) => item?.media_type || (item?.title ? 'movie' : 'tv');

export const formatRating = (rating) => {
  const n = parseFloat(rating);
  return isNaN(n) ? 'N/A' : n.toFixed(1);
};

export const formatRuntime = (minutes) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

export const truncate = (str, max = 160) =>
  str && str.length > max ? `${str.slice(0, max)}…` : str || 'Description not available.';

export const getYouTubeTrailer = (videos) => {
  if (!videos?.results?.length) return null;
  return (
    videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos.results.find(v => v.site === 'YouTube') ||
    null
  );
};

export const getGenreNames = (genreIds = [], genreList = []) =>
  genreIds.map(id => genreList.find(g => g.id === id)?.name).filter(Boolean);

export const getRatingColor = (rating) => {
  const n = parseFloat(rating);
  if (n >= 8)  return '#3dd68c';
  if (n >= 6)  return '#e8b64a';
  return '#e84040';
};
