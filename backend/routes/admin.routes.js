import { Router } from 'express';
import {
  adminGetMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getUsers,
  toggleBanUser,
  deleteUser,
  getStats,
} from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

// All admin routes: must be logged in AND be an admin
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', getStats);

// Movie management
router.get('/movies',        adminGetMovies);
router.post('/movies',       createMovie);
router.put('/movies/:id',    updateMovie);
router.delete('/movies/:id', deleteMovie);

// User management
router.get('/users',                   getUsers);
router.put('/ban/:userId',             toggleBanUser);
router.delete('/delete-user/:userId',  deleteUser);

export default router;
