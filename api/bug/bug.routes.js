import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'

const router = express.Router()

router.use((req, res, next) => {
  console.log(`Path triggered: ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)

export const bugRoutes = router