// components/CardLayoutSkeleton.jsx
const CardLayoutSkeleton = ({ count = 3 }) => {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Header: tiêu đề + nút Chi tiết */}
      <div className="flex items-center justify-between px-2">
        <div className="h-5 w-36 rounded bg-gray-200" />
        <div className="h-5 w-14 rounded bg-gray-200" />
      </div>

      {/* Hàng card cuộn ngang */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory px-2 py-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-[42%] shrink-0 snap-start">
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3">
              {/* tag */}
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              {/* total */}
              <div className="h-6 w-full rounded bg-gray-200" />
              {/* thanh phần trăm */}
              <div className="h-2 w-full rounded-full bg-gray-200" />
              {/* percent */}
              <div className="h-3 w-10 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardLayoutSkeleton;