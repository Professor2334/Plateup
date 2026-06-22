import db from './lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  const email = 'audit.tester@plateup.com.ng';
  const password = await bcrypt.hash('Testpassword123!', 10);
  
  await db.user.upsert({
    where: { email },
    update: {
      password,
      emailVerified: new Date(),
      onboardingCompleted: true,
      householdSize: '2',
      primaryGoal: ['save-money']
    },
    create: {
      name: 'Audit Tester',
      email,
      password,
      emailVerified: new Date(),
      onboardingCompleted: true,
      householdSize: '2',
      primaryGoal: ['save-money']
    }
  });

  console.log('Test user created/updated successfully.');
  console.log('Email: ' + email);
  console.log('Password: Testpassword123!');
}

seed().catch(console.error).finally(() => process.exit(0));
