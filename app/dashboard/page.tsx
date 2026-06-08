import { auth } from '@/lib/auth';
import { DashboardClient } from './DashboardClient';
import { redirect } from 'next/navigation';
import { getMealHistory } from '@/app/actions/meal-plans/actions';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const mealHistory = await getMealHistory();

  return (
    <div className="min-h-screen bg-[var(--color-surface-lowest)]">
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">PlateUp Dashboard</h1>
          <div className="text-sm text-[var(--color-on-surface-variant)]">
            Welcome, {session.user.name || 'User'}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DashboardClient initialHistory={mealHistory} />
      </main>
    </div>
  );
}
