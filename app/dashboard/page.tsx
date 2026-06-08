import { auth } from '@/lib/auth';
import { DashboardClient } from './DashboardClient';
import { redirect } from 'next/navigation';
import { getMealHistory } from '@/app/actions/meal-plans/actions';
import db from '@/lib/db';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect('/auth/login');
  }

  const mealHistory = await getMealHistory();

  return (
    <DashboardClient 
      initialHistory={mealHistory} 
      userName={user.name || 'User'} 
      userData={{
        name: user.name || '',
        email: user.email || '',
        emailVerified: user.emailVerified || false,
        householdSize: user.householdSize || '',
        primaryGoal: user.primaryGoal || ''
      }}
    />
  );
}
