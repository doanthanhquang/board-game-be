/**
 * Profile Routes
 * Defines routes for profile management endpoints
 */

import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all profile routes
router.use(validateApiKey);

/**
 * GET /api/profile
 * Get current user's profile with game statistics
 */
router.get('/', authenticate, getProfile);

/**
 * PUT /api/profile
 * Update current user's profile
 */
router.put('/', authenticate, updateProfile);

export default router;
