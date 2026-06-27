'use client';

import { cn } from '@/lib/utils/cn';

interface LoadingSkeletonProps {
  className?: string;
}

function Bone({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[var(--color-dark-card)]',
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-[88px] rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <Bone className="h-10 w-full rounded-lg" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Bone className="h-12 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <Bone key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Bone className="h-8 w-64 rounded-lg" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Bone className="h-48 w-full rounded-xl" />
          <Bone className="h-64 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Bone className="h-48 w-full rounded-xl" />
          <Bone className="h-36 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export { Bone };
