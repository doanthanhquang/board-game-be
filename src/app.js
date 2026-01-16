/**
 * Express Application Setup
 * Configures and exports the Express app with all middleware and routes
 */

import express from "express";
import cors from "cors";
import { corsConfig } from "./config/index.js";
import { logger, errorHandler, notFoundHandler } from "./middleware/index.js";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Create Express application
const app = express();

// 1. CORS middleware (must be first)
app.use(cors(corsConfig));

// 2. Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. Custom middleware
app.use(logger);

// 4. Swagger UI middleware
app.use(
  [
    "/swagger-ui.css",
    "/swagger-ui-bundle.js",
    "/swagger-ui-standalone-preset.js",
    "/swagger-ui.css.map",
    "/swagger-ui-bundle.js.map",
    "/swagger-ui-standalone-preset.js.map",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
  ],
  swaggerUi.serve
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    explorer: true,
    swaggerOptions: {
      url: "/openapi.json", // bạn đã có endpoint này OK rồi
    },
  })
);
app.get("/openapi.json", (_req, res) => {
  res.json(swaggerSpec);
});

// 5. Routes
app.use("/", routes);

// 6. 404 handler (must be after all routes)
app.use(notFoundHandler);

// 7. Error handler (must be last)
app.use(errorHandler);

export default app;
