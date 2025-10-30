import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { _makeId, bugService } from './bug.service.js';

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hello there'));
app.listen(3030, () => console.log('Server ready at port 3030'));

app.get('/api/bug/save', async (req, res) => {
  const queryObject = req.query;
  const incomingBug = {
    title: queryObject.title,
    severity: +queryObject.severity,
    description: queryObject.description,
    createdAt: new Date(),
  };

  try {
    await bugService.save(incomingBug);
    res.send(incomingBug);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/bug/:bugId', async (req, res) => {
  const { bugId } = req.params;
  let visitCount = req.cookies.visitCount || [];
  visitCount.push(bugId);
  // cast to array -> set -> array
  // to erase duplicates
  visitCount = [...new Set(visitCount)];
  res.cookie('visitCount', visitCount, { maxAge: 1000 * 7 });
  console.log(visitCount.length);
  if (visitCount.length > 3) {
    res.status(401).send('Wait for a bit');
    return;
  }
  try {
    const bug = await bugService.getById(bugId);
    res.send(bug);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/bug', async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/bug/:bugId/remove', async (req, res) => {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.send('removed');
  } catch (err) {
    console.log(err);
  }
});
