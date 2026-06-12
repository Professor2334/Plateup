import { DashboardClient } from '@/app/dashboard/DashboardClient';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';

export default function TestTypographyPage() {
  const mockUserData = {
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: true,
    householdSize: '2',
    primaryGoal: 'Save Money',
  };

  return (
    <div className="p-4 bg-[var(--color-surface-container-lowest)] min-h-screen space-y-10">
      <section className="border border-red-500 p-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Onboarding Form Component</h1>
        <OnboardingForm userId="test_user" />
      </section>

      <section className="border border-blue-500 p-4 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Dashboard Components</h1>
        <div className="h-[800px] relative overflow-hidden">
          <DashboardClient
            initialHistory={[]}
            userName="Test User"
            userData={mockUserData}
          />
        </div>
      </section>
    </div>
  );
}
