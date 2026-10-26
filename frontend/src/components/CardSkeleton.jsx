import { Skeleton } from "./ui/skeleton";

const CardSkeleton = ({ h = "h-64" }) => (
  <div className={`flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${h} animate-pulse`}>
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-48" />
    <div className="flex-1 flex items-center justify-center">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  </div>
);

export default CardSkeleton;