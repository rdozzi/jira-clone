// Libraries
import express, { Application } from 'express';
import cors from 'cors';

// Log Service
import { initLogService } from './services/logService';

// Middleware
import { authenticate } from './middleware/authAndLoadInfoMiddleware/authenticate';
import { loadUserProjects } from './middleware/authAndLoadInfoMiddleware/loadUserProjects';
import { storeUserAndProjectInfo } from './middleware/authAndLoadInfoMiddleware/storeUserAndProjectInfo';
import { globalRateLimiter, routeRateLimiter } from './middleware/rateLimiter';

// Routes
import attachmentRoutes from './router/attachmentRoutes';
import activityLogRoutes from './router/activityLogRoutes';
import authRoutes from './router/authRoutes';
import boardRoutes from './router/boardRoutes';
import commentRoutes from './router/commentRoutes';
import projectMemberRoutes from './router/projectMemberRoutes';
import projectRoutes from './router/projectRoutes';
import setupRoutes from './router/setupRoutes';
import ticketLabelRoutes from './router/ticketLabelRoutes';
import ticketRoutes from './router/ticketRoutes';
import userRoutes from './router/userRoutes';
import otpRoutes from './router/otpRoutes';

export const app: Application = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  })
);

app.use(express.json());

// Global rate limiter middleware
app.use(globalRateLimiter);

// Public health check - In production
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize log service PubSub listener
initLogService();

// Public routes
app.use('/api', otpRoutes);
app.use('/api/setup', routeRateLimiter, setupRoutes);
// app.use('/api/auth', routeRateLimiter, authRoutes);
app.use('/api/auth', authRoutes);

// Authentication middleware (for protected routes)
app.use(authenticate);

// Get user project associations
app.use(loadUserProjects);

// Store user and project info in response locals
app.use(storeUserAndProjectInfo);

// Protected routes
app.use('/api', userRoutes);

app.use('/api', projectRoutes);

app.use('/api', ticketRoutes);

app.use('/api', commentRoutes);

app.use('/api', attachmentRoutes);

app.use('/api', boardRoutes);

app.use('/api', activityLogRoutes);

app.use('/api', projectMemberRoutes);

app.use('/api', ticketLabelRoutes);
