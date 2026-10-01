import React from "react";
import { cn } from "@/lib/utils";
import TransactionsIcon from "./TransactionsIcon";

// Tên hiển thị và tông màu theo tag. Thêm danh mục mới tại đây.
const CATEGORY_META = {
  food: { label: "Ăn uống", tone: "amber" },
  shopping: { label: "Mua sắm", tone: "purple" },
  travel: { label: "Di chuyển", tone: "sky" },
  khac: { label: "Khác", tone: "gray" },
};

// Viết đủ tên class để Tailwind nhận diện được
const TONES = {
  amber: { icon: "bg-amber-100", chip: "bg-amber-100 text-amber-700", bar: "bg-amber-400" },
  purple: { icon: "bg-purple-100", chip: "bg-purple-100 text-purple-700", bar: "bg-purple-400" },
  sky: { icon: "bg-sky-100", chip: "bg-sky-100 text-sky-700", bar: "bg-sky-400" },
  gray: { icon: "bg-gray-100", chip: "bg-gray-100 text-gray-600", bar: "bg-gray-400" },
};

const capitalize = (s) => {
  if (typeof s !== "string" || !s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const CardItem = ({ tag, total, percent }) => {
  const meta = CATEGORY_META[tag] ?? { label: capitalize(tag), tone: "gray" };
  const tone = TONES[meta.tone] ?? TONES.gray;;
  const barPercent = Math.max(0, Math.min(100, percent));

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-sm">
      {/* Icon + phần trăm */}
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            tone.icon,
          )}
        >
          <TransactionsIcon type={tag} />
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
            tone.chip,
          )}
        >
          {percent}%
        </span>
      </div>

      {/* Tên + số tiền */}
      <div className="min-w-0">
        <p className="truncate text-sm text-gray-500">{meta.label}</p>
        <p className="truncate text-base font-bold tabular-nums text-gray-900">
          {Number(total).toLocaleString("vi-VN")} đ
        </p>
      </div>

      {/* Thanh tỉ trọng */}
      <div
        role="progressbar"
        aria-valuenow={barPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${meta.label} chiếm ${percent}% tổng chi`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", tone.bar)}
          style={{ width: `${barPercent}%` }}
        />
      </div>
    </div>
  );
};

export default CardItem;