import "dotenv/config";
import app from './app.js';
import { serverConfig } from './config/index.js';
import { testConnection, closeConnection } from './db/index.js';

/**
 * Initialize database connection with retry logic
 */
const initializeDatabase = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting database connection (${i + 1}/${retries})...`);
      const isConnected = await testConnection();
      
      if (isConnected) {
        console.log('✅ Database connected successfully');
        return true;
      }
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error('Failed to connect to database after multiple attempts');
};

/**
 * Start the application
 */
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start server
    const PORT = serverConfig.port;
    const server = app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server is running!`);
      console.log(`📍 Environment: ${serverConfig.env}`);
      console.log(`🌐 Port: ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
      console.log(`📚 API: http://localhost:${PORT}/api`);
      console.log('=================================');
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      // Close server
      server.close(async () => {
        console.log('HTTP server closed');
        
        // Close database connection
        await closeConnection();
        
        console.log('Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
