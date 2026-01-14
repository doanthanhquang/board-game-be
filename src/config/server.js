/**
 * Server Configuration
 * Manages server-related settings like port and environment
 */

export const serverConfig = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};
