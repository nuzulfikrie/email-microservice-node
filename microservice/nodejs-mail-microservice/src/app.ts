import 'reflect-metadata';
import express from 'express';
import { initDatabase } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { LoggingService } from './services/LoggingService';
import mailRoutes from './routes/mail.routes';
import templateRoutes from './routes/template.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const port = process.env.PORT || 3000;
const logger = new LoggingService();

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/mail', mailRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 