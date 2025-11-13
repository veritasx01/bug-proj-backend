import express from 'express';
import {
  addBug,
  getBug,
  getBugs,
  removeBug,
  updateBug,
} from './bug.controller.js';
import { requireAuth } from '../../middleware/require-auth.js';

const router = express.Router();

router.use((req, res, next) => {
  console.log(`Path triggered: ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/', getBugs);
router.get('/:bugId', getBug);
router.delete('/:bugId', requireAuth, removeBug);
router.put('/:bugId', requireAuth, updateBug);
router.post('/', requireAuth, addBug);

export const bugRoutes = router;
