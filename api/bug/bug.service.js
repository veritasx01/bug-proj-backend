import fs from 'fs';

export const bugService = {
  query,
  getById,
  save,
  remove,
};

let bugs = readJsonFile('./data/bugs.json');
const PAGE_SIZE = 3;

function _saveBugs() {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(bugs, null, 4));
}

function query(filterBy = {}, sortBy = '', sortDir = 1) {
  let bugsToDisplay = bugs;
  try {
    if (filterBy.title) {
      const regExp = new RegExp(filterBy.title, 'i');
      bugsToDisplay = bugsToDisplay.filter((bug) => regExp.test(bug.title));
    }

    if (filterBy.minSeverity) {
      bugsToDisplay = bugsToDisplay.filter(
        (bug) => bug.severity >= filterBy.minSeverity
      );
    }

    if (filterBy.labels) {
      const safeLabels = Array.isArray(filterBy.labels)
        ? filterBy.labels
        : [filterBy.labels];
      if (safeLabels.length != 0) {
        bugsToDisplay = bugsToDisplay.filter((bug) =>
          safeLabels.some((lbl) => bug.labels.includes(lbl))
        );
      }
    }

    if (sortBy === 'title') {
      bugsToDisplay.sort((a, b) => sortDir * a.title.localeCompare(b.title));
    } else if (sortBy === 'severity') {
      bugsToDisplay.sort((a, b) => sortDir * (a.severity - b.severity));
    } else if (sortBy === 'createdAt') {
      bugsToDisplay = bugsToDisplay.sort(
        (a, b) => sortDir * (a.createdAt - b.createdAt)
      );
    } else {
      bugsToDisplay.sort((a, b) => a.title.localeCompare(b.title));
    }

    if ('pageIdx' in filterBy && filterBy.pageIdx) {
      console.log(filterBy.pageIdx);
      console.log(bugsToDisplay);
      const startIdx = filterBy.pageIdx * PAGE_SIZE;
      bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE);
    }

    return bugsToDisplay;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((b) => b._id === bugId);
    if (!bug) throw `couldn't find bug with id: ${bugId}`;
    return bug;
  } catch (err) {
    throw err;
  }
}

async function remove(bugId) {
  bugs = bugs.filter((b) => b._id !== bugId);
  await _saveBugsToFile();
  return Promise.resolve();
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx === -1) throw `Couldn't update bug with _id ${bugToSave._id}`;
      bugs[idx] = { ...bugs[idx], ...bugToSave };
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
    const data = JSON.stringify(bugs, null, 2);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function readJsonFile(path) {
  const str = fs.readFileSync(path, 'utf8');
  const json = JSON.parse(str);
  return json;
}
