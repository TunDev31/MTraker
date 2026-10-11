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

const TransactionTableSkeleton = ({ rows = 4 }) => (
  <div
    className="mt-3 mb-16 flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
    aria-busy="true"
    aria-label="Đang tải giao dịch"
  >
    <div>
      {/* Header: tiêu đề + 2 nút mũi tên */}
      <div className="flex items-center justify-between border-b border-black/5 px-3 py-2">
        <Skeleton className="h-4 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </div>

      {/* Danh sách */}
      <ul className="divide-y divide-black/5">
        {Array.from({ length: rows }).map((_, i) => (
          <TransactionRowSkeleton key={i} />
        ))}
      </ul>
    </div>

    {/* Phân trang */}
    <div className="flex justify-center p-3">
      <Skeleton className="h-6 w-24" />
    </div>
  </div>
);

export default TransactionTableSkeleton;