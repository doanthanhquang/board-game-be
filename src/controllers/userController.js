/**
 * User Controller (Admin)
 * Handles admin user management operations
 */

import bcrypt from 'bcrypt';
import User from '../models/User.js';
import db from '../db/connection.js';
import { normalizePagination, formatPaginationResponse } from '../db/pagination.js';

/**
 * List all users with pagination and search
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const listUsers = async (req, res) => {
  try {
    const { page, pageSize, search, role } = req.query;

    // Normalize pagination parameters
    const { page: currentPage, pageSize: limit, offset } = normalizePagination(page, pageSize, 20, 100);

    // Build query
    let query = db('users').whereNull('deleted_at');

    // Apply search filter (username or email)
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where(function () {
        this.where('username', 'ilike', searchTerm).orWhere('email', 'ilike', searchTerm);
      });
    }

    // Apply role filter
    if (role && (role === 'client' || role === 'admin')) {
      query = query.where({ role });
    }

    // Get total count
    const totalResult = await query.clone().count('* as total').first();
    const total = parseInt(totalResult?.total || 0, 10);

    // Get paginated results
    const users = await query
      .select('id', 'username', 'email', 'role', 'is_active', 'created_at', 'updated_at', 'last_login_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Sanitize user data
    const sanitizedUsers = users.map((user) => User.sanitize(user));

    // Format pagination response
    const pagination = formatPaginationResponse(sanitizedUsers, currentPage, limit, total);

    return res.status(200).json({
      success: true,
      data: pagination,
    });
  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching users',
    });
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Sanitize user data
    const sanitizedUser = User.sanitize(user);

    return res.status(200).json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user',
    });
  }
};

/**
 * Create new user (admin or client)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createUser = async (req, res) => {
  try {
    const { email, username, password, role, is_active } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, username, and password are required',
      });
    }

    // Email format validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Password minimum length
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // Role validation
    const validRole = role === 'admin' ? 'admin' : 'client';
    const userRole = role || 'client';

    // Check for existing email
    const existingByEmail = await User.findByEmail(email);
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email is already in use',
      });
    }

    // Check for existing username
    const existingByUsername = await User.findByUsername(username);
    if (existingByUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username is already in use',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const createdUser = await User.create({
      email,
      username,
      password_hash: passwordHash,
      role: validRole,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
    });

    // Sanitize user data
    const sanitizedUser = User.sanitize(createdUser);

    return res.status(201).json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating user',
    });
  }
};

/**
 * Update user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, role, is_active } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prepare update data
    const updateData = {};

    // Email validation and update
    if (email !== undefined) {
      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email must be a valid string',
        });
      }
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format',
        });
      }
      // Check if email is already in use by another user
      const existingByEmail = await User.findByEmail(email);
      if (existingByEmail && existingByEmail.id !== id) {
        return res.status(409).json({
          success: false,
          message: 'Email is already in use',
        });
      }
      updateData.email = email;
    }

    // Username validation and update
    if (username !== undefined) {
      if (!username || typeof username !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Username must be a valid string',
        });
      }
      // Check if username is already in use by another user
      const existingByUsername = await User.findByUsername(username);
      if (existingByUsername && existingByUsername.id !== id) {
        return res.status(409).json({
          success: false,
          message: 'Username is already in use',
        });
      }
      updateData.username = username;
    }

    // Role validation and update
    if (role !== undefined) {
      if (role !== 'client' && role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Role must be either "client" or "admin"',
        });
      }
      updateData.role = role;
    }

    // Active status update
    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active);
    }

    // Update user if there's data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    const updatedUser = await User.update(id, updateData);

    // Sanitize user data
    const sanitizedUser = User.sanitize(updatedUser);

    return res.status(200).json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating user',
    });
  }
};

/**
 * Delete user (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete user
    await User.softDelete(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting user',
    });
  }
};
