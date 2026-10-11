// MoneyManagerSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

// Dùng lại đúng style thẻ để kích thước khớp 100%
const CARD_STYLE = {
  background:
    "radial-gradient(circle at 15% 10%, #143823 0%, #0a1a11 100%), linear-gradient(135deg, #0e2317 0%, #06120b 100%)",
  border: "1px solid rgba(34, 197, 94, 0.2)",
};

const MoneyManagerSkeleton = () => {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Đang tải ví">
      {/* Thẻ */}
      <div
        style={CARD_STYLE}
        className="relative min-h-52 overflow-hidden rounded-3xl p-5 shadow-lg"
      >
        {/* Hàng trên: combobox + nút cài đặt */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <Skeleton className="h-10 w-40 rounded-md bg-white/10" />
          <Skeleton className="h-8 w-8 rounded-lg bg-white/10" />
        </div>

        {/* Chip + số thẻ */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-8 w-12 rounded-lg bg-white/10" />
          <Skeleton className="h-4 w-28 bg-white/10" />
        </div>

        {/* Số dư */}
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-9 w-56 bg-white/10" />
        </div>
      </div>

      {/* 2 nút hành động */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    </div>
  );
};

export default MoneyManagerSkeleton;