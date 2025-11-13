import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { bugRoutes } from './api/bug/bug.routes.js';
import cookieParser from 'cookie-parser';
import { authRoutes } from './api/auth/auth.routes.js';
import { userRoutes } from './api/user/user.routes.js';

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use('/api/bug', bugRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.set('query parser', 'extended');
const port = process.env.PORT;
app.listen(port, () => console.log(`Server ready at port ${port}`));
