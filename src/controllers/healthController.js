/**
 * Health Controller
 * Handles health check and status endpoints
 */

import { pingDatabase } from '../db/index.js';

const startTime = Date.now();

/**
 * Get server health status
 * @route GET /health
 */
export const getHealth = async (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  // Check database health
  const dbHealth = await pingDatabase();

  // Determine overall health status
  const isHealthy = dbHealth.connected;
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: `${uptime}s`,
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: {
        status: 'healthy',
      },
      database: {
        status: dbHealth.connected ? 'connected' : 'disconnected',
        responseTime: `${dbHealth.responseTime}ms`,
        error: dbHealth.error || undefined,
      },
    },
  });
};

/**
 * Get API information
 * @route GET /api
 */
export const getApiInfo = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Board Game API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      // Future endpoints will be added here
    },
  });
};
