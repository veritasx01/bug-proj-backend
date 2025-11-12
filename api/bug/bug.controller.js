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
    res.status(404).send({ error: 'Cannot get bugs' });
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
    res.status(429).send({ message: 'Wait for a bit' });
    return;
  }

  try {
    const bug = await bugService.getById(bugId);
    res.status(200).send(bug);
  } catch (err) {
    res.status(404).send({ error: 'Cannot get bug' });
  }
}

export async function removeBug(req, res) {
  try {
    const { bugId } = req.params;
    const isAdmin = req.user.isAdmin;
    if (!isAdmin && bug.creator !== req.user._id) {
      return res.status(403).send({ error: 'Not authorized' });
    }
    const bug = await getById(bugId);
    if (!bug) return res.status(404).send({ error: 'bug not found' });
    await bugService.remove(bugId);
    res.status(204).send({ message: `bug with id: ${bugId} was removed` });
  } catch (err) {
    res.status(400).send({ error: `Cannot remove bug, id:(${bugId})` });
  }
}

export async function updateBug(req, res) {
  const { bugId } = req.params;
  const { title, description, severity, labels } = req.query;
  const queryObject = { title, description, severity, labels };
  let incomingBug = await bugService.getById(bugId);
  const isAdmin = req.user.isAdmin;

  if (!isAdmin && incomingBug.creator !== req.user._id) {
    return res.status(403).send({ error: 'Not authorized' });
  }

  if (!incomingBug) {
    return res.status(404).send({
      error: `the bug that was requested for updating does not exist id: ${bugId}`,
    });
  }
  incomingBug = {
    ...incomingBug,
    ...queryObject,
  };

  try {
    // note the method acts like PATCH, and not like PUT
    await bugService.save(incomingBug);
    res.status(204).send(); // signal the the resource exists and was updated
  } catch (err) {
    res.status(400).send({ error: 'Cannot save bugs' });
  }
}

export async function addBug(req, res) {
  const {
    title,
    severity,
    description,
    createdAt = new Date(),
    labels,
  } = req.body;
  const creator = req.user._id;
  const bugToSave = {
    title,
    severity,
    description,
    createdAt,
    labels,
    creator,
  };
  try {
    const savedBug = await bugService.save(bugToSave);
    res.status(201).send(savedBug);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Cannot save bug' });
  }
}
