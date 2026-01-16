/**
 * Message Routes
 * Defines routes for messaging endpoints
 */

import express from 'express';
import {
  sendMessage,
  getConversation,
  getConversations,
  markConversationRead,
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { validateApiKey } from '../middleware/index.js';

const router = express.Router();

// Apply API key validation to all message routes
router.use(validateApiKey);

/**
 * POST /api/messages
 * Send a message to a friend
 */
router.post('/', authenticate, sendMessage);

/**
 * GET /api/messages/conversations
 * List all conversations with unread status
 */
router.get('/conversations', authenticate, getConversations);

/**
 * GET /api/messages/conversations/:userId
 * Get conversation messages with a specific user
 */
router.get('/conversations/:userId', authenticate, getConversation);

/**
 * PUT /api/messages/conversations/:userId/read
 * Mark conversation as read
 */
router.put('/conversations/:userId/read', authenticate, markConversationRead);

export default router;
