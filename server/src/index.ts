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
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticate } from './middleware/authenticate';
import { loadUserProjects } from './middleware/loadUserProjects';
import { globalLogMiddleware } from './middleware/logMiddleware';

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

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
