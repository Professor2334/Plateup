import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  try {
    const db = (await import('../lib/db')).default;
    console.log('Testing DB connection...');
    const userCount = await db.user.count();
    console.log('DB Connection successful. User count:', userCount);
  } catch (error) {
    console.error('DB Connection failed:', error);
  }
}

main();
