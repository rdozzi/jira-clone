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
import bannedEmailRoutes from './router/bannedEmailRoutes';
import boardRoutes from './router/boardRoutes';
import commentRoutes from './router/commentRoutes';
import labelRoutes from './router/labelRoutes';
import projectMemberRoutes from './router/projectMemberRoutes';
import projectRoutes from './router/projectRoutes';
import setupRoutes from './router/setupRoutes';
import superUserFunctionRoutes from './router/superUserFunctionRoutes';
import superUserProfileRoutes from './router/superUserProfileRoutes';
import ticketLabelRoutes from './router/ticketLabelRoutes';
import ticketRoutes from './router/ticketRoutes';
import userRoutes from './router/userRoutes';
import otpRoutes from './router/otpRoutes';

export const app: Application = express();

app.use(express.json());
app.use(cors());

// Global rate limiter middleware
app.use(globalRateLimiter);

// Initialize log service PubSub listener
initLogService();

// Public routes
app.use('/api', otpRoutes);
app.use('/api/setup', routeRateLimiter, setupRoutes);
app.use('/api/auth', routeRateLimiter, authRoutes);

// Authentication middleware (for protected routes)
app.use(authenticate);

// Get user project associations
app.use(loadUserProjects);

// Store user and project info in response locals
app.use(storeUserAndProjectInfo);

// Protected routes
app.use('/api', userRoutes);

app.use('/api', bannedEmailRoutes);

app.use('/api', projectRoutes);

app.use('/api', ticketRoutes);

app.use('/api', commentRoutes);

app.use('/api', attachmentRoutes);

app.use('/api', boardRoutes);

app.use('/api', labelRoutes);

app.use('/api', activityLogRoutes);

app.use('/api', projectMemberRoutes);

app.use('/api', ticketLabelRoutes);

app.use('/api/superuser', superUserFunctionRoutes);

app.use('/api/superuser', superUserProfileRoutes);
