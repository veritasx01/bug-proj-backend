import fs from 'fs';

const STORAGE_FILE = './data/bugs.json';

export const bugService = {
  query,
  getById,
  save,
  remove,
};

let bugs = _loadBugs();

function _loadBugs() {
  try {
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function _saveBugs() {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(bugs, null, 2));
}

function query() {
  return Promise.resolve([...bugs]); // return shallow copy
}

function getById(bugId) {
  const bug = bugs.find((b) => b._id === bugId);
  return Promise.resolve(bug);
}

function remove(bugId) {
  bugs = bugs.filter((b) => b._id !== bugId);
  _saveBugs();
  return Promise.resolve();
}

function save(bug) {
  if (bug._id) {
    // update
    const idx = bugs.findIndex((b) => b._id === bug._id);
    if (idx === -1) {
      return new Error('not found');
    }
    bugs[idx] = bug;
  } else {
    // create
    bug._id = _makeId();
    bugs.push(bug);
  }
  _saveBugs();
  return Promise.resolve(bug);
}

export function _makeId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  while (length--) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
