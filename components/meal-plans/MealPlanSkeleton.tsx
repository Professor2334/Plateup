import React from 'react';

const ShimmerBase = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-[var(--color-surface-container-high)] ${className || ''}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
  </div>
);

export function MealPlanSkeleton() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-3">
          <ShimmerBase className="h-8 w-48 rounded-md" />
          <ShimmerBase className="h-4 w-64 rounded-md" />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <ShimmerBase className="h-10 w-24 rounded-md" />
          <ShimmerBase className="h-10 w-32 rounded-md" />
          <ShimmerBase className="h-10 w-28 rounded-md" />
        </div>
      </div>

      {/* AI Summary Card */}
      <div className="rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[var(--color-outline-variant)]/20">
        <div className="flex gap-4">
          <ShimmerBase className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="space-y-3 w-full">
            <ShimmerBase className="h-5 w-48 rounded-md" />
            <ShimmerBase className="h-4 w-full rounded-md" />
            <ShimmerBase className="h-4 w-5/6 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Layout Flow */}
      <div className="flex flex-col gap-16">
        
        {/* Section 1: Metrics & Meals */}
        <div className="w-full space-y-6 lg:space-y-8">
          
          {/* Overview Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[var(--color-outline-variant)]/20">
                <ShimmerBase className="h-4 w-20 rounded-md mb-4" />
                <ShimmerBase className="h-6 w-16 rounded-md" />
              </div>
            ))}
          </div>

          {/* Daily Meal Cards */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2">
              <ShimmerBase className="h-6 w-32 rounded-md" />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[var(--color-outline-variant)]/20 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)]/30 pb-4 mb-4">
                    <ShimmerBase className="h-5 w-24 rounded-md" />
                    <ShimmerBase className="h-5 w-16 rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <ShimmerBase className="h-4 w-20 rounded-md" />
                      <ShimmerBase className="h-4 w-full rounded-md" />
                    </div>
                    
                    <div className="space-y-3">
                      <ShimmerBase className="h-4 w-20 rounded-md" />
                      <ShimmerBase className="h-4 w-full rounded-md" />
                    </div>
                    
                    <div className="space-y-3">
                      <ShimmerBase className="h-4 w-20 rounded-md" />
                      <ShimmerBase className="h-4 w-full rounded-md" />
                    </div>
                  </div>
                  
                  {/* Card Footer AI Reasoning */}
                  <div className="mt-5 pt-4 border-t border-dashed border-[var(--color-outline-variant)]/20 flex items-center gap-2">
                    <ShimmerBase className="h-3 w-4/5 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
