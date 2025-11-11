import express from 'express';
import { loginUser, logoutUser, signupUser } from './user.controller.js';

const router = express.Router();

router.post('/signup', signupUser);
// POST instead of GET for security reasons
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export const userRoutes = router;
