import { auth } from '@/lib/auth';
import { DashboardClient } from './DashboardClient';
import { redirect } from 'next/navigation';
import { getMealHistory } from '@/app/actions/meal-plans/actions';
import db from '@/lib/db';
import { Suspense } from 'react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Run both DB queries in parallel — no sequential blocking
  const [user, mealHistory] = await Promise.all([
    db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        householdSize: true,
        primaryGoal: true,
        // password intentionally excluded
      },
    }),
    getMealHistory(),
  ]);

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9fafb] animate-pulse" />}>
      <DashboardClient 
        initialHistory={mealHistory} 
        userName={user.name || 'User'} 
        userData={{
          name: user.name || '',
          email: user.email || '',
          emailVerified: user.emailVerified !== null,
          householdSize: user.householdSize || '',
          primaryGoal: user.primaryGoal || ''
        }}
      />
    </Suspense>
  );
}
