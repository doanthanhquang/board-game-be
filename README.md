# Board Game Backend API

A RESTful API backend for a board game application built with Express.js and MVC architecture using JavaScript.

## 🚀 Features

- **MVC Architecture**: Clean separation of Models, Controllers, and Routes
- **RESTful API**: Standard HTTP methods and status codes
- **Interactive API Documentation**: Swagger UI with automatic documentation generation
- **Database Integration**: Knex.js query builder with Supabase PostgreSQL
- **Database Migrations**: Version-controlled schema management
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with detailed error messages
- **Request Validation**: Input validation and sanitization middleware
- **Request Logging**: Automatic logging of all HTTP requests
- **Environment Configuration**: dotenv for environment variable management
- **ES6+ JavaScript**: Modern JavaScript features without TypeScript complexity

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier available at https://supabase.com)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd board-game-be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Set up Supabase database:
   - Create a new project at https://supabase.com
   - Go to Project Settings > Database
   - Copy your database credentials

5. Configure environment variables in `.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration  
CORS_ORIGIN=*

# API Key Configuration
API_KEY=your-secret-api-key-here

# Or use connection string (alternative)
# DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

6. Run database migrations:
```bash
npm run migrate:latest
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The server will start with nodemon and automatically restart on file changes.

### Production Mode
```bash
npm start
```
The server will start without auto-restart.

## 📚 API Documentation

### Interactive API Documentation (Swagger)

The API includes interactive Swagger UI documentation that provides:
- Complete endpoint documentation with request/response schemas
- Interactive API testing directly from the browser
- Authentication support for testing protected endpoints

**Access Swagger UI:**
- URL: `http://localhost:3001/api-docs`
- **Authentication Required**: You must be logged in (JWT Bearer token) and provide a valid API key to access the documentation

**How to Use:**
1. Log in to the application to obtain a JWT token
2. Navigate to `/api-docs` in your browser
3. Click the "Authorize" button in Swagger UI
4. Enter your JWT token in the `bearerAuth` field (format: `Bearer <your-token>`)
5. Enter your API key in the `apiKey` field
6. Click "Authorize" to authenticate
7. You can now test API endpoints directly from the Swagger UI

**Note**: The Swagger UI route is protected with both JWT authentication and API key validation for security.

### Base URL
```
http://localhost:3001
```

### Health Check

#### GET /health
Check server health status.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-14T12:00:00.000Z",
  "uptime": "120s",
  "environment": "development"
}
```

#### GET /api
Get API information.

**Response:**
```json
{
  "success": true,
  "message": "Board Game API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health"
  }
}
```

### Future API Endpoints

Game and Player API endpoints will be implemented in future updates.

## 🗄️ Database

### Supabase PostgreSQL

This project uses Supabase as the PostgreSQL database provider. Supabase offers:
- Managed PostgreSQL database
- Automatic backups
- Connection pooling
- Free tier for development

### Database Migrations

Migrations are managed using Knex.js for version-controlled schema changes.

#### Create a new migration
```bash
npm run migrate:make create_users_table
```

#### Run pending migrations
```bash
npm run migrate:latest
```

#### Rollback last migration batch
```bash
npm run migrate:rollback
```

#### Check migration status
```bash
npm run migrate:status
```

### Migration File Structure

Migrations are located in `src/db/migrations/` and follow this structure:

```javascript
export const up = async (knex) => {
  // Schema changes to apply
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  // Rollback changes
  await knex.schema.dropTable('users');
};
```

### Database Utilities

The application provides several database utilities:

- **Transaction Wrapper**: `withTransaction(callback)` - Automatically handles commit/rollback
- **Error Formatting**: `formatDatabaseError(error)` - Formats database errors consistently
- **Table Existence Check**: `tableExists(tableName)` - Check if a table exists
- **Database Version**: `getDatabaseVersion()` - Get PostgreSQL version
- **Pool Stats**: `getPoolStats()` - Get connection pool statistics

Example usage:
```javascript
import { withTransaction, db } from './db/index.js';

// Using transaction wrapper
const result = await withTransaction(async (trx) => {
  await trx('users').insert({ name: 'John' });
  await trx('profiles').insert({ user_id: 1, bio: 'Hello' });
  return { success: true };
});
```

## 🏗️ Project Structure

```
board-game-be/
├── src/
│   ├── config/              # Configuration files
│   │   ├── server.js        # Server configuration
│   │   ├── cors.js          # CORS configuration
│   │   ├── database.js      # Database configuration
│   │   └── index.js         # Export all configs
│   ├── middleware/          # Custom middleware
│   │   ├── errorHandler.js  # Error handling
│   │   ├── logger.js        # Request logging
│   │   ├── validator.js     # Input validation
│   │   └── index.js         # Export all middleware
│   ├── models/              # Data models
│   │   ├── BaseModel.js     # Base model class
│   │   └── index.js         # Export all models
│   ├── controllers/         # Request handlers
│   │   ├── healthController.js
│   │   └── index.js
│   ├── routes/              # Route definitions
│   │   ├── health.routes.js
│   │   └── index.js
│   ├── app.js               # Express app setup
│   └── index.js             # Entry point
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |
| `API_KEY` | API key for request authentication (required) | - |
| `SUPABASE_DB_HOST` | Supabase database host | `localhost` |
| `SUPABASE_DB_PORT` | Database port | `5432` |
| `SUPABASE_DB_NAME` | Database name | `postgres` |
| `SUPABASE_DB_USER` | Database user | `postgres` |
| `SUPABASE_DB_PASSWORD` | Database password | `` |
| `SUPABASE_DB_SSL` | Enable SSL connection | `true` |
| `DATABASE_URL` | Full connection string (alternative) | - |
| `DB_POOL_MIN` | Minimum connection pool size | `2` |
| `DB_POOL_MAX` | Maximum connection pool size | `10` |

## 🧪 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "success": false,
  "status": 400,
  "message": "Error message here",
  "stack": "Stack trace (development only)"
}
```

## 🔐 Security Features

- **API Key Authentication**: All API endpoints (except health checks) require a valid API key in the `X-API-Key` header
- Input sanitization to prevent XSS attacks
- CORS configuration for cross-origin security
- Request body size limits
- Environment-based configuration

## 🔧 Troubleshooting

### Database Connection Issues

**Problem**: `Failed to connect to database`
- **Solution**: Check your Supabase credentials in `.env`
- Verify your IP is allowed in Supabase dashboard (Settings > Database > Connection Pooling)
- Ensure `SUPABASE_DB_SSL=true` is set

**Problem**: `Connection timeout`
- **Solution**: Check if you're using the correct Supabase host (should be `db.xxxxx.supabase.co`)
- Try using the connection string format instead of individual parameters

**Problem**: `SSL connection error`
- **Solution**: Make sure `SUPABASE_DB_SSL=true` is set
- For local development without SSL, set `SUPABASE_DB_SSL=false`

**Problem**: `Too many connections`
- **Solution**: Reduce `DB_POOL_MAX` value
- Check for connection leaks in your code
- Use Supabase connection pooler endpoint (port 6543)

### Migration Issues

**Problem**: `Migration failed`
- **Solution**: Check migration syntax
- Ensure database connection is working
- Run `npm run migrate:status` to see migration state

**Problem**: `Migration already exists`
- **Solution**: Migrations are timestamped, just create a new one with a different name

## 📝 Notes

- **Database Integration**: Uses Knex.js with Supabase PostgreSQL for data persistence
- **MVC Structure**: The project follows MVC architecture with clear separation of concerns
- **Migrations**: Database schema is version-controlled using Knex migrations
- **No Authentication**: Authentication and authorization will be implemented in a separate change
- **API Versioning**: Future API endpoints will use `/api/v1` prefix for version compatibility

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC
