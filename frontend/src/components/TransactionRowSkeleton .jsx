

import { Skeleton } from "@/components/ui/skeleton";

const TransactionRowSkeleton = () => (
  <li className="flex items-center gap-3 px-3 py-3">
    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <Skeleton className="h-4 w-16" />
  </li>
);

export default TransactionRowSkeleton;