import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';

const app: Express = express();

// Express middlewares
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Middlewares
import notFound from './middlewares/not-found';
import errorHandler from './middlewares/error-handler';
import authentication from './middlewares/authentication';
import loginRequired from './middlewares/login-required';

app.use(authentication);

// Routes
import authRouter from './routes/auth';
import userRouter from './routes/user';
import locationRouter from './routes/location';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', loginRequired, userRouter);
app.use('/api/v1/locations', locationRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
