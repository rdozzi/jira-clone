import express, { Request, Response, Application } from 'express';
import userRoutes from './router/userRoutes';
import projectRoutes from './router/projectRoutes';
import ticketRoutes from './router/ticketRoutes';
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

// get all users
app.use('/api', userRoutes);

// get all projects
app.use('/api', projectRoutes);

// get all tickets
app.use('/api', ticketRoutes);

// get all boards

// get all comments

// get all attachments

// get all labels

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
