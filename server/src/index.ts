import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send(
    'Hello! This is your first app with Express.js, Typescript, and Nodemon, AND browser-sync!'
  );
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port} with Nodemon!`);
});
