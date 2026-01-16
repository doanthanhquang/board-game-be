/**
 * Health Routes
 * Defines routes for health checks and API info
 */

import express from 'express';
import { getHealth, getApiInfo } from '../controllers/index.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check server health status
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: string
 *                 environment:
 *                   type: string
 */
router.get('/health', getHealth);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API information
 *     description: Get API information and available endpoints
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Board Game API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: object
 */
router.get('/api', getApiInfo);

export default router;
