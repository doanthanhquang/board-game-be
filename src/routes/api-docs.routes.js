/**
 * API Documentation Routes
 * Serves Swagger UI for interactive API documentation
 */

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/index.js';
import { authenticate, validateApiKey } from '../middleware/index.js';

const router = express.Router();

router.use(swaggerUi.serve);
router.get("/", (req, res) => res.redirect(301, "./"));

/**
 * GET /api-docs
 * Serve Swagger UI documentation
 * Requires authentication (JWT Bearer token) and API key
 */
router.use(
  '/',
  authenticate,
  validateApiKey,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Board Game API Documentation',
  })
);

export default router;
