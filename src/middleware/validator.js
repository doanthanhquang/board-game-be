/**
 * Validation Middleware
 * Provides request validation utilities
 */

/**
 * Validate required fields in request body
 * @param {string[]} requiredFields - Array of required field names
 */
export const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Validation failed',
        errors: {
          missingFields,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        },
      });
    }

    next();
  };
};

/**
 * Validate request body is not empty
 */
export const validateBodyNotEmpty = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Request body cannot be empty',
    });
  }
  next();
};

/**
 * Validate ID parameter
 * Checks if the ID parameter exists and is valid
 */
export const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `${paramName} parameter is required`,
      });
    }

    // Basic validation - can be extended based on ID format requirements
    if (typeof id !== 'string' || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Invalid ${paramName} format`,
      });
    }

    next();
  };
};

/**
 * Sanitize input strings
 * Basic XSS prevention by escaping HTML characters
 */
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize({ ...req.body });
  }

  next();
};
