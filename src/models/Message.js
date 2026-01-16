/**
 * Message Model
 * Handles all message-related database operations
 */

import db from '../db/connection.js';
import { normalizePagination, formatPaginationResponse } from '../db/pagination.js';

/**
 * Message Model Class
 * Encapsulates message database operations following MVC pattern
 */
class Message {
  /**
   * Create a new message
   * @param {Object} messageData - Message data (sender_id, recipient_id, body)
   * @returns {Promise<Object>} Created message object
   */
  static async create(messageData) {
    const [message] = await db('messages')
      .insert({
        sender_id: messageData.sender_id,
        recipient_id: messageData.recipient_id,
        body: messageData.body,
        subject: null, // Not used for simple messaging
        is_read: false,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');
    return message;
  }

  /**
   * Get all messages between two users (conversation)
   * @param {string} userId1 - First user ID
   * @param {string} userId2 - Second user ID
   * @returns {Promise<Array>} Array of messages with sender information
   */
  static async findByConversation(userId1, userId2) {
    const messages = await db('messages')
      .where(function () {
        this.where({ sender_id: userId1, recipient_id: userId2 }).orWhere({
          sender_id: userId2,
          recipient_id: userId1,
        });
      })
      .whereNull('deleted_at')
      .select('messages.*')
      .orderBy('created_at', 'asc');

    // Enrich with sender information
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const sender = await db('users')
          .where({ id: message.sender_id })
          .whereNull('deleted_at')
          .select('id', 'username', 'email')
          .first();

        return {
          ...message,
          sender: sender || null,
        };
      })
    );

    return enrichedMessages;
  }

  /**
   * Mark messages as read in a conversation
   * @param {string} recipientId - User ID who received the messages
   * @param {string} senderId - User ID who sent the messages
   * @returns {Promise<number>} Number of updated messages
   */
  static async markAsRead(recipientId, senderId) {
    const updated = await db('messages')
      .where({ recipient_id: recipientId, sender_id: senderId })
      .where('is_read', false)
      .whereNull('deleted_at')
      .update({
        is_read: true,
        read_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

    return updated;
  }

  /**
   * Get unread message count for a specific conversation
   * @param {string} recipientId - User ID who received the messages
   * @param {string} senderId - User ID who sent the messages
   * @returns {Promise<number>} Count of unread messages
   */
  static async getUnreadCount(recipientId, senderId) {
    const result = await db('messages')
      .where({ recipient_id: recipientId, sender_id: senderId })
      .where('is_read', false)
      .whereNull('deleted_at')
      .count('* as count')
      .first();

    return parseInt(result.count, 10) || 0;
  }

  /**
   * Get all conversations for a user with unread status
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of conversations with friend info and unread count
   */
  static async getConversations(userId) {
    // Get all unique users the current user has messaged with (as sender or recipient)
    const conversations = await db('messages')
      .where(function () {
        this.where('sender_id', userId).orWhere('recipient_id', userId);
      })
      .whereNull('deleted_at')
      .select('sender_id', 'recipient_id')
      .groupBy('sender_id', 'recipient_id');

    // Get unique conversation partners
    const partnerIds = new Set();
    conversations.forEach((conv) => {
      if (conv.sender_id === userId) {
        partnerIds.add(conv.recipient_id);
      } else {
        partnerIds.add(conv.sender_id);
      }
    });

    // Enrich with friend information and unread count
    const enrichedConversations = await Promise.all(
      Array.from(partnerIds).map(async (partnerId) => {
        const partner = await db('users')
          .where({ id: partnerId })
          .whereNull('deleted_at')
          .select('id', 'username', 'email')
          .first();

        // Get unread count (messages sent by partner to current user)
        const unreadCount = await this.getUnreadCount(userId, partnerId);

        // Get most recent message timestamp
        const lastMessage = await db('messages')
          .where(function () {
            this.where({ sender_id: userId, recipient_id: partnerId }).orWhere({
              sender_id: partnerId,
              recipient_id: userId,
            });
          })
          .whereNull('deleted_at')
          .select('created_at')
          .orderBy('created_at', 'desc')
          .first();

        return {
          friend: partner || null,
          unreadCount,
          lastMessageAt: lastMessage?.created_at || null,
        };
      })
    );

    // Filter out null friends and sort by last message time
    return enrichedConversations
      .filter((conv) => conv.friend !== null)
      .sort((a, b) => {
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      });
  }

  /**
   * Get all conversations for a user with unread status (paginated)
   * @param {string} userId - User ID
   * @param {number|string} page - Page number (1-based)
   * @param {number|string} pageSize - Items per page
   * @returns {Promise<Object>} Paginated response with items, page, pageSize, total
   */
  static async getConversationsPaginated(userId, page = 1, pageSize = 10) {
    const { page: safePage, pageSize: safePageSize } = normalizePagination(page, pageSize, 10);

    // Get all conversations first (to get total count)
    const allConversations = await this.getConversations(userId);
    const total = allConversations.length;

    // Apply pagination to sorted conversations
    const offset = (safePage - 1) * safePageSize;
    const paginatedConversations = allConversations.slice(offset, offset + safePageSize);

    return formatPaginationResponse(paginatedConversations, safePage, safePageSize, total);
  }

  /**
   * Format message data with sender information
   * @param {Object} message - Message object from database
   * @param {Object} sender - Sender user object
   * @returns {Object} Formatted message object
   */
  static formatMessage(message, sender) {
    return {
      id: message.id,
      sender_id: message.sender_id,
      recipient_id: message.recipient_id,
      body: message.body,
      is_read: message.is_read,
      read_at: message.read_at,
      created_at: message.created_at,
      updated_at: message.updated_at,
      sender: sender
        ? {
            id: sender.id,
            username: sender.username,
            email: sender.email,
          }
        : null,
    };
  }
}

export default Message;
