import { configureStore } from '@reduxjs/toolkit';
import authReducer         from '../features/auth/authSlice';
import moviesReducer       from '../features/movies/movieSlice';
import favoritesReducer    from '../features/favorites/favoritesSlice';
import historyReducer      from '../features/history/historySlice';
import adminReducer        from '../features/admin/adminSlice';
import notificationReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    movies:       moviesReducer,
    favorites:    favoritesReducer,
    history:      historyReducer,
    admin:        adminReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
