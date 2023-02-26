import express from 'express';
import { fn } from '../controllers/gig.controller.js';
import { verifyToken } from '../middleware/jwt.js';

const router = express.Router();

router.post('/', verifyToken, createGig)
router.delete('/:id', verifyToken, deleteGig)
router.get('/single/:id', verifyToken, getGig)
router.get('/', verifyToken, getGigs)


export default router;