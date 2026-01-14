/**
 * Authentication Controller
 * Handles authentication-related operations
 */

import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!password || (!email && !username)) {
      return res.status(400).json({
        success: false,
        message: 'Email/username and password are required',
      });
    }

    // Find user by email or username using User model
    const user = await User.findByEmailOrUsername(email, username);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!User.isActive(user)) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Update last_login_at using User model
    await User.updateLastLogin(user.id);

    // Return token and sanitized user info (without password_hash)
    const sanitizedUser = User.sanitize(user);

    return res.status(200).json({
      success: true,
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    });
  }
};

/**
 * Register client user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body || {};

    // Basic required field validation
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, username and password are required',
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

    // Create client user (role defaults to client, is_active defaults to true)
    const createdUser = await User.create({
      email,
      username,
      password_hash: passwordHash,
      role: 'client',
      is_active: true,
    });

    const sanitizedUser = User.sanitize(createdUser);

    return res.status(201).json({
      success: true,
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
    });
  }
};
