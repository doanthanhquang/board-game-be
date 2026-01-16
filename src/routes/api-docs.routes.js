/**
 * API Documentation Routes
 * Serves Swagger UI for interactive API documentation
 */

import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/index.js";

const router = express.Router();

/**
 * GET /api-docs
 * Serve Swagger UI documentation
 * Requires authentication (JWT Bearer token) and API key
 */
router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Board Game API Documentation",
  })
);

export default router;
