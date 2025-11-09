import { bugService } from './bug.service.js';

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
  const { title, minSeverity, sortBy, pageIdx } = req.query;
  let { labels = [], sortDir = 0 } = req.query;
  const filterBy = { title, minSeverity, labels, pageIdx };
  try {
    const bugs = await bugService.query(filterBy, sortBy, sortDir);
    res.status(200).send(bugs);
  } catch (err) {
    res.status(404).send('Cannot get bugs');
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
    res.status(429).send('Wait for a bit');
    return;
  }

  try {
    const bug = await bugService.getById(bugId);
    res.status(200).send(bug);
  } catch (err) {
    res.status(404).send('Cannot get bug');
  }
}

export async function removeBug(req, res) {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.status(204).send;
  } catch (err) {
    res.status(404).send(`Cannot remove bug, id:(${bugId})`);
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
    // note the method acts like PATCH when the object exists and not like PUT
    const [_, bugExists] = await bugService.save(incomingBug);
    if (bugExists)
      res.status(204).send(); // signal the the resource exists and was updated
    else res.status(201).send(); // signal the the resource did not exist and the PUT request created it
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
    res.status(201).send(savedBug);
  } catch (err) {
    console.log(err);
    res.status(400).send('Cannot save bug');
  }
}
