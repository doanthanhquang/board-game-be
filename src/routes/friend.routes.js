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
 * @swagger
 * /api/friends/search:
 *   get:
 *     summary: Search users
 *     description: Search users by name or email
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (name or email)
 *     responses:
 *       200:
 *         description: Users found
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authenticate, searchUsers);

/**
 * @swagger
 * /api/friends/requests:
 *   post:
 *     summary: Send friend request
 *     description: Send a friend request to another user
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of user to send friend request to
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/requests', authenticate, sendFriendRequest);

/**
 * @swagger
 * /api/friends/requests:
 *   get:
 *     summary: List friend requests
 *     description: List pending friend requests (sent and received)
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Friend requests retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/requests', authenticate, getFriendRequests);

/**
 * @swagger
 * /api/friends/requests/{id}/accept:
 *   put:
 *     summary: Accept friend request
 *     description: Accept a pending friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       404:
 *         description: Friend request not found
 *       401:
 *         description: Unauthorized
 */
router.put('/requests/:id/accept', authenticate, acceptFriendRequest);

/**
 * @swagger
 * /api/friends/requests/{id}:
 *   delete:
 *     summary: Reject or cancel friend request
 *     description: Reject a received friend request or cancel a sent friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request rejected/cancelled successfully
 *       404:
 *         description: Friend request not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/requests/:id', authenticate, rejectFriendRequest);

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: List friends
 *     description: List accepted friends for the authenticated user
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Friends list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getFriends);

export default router;
