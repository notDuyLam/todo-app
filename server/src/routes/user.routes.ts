import express from "express";
import { registerUser, getUserProfile, getAllUser } from '../controllers/user.controller';

const router = express.Router();


// @route POST /api/users/register
router.post('/register', registerUser);

// @route GET /api/users/:id
router.get('/:id', getUserProfile);

// @route GET /api/users/
router.get('/', getAllUser);

// Bạn có thể thêm các route khác ở đây như login, update profile, etc.

export default router;
