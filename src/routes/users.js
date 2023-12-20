import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  forgotPassword
} from '../controllers/usersController.js';
import { checkCache } from '../redis/redisCache.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;