import { Skeleton } from "@/components/ui/skeleton";

const DesktopKpiCardsSkeleton = () => (
  <div className="hidden md:grid grid-cols-4 gap-4 px-2 pt-1 pb-2 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-24 rounded-full" />
        {i === 3 && (
          <div className="space-y-1">
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default DesktopKpiCardsSkeleton;
