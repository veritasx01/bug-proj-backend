import { utilService } from '../../services/util.service.js';
import { loggerService } from '../../services/logger.service.js';

const users = utilService.readJsonFile('./data/users.json');

export const userService = {
  query,
  getById,
  remove,
  save,
  getByUsername,
  update,
};

async function query() {
  return users;
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);
    if (!user) throw `User not found by userId : ${userId}`;
    return user;
  } catch (err) {
    loggerService.error('userService[getById] : ', err);
    throw err;
  }
}

async function getByUsername(username) {
  try {
    const user = users.find((user) => user.username === username);
    return user;
  } catch (err) {
    loggerService.error('userService[getByUsername] : ', err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const idx = users.findIndex((user) => user._id === userId);
    if (idx === -1) throw `Couldn't find user with _id ${causerIdrId}`;

    users.splice(idx, 1);
    await _saveUsersToFile();
  } catch (err) {
    loggerService.error('userService[remove] : ', err);
    throw err;
  }
}

async function save(user) {
  // Only handles user ADD for now
  try {
    user._id = utilService.makeId();
    user.score = 10000;
    user.createdAt = Date.now();
    if (!user.imgUrl)
      user.imgUrl =
        'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png';

    users.push(user);

    await _saveUsersToFile();
    return user;
  } catch (err) {
    loggerService.error('userService[save] : ', err);
    throw err;
  }
}

function update(updatedUser) {
  const idx = users.findIndex((user) => user._id === updatedUser._id);
  if (idx === -1) throw `user not found, id: ${updatedUser._id}`;
  users[idx] = updatedUser;
  return updatedUser;
}

function _saveUsersToFile() {
  return utilService.writeJsonFile('data/user.json', users);
}
