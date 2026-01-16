/**
 * Configuration Module
 * Central export point for all configuration settings
 */

import { serverConfig } from './server.js';
import { corsConfig } from './cors.js';
import { databaseConfig } from './database.js';
import swaggerSpec from './swagger.js';

export { serverConfig, corsConfig, databaseConfig, swaggerSpec };
