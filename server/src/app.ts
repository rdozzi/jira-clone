import express, { Application } from 'express';
import userRoutes from './router/userRoutes';
import bannedEmailRoutes from './router/bannedEmailRoutes';
import projectRoutes from './router/projectRoutes';
import ticketRoutes from './router/ticketRoutes';
import commentRoutes from './router/commentRoutes';
import attachmentRoutes from './router/attachmentRoutes';
import boardRoutes from './router/boardRoutes';
import labelRoutes from './router/labelRoutes';
import authRoutes from './router/authRoutes';
import activityLogRoutes from './router/activityLogRoutes';
import projectMemberRoutes from './router/projectMemberRoutes';
import ticketLabelRoutes from './router/ticketLabelRoutes';
import cors from 'cors';
import { authenticate } from './middleware/authAndLoadInfoMiddleware/authenticate';
import { loadUserProjects } from './middleware/authAndLoadInfoMiddleware/loadUserProjects';
import { globalLogMiddleware } from './middleware/logMiddleware';
import { storeUserAndProjectInfo } from './middleware/authAndLoadInfoMiddleware/storeUserAndProjectInfo';

export const app: Application = express();

app.use(express.json());
app.use(cors());

// ActivityLog middleware
app.use(globalLogMiddleware());

// Public routes
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
