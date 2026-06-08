import React from 'react';

export function MealPlanSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-1/3 animate-pulse rounded-md bg-[var(--color-surface-container-high)]"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="border border-[var(--color-outline-variant)] rounded-lg p-4 space-y-4">
            <div className="h-6 w-24 animate-pulse rounded bg-[var(--color-primary)] opacity-50"></div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-container-high)]"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--color-surface-container-high)]"></div>
              <div className="h-4 w-4/6 animate-pulse rounded bg-[var(--color-surface-container-high)]"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-[var(--color-outline-variant)] rounded-lg p-4 space-y-4 mt-8">
        <div className="h-6 w-40 animate-pulse rounded bg-[var(--color-primary)] opacity-50"></div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-container-high)]"></div>
          <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-container-high)]"></div>
        </div>
      </div>
    </div>
  );
}
