import { Skeleton } from "@/components/ui/skeleton";

const DesktopSpendingAnalysisSkeleton = () => (
  <div className="hidden md:flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm mx-2 mb-4 animate-pulse">
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-52" />
      </div>
      <Skeleton className="h-4 w-28" />
    </div>

    {/* Stacked bar */}
    <Skeleton className="h-3 w-full rounded-full" />

    {/* 2-col grid */}
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export default DesktopSpendingAnalysisSkeleton;
