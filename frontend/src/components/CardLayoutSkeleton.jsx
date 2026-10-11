import { Skeleton } from "@/components/ui/skeleton";

const CardLayoutSkeleton = () => (
  <div className="flex flex-col" aria-busy="true" aria-label="Đang tải thống kê">
    <div className="flex items-center justify-between px-2">
      <h1 className="font-bold">Thống kê chi tiêu</h1>
      <Skeleton className="h-4 w-14" />
    </div>
    <div className="flex gap-2 overflow-hidden px-2 py-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-[42%] shrink-0">
          {/* chỉnh h-28 cho bằng chiều cao CardItem thật */}
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  </div>
);

export default CardLayoutSkeleton;