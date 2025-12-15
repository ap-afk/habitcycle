import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import cors from 'cors';
app.use(cors({
    origin: 'https://habitcycle.vercel.app/', // frontend URL
    credentials: true
}));  
import userRoutes from './routes/user.routes.js';

app.use('/api/users', userRoutes);
connectDB();


export default app;