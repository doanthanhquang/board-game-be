/**
 * Message Controller
 * Handles message-related operations
 */

import Message from '../models/Message.js';
import Friend from '../models/Friend.js';
import User from '../models/User.js';
import db from '../db/connection.js';

/**
 * Send a message to a friend
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendMessage = async (req, res) => {
  try {
    const { recipient_id, body } = req.body;
    const senderId = req.user.id;

    // Validate input
    if (!recipient_id) {
      return res.status(400).json({
        success: false,
        message: 'recipient_id is required',
      });
    }

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message body is required and cannot be empty',
      });
    }

    // Prevent self-messaging
    if (senderId === recipient_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself',
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipient_id);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    // Validate that recipient is a friend
    const friendship = await Friend.findByUsers(senderId, recipient_id);
    if (!friendship || friendship.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        message: 'You can only send messages to accepted friends',
      });
    }

    // Create message
    const message = await Message.create({
      sender_id: senderId,
      recipient_id: recipient_id,
      body: body.trim(),
    });

    // Enrich with sender information
    const sender = await User.findById(senderId);
    const formattedMessage = Message.formatMessage(message, sender);

    return res.status(201).json({
      success: true,
      data: formattedMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending message',
    });
  }
};

/**
 * Get conversation messages with a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId parameter is required',
      });
    }

    // Check if user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Validate that user is a friend
    const friendship = await Friend.findByUsers(currentUserId, userId);
    if (!friendship || friendship.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        message: 'You can only view conversations with accepted friends',
      });
    }

    // Get conversation messages
    const messages = await Message.findByConversation(currentUserId, userId);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching conversation',
    });
  }
};

/**
 * List all conversations with unread status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, pageSize } = req.query;

    // Get paginated conversations
    const pagination = await Message.getConversationsPaginated(userId, page, pageSize);

    return res.status(200).json({
      success: true,
      data: pagination,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching conversations',
    });
  }
};

/**
 * Mark conversation as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const markConversationRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId parameter is required',
      });
    }

    // Check if user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Validate that user is a friend
    const friendship = await Friend.findByUsers(currentUserId, userId);
    if (!friendship || friendship.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        message: 'You can only mark conversations with accepted friends as read',
      });
    }

    // Mark messages as read (messages sent by otherUser to currentUser)
    const updatedCount = await Message.markAsRead(currentUserId, userId);

    return res.status(200).json({
      success: true,
      message: 'Conversation marked as read',
      data: { updatedCount },
    });
  } catch (error) {
    console.error('Mark conversation read error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while marking conversation as read',
    });
  }
};
