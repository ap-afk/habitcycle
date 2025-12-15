import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://habitcycle.vercel.app',
  credentials: true,
}));

app.options('*', cors({
  origin: 'https://habitcycle.vercel.app',
  credentials: true,
}));

import userRoutes from './routes/user.routes.js';
app.use('/api/users', userRoutes);

connectDB();

export default app;
