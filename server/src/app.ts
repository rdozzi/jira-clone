// Libraries
import express, { Application } from 'express';
import cors from 'cors';

// Middleware
import { authenticate } from './middleware/authAndLoadInfoMiddleware/authenticate';
import { globalLogMiddleware } from './middleware/logMiddleware';
import { loadUserProjects } from './middleware/authAndLoadInfoMiddleware/loadUserProjects';
import { storeUserAndProjectInfo } from './middleware/authAndLoadInfoMiddleware/storeUserAndProjectInfo';

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
import ticketLabelRoutes from './router/ticketLabelRoutes';
import ticketRoutes from './router/ticketRoutes';
import userRoutes from './router/userRoutes';

export const app: Application = express();

app.use(express.json());
app.use(cors());

// ActivityLog middleware
app.use(globalLogMiddleware());

// Public routes
app.use('/api', setupRoutes);
app.use('/api', authRoutes);

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
