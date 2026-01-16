/**
 * Authentication Routes
 * Defines routes for authentication endpoints
 */

import express from 'express';
import { login, register } from '../controllers/authController.js';
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all auth routes
router.use(validateApiKey);

/**
 * POST /api/auth/login
 * Login user with email/username and password
 */
router.post('/login', login);

/**
 * POST /api/auth/register
 * Register a new client user
 */
router.post('/register', register);

export default router;
