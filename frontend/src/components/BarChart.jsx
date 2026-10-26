import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart2 } from "lucide-react";
import SectionComponent from "./Section";
import ChartTooltip from "./ChartToolTip";


const formatAxis = (v) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(0)}M`
    : v >= 1000
      ? `${(v / 1000).toFixed(0)}K`
      : v;

const BarChartComponent = ({trend}) => {
 
 
const barData = Array.isArray(trend) ? trend : [];
const isEmpty = barData.every((d) => !d.expense && !d.income);

  return (
    <SectionComponent
      icon={BarChart2}
      title="So sánh Chi tiêu & Thu nhập"
      subtitle={`6 Kỳ gần nhất`}
    >
      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-400">
          Chưa có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={barData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatAxis}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(v) => (
                <span className="text-xs font-semibold text-gray-600">{v}</span>
              )}
            />
            <Bar
              dataKey="expense"
              name="Chi tiêu"
              fill="#ef4444"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="income"
              name="Thu nhập"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </SectionComponent>
  );
};

export default BarChartComponent;