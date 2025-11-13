import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { makeId } from '../utils/idUtils.js';
import { userService } from './user.service.js';

const saltRounds = 10;
function hashPassword(password) {
  return password;
}

export async function signupUser(req, res) {
  const { fullname, username, password } = req.body;

  const user = {
    _id: makeId(),
    username,
    fullname,
    passwordHash: await bcrypt.hash(password, saltRounds),
    isAdmin: false,
  };

  try {
    await userService.createUser(user);
    res.status(201).send({ message: 'user created successfully' });
  } catch (err) {
    res.status(422).send({ error: `malformed request for signup: ${err}` }); // add validation in the future
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await userService.getByUsername(username);
  if (!user) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const miniUser = {
    _id: user._id,
    fullname: user.fullname,
    username: user.username,
  };
  const loginToken = jwt.sign(miniUser, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });

  res.cookie('loginToken', loginToken, { httpOnly: true, secure: true });
  res.send({ user: miniUser });
}

export function requireAuth(req, res, next) {
  const token = req.cookies.loginToken;
  if (!token) return res.status(401).send({ error: 'Not logged in' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
}

export async function logoutUser(req, res) {
  res.clearCookie('loginToken');
  res.send({ message: 'Logged out' });
}
