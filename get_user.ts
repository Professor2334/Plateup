import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (user) {
    console.log(`Found user: ${user.email}`);
    // Let's just update their password to 'password123' so I can login
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, emailVerified: new Date() }
    });
    console.log(`Updated user ${user.email} with password 'password123' and verified email.`);
  } else {
    console.log("No users found.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
