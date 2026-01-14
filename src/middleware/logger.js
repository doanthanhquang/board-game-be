/**
 * Request Logger Middleware
 * Logs incoming requests and their responses
 */

/**
 * Simple request logger
 * Logs HTTP method, URL, status code, and response time
 */
export const logger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const resetColor = '\x1b[0m';

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${statusColor}${res.statusCode}${resetColor} ${duration}ms`
    );
  });

  next();
};

/**
 * Request body logger (for debugging)
 * Only use in development mode
 */
export const bodyLogger = (req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
};
