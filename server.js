import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { bugRoutes } from './api/bug/bug.routes.js';
import cookieParser from 'cookie-parser';
import { authRoutes } from './api/auth/auth.routes.js';
import { userRoutes } from './api/user/user.routes.js';

const app = express();

const corsOptions = {
  origin: [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'https://bug-proj-backend.onrender.com',
  ],
  credentials: true,
};

console.log('SERVER BOOTED - ACTIVE FILE:', import.meta.url);
app.use(cors(corsOptions));
app.use(express.json());
app.get('/api/bug/test', (req, res) => res.json({ ok: true }));
app.use(express.static('dist'));
app.use(cookieParser());
app.set('query parser', 'extended');

app.use('/api/bug', bugRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});
const port = process.env.PORT;
app.listen(port, () => console.log(`Server ready at port ${port}`));
