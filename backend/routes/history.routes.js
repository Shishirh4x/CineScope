import { Router } from 'express';
import { getHistory, addHistory, removeHistory, clearHistory } from '../controllers/history.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/',              getHistory);
router.post('/add',          addHistory);
router.delete('/clear',      clearHistory);      // must be before /:movieId
router.delete('/:movieId',   removeHistory);

export default router;
