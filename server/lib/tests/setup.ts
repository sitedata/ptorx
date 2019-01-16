import { MySQL } from 'lib/MySQL';

export async function setupTests() {
  const db = new MySQL();
  await db.query('DELETE FROM users WHERE userId = 1234 OR userId = 12345');
  await db.query(
    'INSERT INTO users (userId, credits) VALUES (1234, 5), (12345, 5)'
  );
  db.release();
}
