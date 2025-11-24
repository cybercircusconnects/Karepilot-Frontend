"use client";

export function RecentActivitySkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-5 bg-muted rounded w-32 mb-1"></div>
          <div className="h-3 bg-muted rounded w-48"></div>
        </div>
        <div className="h-8 bg-muted rounded w-20"></div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-muted mt-1.5 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="flex items-center gap-2">
                <div className="h-3 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

