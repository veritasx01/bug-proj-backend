export function makeId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  while (length--) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
