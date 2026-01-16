import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import { app } from './app';

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send(`Server is running on Port: ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
