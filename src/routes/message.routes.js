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
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send message
 *     description: Send a message to a friend
 *     tags: [Messages]
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
 *               - recipientId
 *               - content
 *             properties:
 *               recipientId:
 *                 type: integer
 *                 description: ID of message recipient
 *               content:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, sendMessage);

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: List conversations
 *     description: List all conversations with unread status
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations', authenticate, getConversations);

/**
 * @swagger
 * /api/messages/conversations/{userId}:
 *   get:
 *     summary: Get conversation
 *     description: Get conversation messages with a specific user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID of conversation partner
 *     responses:
 *       200:
 *         description: Conversation messages retrieved successfully
 *       404:
 *         description: Conversation not found
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations/:userId', authenticate, getConversation);

/**
 * @swagger
 * /api/messages/conversations/{userId}/read:
 *   put:
 *     summary: Mark conversation as read
 *     description: Mark all messages in a conversation as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID of conversation partner
 *     responses:
 *       200:
 *         description: Conversation marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/conversations/:userId/read', authenticate, markConversationRead);

export default router;
