/**
 * Friend Routes
 * Defines routes for friend management endpoints
 */

import express from 'express';
import {
  searchUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
} from '../controllers/friendController.js';
import { authenticate } from '../middleware/auth.js';
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all friend routes
router.use(validateApiKey);

/**
 * GET /api/friends/search?q=query
 * Search users by name or email
 */
router.get('/search', authenticate, searchUsers);

/**
 * POST /api/friends/requests
 * Send friend request
 */
router.post('/requests', authenticate, sendFriendRequest);

/**
 * GET /api/friends/requests
 * List pending friend requests (sent and received)
 */
router.get('/requests', authenticate, getFriendRequests);

/**
 * PUT /api/friends/requests/:id/accept
 * Accept friend request
 */
router.put('/requests/:id/accept', authenticate, acceptFriendRequest);

/**
 * DELETE /api/friends/requests/:id
 * Reject or cancel friend request
 */
router.delete('/requests/:id', authenticate, rejectFriendRequest);

/**
 * GET /api/friends
 * List accepted friends
 */
router.get('/', authenticate, getFriends);

export default router;
