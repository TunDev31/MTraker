import { Skeleton } from "@/components/ui/skeleton";

const DesktopTransactionHistorySkeleton = () => (
  <div className="hidden md:flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-7 w-7 rounded-lg" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
    </div>

    {/* Groups */}
    {[0, 1].map((g) => (
      <div key={g}>
        {/* Group header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        {/* Rows */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    ))}

    {/* Footer */}
    <div className="border-t border-gray-100 px-5 py-3 flex justify-center">
      <Skeleton className="h-4 w-48" />
    </div>
  </div>
);

export default DesktopTransactionHistorySkeleton;
