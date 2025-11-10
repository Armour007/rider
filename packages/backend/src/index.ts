import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initPostgres } from './config/database';
import { initMongoDB } from './config/mongodb';
import { initFirebase } from './utils/notifications';
import { GamificationService } from './services/gamification.service';

// Import routes
import handshakeRoutes from './routes/handshake.routes';
import rideRoutes from './routes/ride.routes';
import ondcRoutes from './routes/ondc.routes';
import campaignRoutes from './routes/campaign.routes';
import merchantRoutes from './routes/merchant.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'UMA Backend',
  });
});

// API Routes
app.use('/api/handshake', handshakeRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/ondc', ondcRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    // Initialize databases
    await initPostgres();
    await initMongoDB();
    
    // Initialize Firebase
    initFirebase();

    // Initialize gamification service and cron jobs
    const gamificationService = new GamificationService();
    await gamificationService.initializeBadges();
    gamificationService.initCronJobs();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 UMA Backend Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
