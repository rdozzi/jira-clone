import express, { Request, Response, Application } from 'express';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send(
    'Hello! This is your first app with Express.js, Typescript, and Nodemon!'
  );
});

// get all users
app.get('/', (req: Request, res: Response) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.error(error);
  }
});
// get all projects

// get all boards

// get all tickets

// get all comments

// get all attachments

// get all labels

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
