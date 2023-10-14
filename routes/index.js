import express from 'express';
import {
  register,
  login,
  logout,
} from '../controllers/AdminController.js';
import dotenv from 'dotenv';
import {refreshToken} from '../controllers/RefreshTokenController.js';

dotenv.config ();

const router = express.Router ();

router.post ('/register', register);
router.post ('/login', login);
router.get ('/refreshToken', refreshToken);
router.delete ('/logout', logout);

export default router;
