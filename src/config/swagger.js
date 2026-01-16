/**
 * Swagger Configuration
 * Configures Swagger UI and OpenAPI specification
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Board Game API',
    version: '1.0.0',
    description: 'RESTful API for board game application with authentication and game management',
  },
  servers: [
    {
      url: process.env.API_BASE_URL,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token for user authentication',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key for client authentication',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
      apiKey: [],
    },
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    join(__dirname, '../routes/*.routes.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
