/**
 * Authentication Routes
 * Defines routes for authentication endpoints
 */

import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login user with email/username and password
 */
router.post('/login', login);

export default router;
