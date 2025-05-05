import express, { Request, Response, Application } from 'express';
import userRoutes from './router/userRoutes';
import projectRoutes from './router/projectRoutes';
import ticketRoutes from './router/ticketRoutes';
import commentRoutes from './router/commentRoutes';
import attachmentRoutes from './router/attachmentRoutes';
import boardRoutes from './router/boardRoutes';
import labelRoutes from './router/labelRoutes';
import authRoutes from './router/authRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
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

app.use('/api', userRoutes);

app.use('/api', projectRoutes);

app.use('/api', ticketRoutes);

app.use('/api', commentRoutes);

app.use('/api', attachmentRoutes);

app.use('/api', boardRoutes);

app.use('/api', labelRoutes);

app.use('/api', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
