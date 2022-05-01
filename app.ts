import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

// Express middlewares
app.use(express.json());

// Middlewares
import notFound from './middlewares/not-found';
import errorHandler from './middlewares/error-handler';
import authentication from './middlewares/authentication';

app.use(authentication);

// Routes

app.use(notFound);
app.use(errorHandler);

export default app;
