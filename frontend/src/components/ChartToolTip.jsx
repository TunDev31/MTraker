import { formatCurrency } from "@/utils/Format/formatCurrency";

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-xs">
      {label && <p className="mb-1 font-bold text-gray-700">{label}</p>}
      {payload.map((p, i) => (
        <p
          key={i}
          style={{ color: p.color || p.payload?.fill }}
          className="font-semibold"
        >
          {p.name}: {formatCurrency(p.value, "vi-VN")}
        </p>
      ))}
    </div>
  );
};

export default ChartTooltip;