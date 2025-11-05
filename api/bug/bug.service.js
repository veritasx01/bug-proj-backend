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

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx === -1) throw `Couldn't update bug with _id ${bugToSave._id}`;
      bugs[idx] = bugToSave;
    } else {
      bugToSave._id = _makeId();
      bugs.push(bugToSave);
    }
    await _saveBugsToFile();
    return bugToSave;
  } catch (err) {
    throw err;
  }
}

export function _makeId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  while (length--) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function _saveBugsToFile(path = './data/bugs.json') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
