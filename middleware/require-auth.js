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
