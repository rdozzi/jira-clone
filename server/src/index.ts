import express, { Request, Response, Application } from 'express';
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
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticate } from './middleware/authAndLoadInfoMiddleware/authenticate';
import { loadUserProjects } from './middleware/authAndLoadInfoMiddleware/loadUserProjects';
import { globalLogMiddleware } from './middleware/logMiddleware';
import { storeUserAndProjectInfo } from './middleware/authAndLoadInfoMiddleware/storeUserAndProjectInfo';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send(
    'Hello! This is your first app with Express.js, Typescript, and Nodemon!'
  );
});

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

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
