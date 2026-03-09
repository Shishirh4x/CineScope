/**
 * @file routes/auth.routes.js
 * @description Authentication routes.
 */

import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateMe,
  logout,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerRules, loginRules, validate } from '../middleware/validate.middleware.js';

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/register', registerRules, validate, register);
router.post('/login',    loginRules,    validate, login);

// ── Private (JWT required) ────────────────────────────────────────────────────
router.use(protect);

router.get('/me',      getMe);
router.put('/me',      updateMe);
router.post('/logout', logout);

export default router;
