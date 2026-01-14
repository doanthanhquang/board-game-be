/**
 * CORS Configuration
 * Manages Cross-Origin Resource Sharing settings
 * Note: Currently configured to allow all origins for development
 */

export const corsConfig = {
  origin: '*', // Allow all origins
  credentials: false, // Must be false when origin is '*'
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
