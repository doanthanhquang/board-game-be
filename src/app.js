/**
 * Express Application Setup
 * Configures and exports the Express app with all middleware and routes
 */

import express from 'express';
import cors from 'cors';
import { corsConfig } from './config/index.js';
import { logger, errorHandler, notFoundHandler } from './middleware/index.js';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Create Express application
const app = express();

// 1. CORS middleware (must be first)
app.use(cors(corsConfig));

// 2. Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Custom middleware
app.use(logger);

// 4. Swagger UI middleware
app.use(
    '/api-docs',
    swaggerUi.serveFiles(swaggerSpec),
    swaggerUi.setup(swaggerSpec, {
      explorer: true, // có dropdown servers
    })
  );

// 5. Routes
app.use('/', routes);

// 6. 404 handler (must be after all routes)
app.use(notFoundHandler);

// 7. Error handler (must be last)
app.use(errorHandler);

export default app;
