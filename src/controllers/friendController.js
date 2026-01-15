/**
 * Friend Controller
 * Handles friendship-related operations
 */

import Friend from '../models/Friend.js';
import User from '../models/User.js';
import db from '../db/connection.js';

/**
 * Search users by name or email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    // Validate input
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    if (q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    // Search users
    const users = await Friend.searchUsers(q.trim(), userId, 20);

    // Sanitize user data
    const sanitizedUsers = users.map((user) => User.sanitize(user));

    return res.status(200).json({
      success: true,
      data: sanitizedUsers,
    });
  } catch (error) {
    console.error('Search users error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while searching users',
    });
  }
};

/**
 * Send friend request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendFriendRequest = async (req, res) => {
  try {
    const { addressee_id } = req.body;
    const requesterId = req.user.id;

    // Validate input
    if (!addressee_id) {
      return res.status(400).json({
        success: false,
        message: 'addressee_id is required',
      });
    }

    // Prevent self-friendship
    if (requesterId === addressee_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send friend request to yourself',
      });
    }

    // Check if addressee exists
    const addressee = await User.findById(addressee_id);
    if (!addressee) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findByUsers(requesterId, addressee_id);
    if (existingFriendship) {
      if (existingFriendship.status === 'pending') {
        return res.status(409).json({
          success: false,
          message: 'Friend request already exists',
        });
      }
      if (existingFriendship.status === 'accepted') {
        return res.status(409).json({
          success: false,
          message: 'Already friends with this user',
        });
      }
    }

    // Create friend request
    const friendship = await Friend.create({
      requester_id: requesterId,
      addressee_id: addressee_id,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      data: friendship,
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    if (error.code === '23505') {
      // PostgreSQL unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'Friend request already exists',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending friend request',
    });
  }
};

/**
 * Get pending friend requests (sent and received)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Friend.getPendingRequests(userId);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Get friend requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching friend requests',
    });
  }
};

/**
 * Accept friend request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const acceptFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find friendship
    const friendship = await Friend.findById(id);
    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    // Check if user is the addressee
    if (friendship.addressee_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only accept friend requests sent to you',
      });
    }

    // Check if already accepted
    if (friendship.status === 'accepted') {
      return res.status(409).json({
        success: false,
        message: 'Friend request already accepted',
      });
    }

    // Update friendship status
    const updatedFriendship = await Friend.update(id, {
      status: 'accepted',
    });

    return res.status(200).json({
      success: true,
      data: updatedFriendship,
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while accepting friend request',
    });
  }
};

/**
 * Reject or cancel friend request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const rejectFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find friendship
    const friendship = await Friend.findById(id);
    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    // Check if user is authorized (requester or addressee)
    if (friendship.requester_id !== userId && friendship.addressee_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action',
      });
    }

    // Delete friendship
    await Friend.delete(id);

    return res.status(200).json({
      success: true,
      message: 'Friend request rejected/canceled successfully',
    });
  } catch (error) {
    console.error('Reject friend request error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while rejecting friend request',
    });
  }
};

/**
 * Get accepted friends list
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friendships = await Friend.getAcceptedFriends(userId);

    return res.status(200).json({
      success: true,
      data: friendships,
    });
  } catch (error) {
    console.error('Get friends error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching friends',
    });
  }
};
