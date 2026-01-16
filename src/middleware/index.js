/**
 * Middleware Module
 * Central export point for all middleware functions
 */

import { errorHandler, notFoundHandler, asyncHandler } from './errorHandler.js';
import { logger, bodyLogger } from './logger.js';
import {
  validateRequiredFields,
  validateBodyNotEmpty,
  validateId,
  sanitizeInput,
} from './validator.js';
import { authenticate } from './auth.js';
import { requireRole } from './role.js';
import { validateApiKey } from './apiKey.js';

export {
  // Error handling
  errorHandler,
  notFoundHandler,
  asyncHandler,
  // Logging
  logger,
  bodyLogger,
  // Validation
  validateRequiredFields,
  validateBodyNotEmpty,
  validateId,
  sanitizeInput,
  // Auth
  authenticate,
  requireRole,
  validateApiKey,
};
