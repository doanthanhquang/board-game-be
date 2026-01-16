/**
 * API Key Middleware
 * Validates API key from request headers
 */

export const validateApiKey = (req, res, next) => {
  // Extract API key from header (support both X-API-Key and x-api-key)
  const apiKey = req.headers['x-api-key'] || req.headers['X-API-Key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required',
    });
  }

  // Validate API key against environment variable
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    console.error('API_KEY environment variable is not set');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error',
    });
  }

  if (apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key',
    });
  }

  // API key is valid, proceed to next middleware
  next();
};
