/**
 * JWT Utility Functions
 * Handles JWT token generation and verification
 */

import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user
 * @param {Object} user - User object with id, email, username, role
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};
