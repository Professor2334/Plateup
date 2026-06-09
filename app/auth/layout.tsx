import { ReactNode } from 'react';
import AuthRightPanel from './AuthRightPanel';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Left side: Auth forms */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-24 bg-background lg:w-[45%] lg:flex-none">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {children}
        </div>
      </div>
      
      {/* Right side: Dynamic Illustration and copy */}
      <AuthRightPanel />
    </div>
  );
}
