import express from 'express';
import { loginUser, logoutUser, signupUser } from './auth.controller.js';

const router = express.Router();

router.post('/signup', signupUser);
// POST instead of GET for security reasons
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export const authRoutes = router;
