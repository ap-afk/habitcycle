import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://habitcycle.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
  
import userRoutes from './routes/user.routes.js';

app.use('/api/users', userRoutes);
connectDB();


export default app;