import express, { Request, Response, Application } from 'express';
import userRoutes from './router/userRoutes';
import projectRoutes from './router/projectRoutes';
import ticketRoutes from './router/ticketRoutes';
import commentRoutes from './router/commentRoutes';
import attachmentRoutes from './router/attachmentRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

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

app.use('/api', userRoutes);

app.use('/api', projectRoutes);

app.use('/api', ticketRoutes);

app.use('/api', commentRoutes);

app.use('/api', attachmentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
