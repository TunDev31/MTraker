import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { TAG_CONFIG } from "@/components/UpdatingTransForm";
import TransactionsIcon from "@/components/TransactionsIcon";
import { cn } from "@/lib/utils";

// ── Tag color palette ────────────────────────────────────────────────────────
const TAG_COLORS = {
  food:          "#f59e0b",
  travel:        "#3b82f6",
  entertainment: "#8b5cf6",
  shopping:      "#f97316",
  khac:          "#6b7280",
  transfer:      "#10b981",
  none:          "#d1d5db",
};

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");

function getPeriodLabel(filter, offset) {
  if (offset === 0) {
    if (filter === "month") return `Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    if (filter === "year")  return `Năm ${new Date().getFullYear()}`;
    return "Hôm nay";
  }
  const d = new Date();
  if (filter === "month") { d.setDate(1); d.setMonth(d.getMonth() - offset); return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`; }
  if (filter === "year")  { d.setFullYear(d.getFullYear() - offset); return `Năm ${d.getFullYear()}`; }
  d.setDate(d.getDate() - offset);
  return d.toLocaleDateString("vi-VN");
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DesktopSpendingAnalysis({ selectedDateFilter, offSet }) {
  const report = useTransactionsStore((s) => s.report);

  const items = (report?.byTag ?? []).filter((b) => b.type === "expense" && b.total > 0);
  const total = items.reduce((s, b) => s + b.total, 0);
  const period = getPeriodLabel(selectedDateFilter, offSet ?? 0);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm mx-2 mb-4">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Phân Tích Chi Tiêu</h2>
          <p className="text-xs text-gray-400 mt-0.5">Cơ cấu danh mục trong {period}</p>
        </div>
        {total > 0 && (
          <span className="text-sm font-bold text-gray-700 tabular-nums">
            Tổng {fmt(total)} đ
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Chưa có khoản chi nào trong kỳ này</p>
      ) : (
        <>
          {/* Stacked bar */}
          <div className="flex h-3 w-full overflow-hidden rounded-full">
            {items.map((b) => (
              <div
                key={b.tag}
                title={`${TAG_CONFIG[b.tag]?.label || b.tag}: ${b.percent}%`}
                style={{ width: `${b.percent}%`, backgroundColor: TAG_COLORS[b.tag] || "#6b7280" }}
                className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              />
            ))}
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 gap-3">
            {items.map((b) => (
              <div
                key={b.tag}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3"
              >
                {/* Color dot + icon */}
                <div className="flex items-center justify-center h-9 w-9 shrink-0 rounded-full"
                  style={{ backgroundColor: `${TAG_COLORS[b.tag]}22` }}>
                  <TransactionsIcon type={b.tag} size={15} custom="rounded-full p-1" />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col min-w-0 gap-0.5">
                  <span className="text-xs font-semibold text-gray-700 truncate">
                    {TAG_CONFIG[b.tag]?.label || b.tag}
                  </span>
                  <span className="text-[10px] text-gray-400">Tỉ trọng: {b.percent}%</span>
                </div>

                {/* Amount */}
                <span className="text-sm font-bold text-gray-800 tabular-nums shrink-0">
                  {fmt(b.total)} đ
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
