import { Skeleton } from "@/components/ui/skeleton";

// Skeleton giữ đúng bố cục của PersonalPage để tránh bị giật layout khi dữ liệu tải xong
function PersonalPageSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 p-4"
      aria-busy="true"
      aria-label="Đang tải trang cá nhân"
    >
      {/* Thanh trên: nút quay lại, tiêu đề, nút cài đặt */}
      <div className="flex items-center justify-between p-1">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="size-7 rounded-md" />
      </div>

      {/* Thẻ thông tin người dùng */}
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white p-3">
        {/* Avatar */}
        <Skeleton className="size-24 rounded-full" />

        {/* Tên hiển thị */}
        <Skeleton className="h-7 w-40" />

        {/* @username + icon khóa */}
        <div className="flex items-center justify-center gap-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="size-5 rounded-sm" />
        </div>

        {/* Ngày tham gia */}
        <Skeleton className="h-4 w-48" />

        {/* 3 ô thống kê: Số ví, Giao dịch, Tổng dư */}
        <div className="mt-1 grid w-full grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-between gap-2 rounded-xl bg-[#E5EEFF] px-0.5 py-2"
            >
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PersonalPageSkeleton;