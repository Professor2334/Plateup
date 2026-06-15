import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

async function main() {
  const db = (await import('./lib/db')).default;
  const user = await db.user.findFirst();
  if (user) {
    console.log(`Found user: ${user.email}`);
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, emailVerified: new Date() }
    });
    console.log(`Updated user ${user.email} with password 'password123' and verified email.`);
  } else {
    console.log("No users found.");
  }
  await db.$disconnect();
}

main().catch(console.error);
