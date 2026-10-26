import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import SectionComponent from "./Section";
import ChartTooltip from "./ChartTooltip";


const formatAxis = (v) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1000
      ? `${(v / 1000).toFixed(0)}K`
      : v;

const AreaChartComponent = ({ trend }) => {

  
  
const areaData = Array.isArray(trend) ? trend : [];
  const isEmpty = areaData?.every((d) => !d.expense && !d.income);

  return (
    <SectionComponent
      icon={TrendingUp}
      title="Xu hướng tài chính"
      subtitle={`Diễn biến chi tiêu & thu nhập 6 kỳ gần nhất`}
    >
      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-400">
          Chưa có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart
            data={areaData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              width={40}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(v) => (
                <span className="text-xs font-semibold text-gray-600">{v}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Chi tiêu"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#gradExpense)"
              dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Thu nhập"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradIncome)"
              dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </SectionComponent>
  );
};

export default AreaChartComponent;