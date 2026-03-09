import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favorite.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All favorites routes require login
router.use(protect);

router.get('/',                   getFavorites);
router.post('/add',               addFavorite);
router.get('/check/:movieId',     checkFavorite);
router.delete('/remove/:movieId', removeFavorite);

export default router;
