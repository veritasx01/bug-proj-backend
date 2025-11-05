import express from 'express';
import cors from 'cors';
import { bugRoutes } from './api/bug/bug.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.set('query parser', 'extended');

app.use('/api/bug', bugRoutes);

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(3030, () => console.log('Server ready at port 3030'));
