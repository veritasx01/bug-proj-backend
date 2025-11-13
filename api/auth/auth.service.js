import fs from 'fs';
import { makeId } from '../utils/idUtils.js';

export const userService = {
  query,
  getById,
  getByUsername,
  createUser,
  remove,
};

let users = readJsonFile('./data/users.json');

function query(filterBy = {}) {
  let usersToDisplay = users;
  try {
    return usersToDisplay;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const user = users.find((u) => u._id === userId);
    if (!user) throw `couldn't find user with id: ${userId}`;
    return user;
  } catch (err) {
    throw err;
  }
}

async function getByUsername(username) {
  try {
    const user = users.find((u) => u.username === username);
    if (!user) throw `couldn't find user with username: ${username}`;
    return user;
  } catch (err) {
    throw err;
  }
}

async function remove(userId) {
  users = users.filter((b) => b._id !== userId);
  await _saveUsersToFile();
  return Promise.resolve();
}

async function createUser(userToCreate) {
  try {
    if (userToCreate._id) {
      const idx = users.findIndex(
        (user) => user.username === userToCreate.username
      );
      if (idx !== -1) throw `User with id: ${userToCreate._id} already exists`;
    } else {
      userToCreate._id = makeId();
    }
    users.push(userToCreate);
    await _saveUsersToFile();
  } catch (err) {
    throw err;
  }
  return userToCreate;
}

async function save(userToSave) {
  const userExists = false;
  try {
    if (userToSave._id) {
      const idx = users.findIndex((user) => user._id === userToSave._id);
      if (idx === -1) throw `Couldn't update user with _id ${userToSave._id}`;
      users[idx] = { ...users[idx], ...userToSave };
      userExists = true;
    } else {
      userToSave._id = makeId();
      users.push(userToSave);
    }
    await _saveUsersToFile();
    return [userToSave, userExists];
  } catch (err) {
    throw err;
  }
}

function _saveUsersToFile(path = './data/users.json') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 2);
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
