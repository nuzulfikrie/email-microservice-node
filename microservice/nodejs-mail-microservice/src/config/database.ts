import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import dotenv from "dotenv";
import { LoggingService } from "../services/LoggingService";

dotenv.config();
const logger = new LoggingService();

// Database connection configuration
const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10, // Maximum number of clients in the pool
  min: 2, // Minimum number of idle clients maintained in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
};

// Create the connection pool
const pool = new Pool(poolConfig);

// Create the Drizzle database instance
export const db = drizzle(pool, {
  logger: process.env.NODE_ENV !== "production",
});

export const initDatabase = async () => {
  try {
    // Test the connection
    await pool.query("SELECT 1");
    logger.info("Database connection verified");

    // Run migrations if in production, otherwise sync schema
    if (process.env.NODE_ENV === "production") {
      logger.info("Running database migrations...");
      await migrate(db, {
        migrationsFolder: "./drizzle/migrations",
      });
      logger.info("Database migrations completed");
    }

    // Add event listeners for pool
    pool.on("error", (err) => {
      logger.error("Unexpected database pool error:", err);
    });

    pool.on("connect", () => {
      logger.info("New database connection established");
    });

    return db;
  } catch (error) {
    logger.error("Database initialization failed:", error);

    if (error instanceof Error) {
      logger.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    throw new Error("Failed to initialize database connection");
  }
};

// Graceful shutdown helper
export const closeDatabase = async () => {
  try {
    await pool.end();
    logger.info("Database connection pool closed");
  } catch (error) {
    logger.error("Error closing database connection pool:", error);
    throw error;
  }
};

// Export pool for direct access if needed
export const dbPool = pool;
