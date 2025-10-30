import express from 'express';
import { _makeId, bugService } from './bug.service.js';

const app = express();

app.get('/', (req, res) => res.send('Hello there'));
app.listen(3030, () => console.log('Server ready at port 3030'));

app.get('/api/bug', async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (err) {
    console.log(err);
  }
});
app.get('/api/bug/:bugId', async (req, res) => {
  const { bugId } = req.params;
  try {
    const bug = await bugService.getById(bugId);
    res.send(bug);
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

app.post('/api/bug/save', async (req, res) => {
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
