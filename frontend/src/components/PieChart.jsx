import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { PieChartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionComponent from "./Section";
import TransactionsIcon from "./TransactionsIcon";
import ChartTooltip from "./ChartTooltip";
import { ICON_CLASS } from "@/utils/SpendingUtils/TransactionsIconUtils";
import { TAG_CONFIG } from "@/utils/temp/tagOption";
import { buildPie } from "@/utils/ChartUtils.js/PieChart";
import { formatCurrency } from "@/utils/Format/formatCurrency";
import { getDateFilter } from "@/utils/DateUtils/DateFilterUtils";


const TAG_COLORS = {
  food: "#f59e0b",
  travel: "#3b82f6",
  entertainment: "#8b5cf6",
  shopping: "#f97316",
  khac: "#6b7280",
  transfer: "#10b981",
  salary: "#10b981",
  none: "#d1d5db",
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComponent = ({ report, selectedDateFilter }) => {
  const expenseData = useMemo(() => buildPie(report?.byTag, "expense"), [report]);
  const incomeData = useMemo(() => buildPie(report?.byTag, "income"), [report]);

  const totalExpense = useMemo(
    () => expenseData.reduce((s, d) => s + d.value, 0),
    [expenseData],
  );
  const getPercent = (v) =>
    totalExpense ? Math.round((v / totalExpense) * 100) : 0;

  const topTag = expenseData[0];
  const isEmpty = expenseData.length === 0 && incomeData.length === 0;

  return (
    <SectionComponent
      icon={PieChartIcon}
      title="Chi tiêu theo danh mục"
      subtitle={`Theo ${getDateFilter(selectedDateFilter).toLowerCase()}`}
    >
      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-400">
          Chưa có dữ liệu chi tiêu
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: "Chi tiêu", data: expenseData },
              { title: "Thu nhập", data: incomeData },
            ].map(({ title, data }) => (
              <div key={title}>
                <p className="text-center text-xs font-semibold text-gray-500">
                  {title}
                </p>
                {data.length === 0 ? (
                  <div className="flex h-[180px] items-center justify-center text-xs text-gray-400">
                    Không có dữ liệu
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="tag"
                        innerRadius={40}
                        outerRadius={75}
                        labelLine={false}
                        label={<PieLabel />}
                        shape={(props) => (
                          <Sector
                            {...props}
                            fill={TAG_COLORS[props.payload.tag] || "#6b7280"}
                            stroke="white"
                            strokeWidth={2}
                          />
                        )}
                      />
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            ))}
          </div>

          {/* Legend (chỉ chi tiêu) */}
          <div className="mt-1 flex flex-col gap-1.5">
            {expenseData.map((d) => (
              <div key={d.tag} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: TAG_COLORS[d.tag] || "#6b7280" }}
                  />
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-xs font-semibold",
                      ICON_CLASS[d.tag],
                    )}
                  >
                    <TransactionsIcon
                      type={d.tag}
                      size={11}
                      custom="rounded p-0"
                    />
                    <span>{TAG_CONFIG[d.tag]?.label || d.tag}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">
                    {getPercent(d.value)}%
                  </span>
                  <span className="text-xs tabular-nums text-gray-500">
                    {formatCurrency(d.value, "vi-VN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {topTag && (
            <div className="mt-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              💡 Danh mục chi nhiều nhất:{" "}
              <span className="font-bold">
                {TAG_CONFIG[topTag.tag]?.label || topTag.tag}
              </span>{" "}
              ({getPercent(topTag.value)}% tổng chi)
            </div>
          )}
        </>
      )}
    </SectionComponent>
  );
};

export default PieChartComponent;