import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-line/80', className)}
      aria-hidden
    />
  );
}

export function RecommendationSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Consulting the AI assistant">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[92%]" />
      <Skeleton className="h-4 w-[86%]" />
      <Skeleton className="mt-4 h-4 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[78%]" />
    </div>
  );
}
