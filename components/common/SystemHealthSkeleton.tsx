"use client";

export function SystemHealthSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="mb-6">
        <div className="h-5 bg-muted rounded w-32 mb-1"></div>
        <div className="h-3 bg-muted rounded w-48"></div>
      </div>

      <div className="space-y-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-32 mb-1"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
              <div className="h-6 bg-muted rounded w-20"></div>
            </div>
            <div className="h-2 bg-muted rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

