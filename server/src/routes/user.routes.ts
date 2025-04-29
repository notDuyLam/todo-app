import express from "express";
import { registerUser, getUserProfile, getAllUser, deleteUser } from '../controllers/user.controller';

const router = express.Router();


// @route POST /api/users/register
router.post('/register', registerUser);

// @route GET /api/users/:id
router.get('/:id', getUserProfile);

// @route DELETE /api/users/:id
router.delete('/:id', deleteUser);

// @route GET /api/users/
router.get('/', getAllUser);



export default router;
