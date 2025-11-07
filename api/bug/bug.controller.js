import { _makeId, bugService } from './bug.service.js';

const LABELS = [
  'unit-tests',
  'hotfix',
  'refactor',
  'security-check',
  'pending-review',
  'merge-ready',
  'deprecated',
  'feature-request',
  'bug-blocker',
  'staging',
];

export async function getBugs(req, res) {
  const { title, severity, sortBy, pageIdx } = req.query;
  let { labels, sortDir = 1 } = req.query;
  const filterBy = { title, severity: severity, labels, pageIdx };
  try {
    const bugs = await bugService.query(filterBy, sortBy, sortDir);
    res.send(bugs);
  } catch (err) {
    res.status(400).send('Cannot get bugs');
  }
}

export async function getBug(req, res) {
  const { bugId } = req.params;

  let visitCount = req.cookies.visitCount || [];
  visitCount.push(bugId);
  // cast to array -> set -> array
  // to erase duplicates
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
    res.status(400).send('Cannot get bug');
  }
}

export async function removeBug(req, res) {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.send('removed');
  } catch (err) {
    res.status(400).send(`Cannot remove bug, id:(${bugId})`);
  }
}

export async function updateBug(req, res) {
  const { bugId } = req.params;
  const queryObject = req.query;
  console.log(queryObject);
  let incomingBug = await bugService.getById(bugId);
  incomingBug = {
    ...incomingBug,
    ...queryObject,
  };

  try {
    await bugService.save(incomingBug);
    res.send(incomingBug);
  } catch (err) {
    res.status(400).send('Cannot save bugs');
  }
}

export async function addBug(req, res) {
  const {
    title = '',
    severity = '',
    description = '',
    createdAt = '',
    labels = [],
  } = req.params;
  const bugToSave = { title, severity, description, createdAt, labels };
  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    console.log(err);
    res.status(400).send('Cannot save bug');
  }
}
