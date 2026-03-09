import { Router } from 'express';
import { getMovies, getMovie, getTrending, getPopular, getFeatured } from '../controllers/movie.controller.js';

const router = Router();

// Static routes must come BEFORE /:id to avoid conflicts
router.get('/trending', getTrending);
router.get('/popular',  getPopular);
router.get('/featured', getFeatured);

router.get('/',     getMovies);
router.get('/:id',  getMovie);

export default router;
