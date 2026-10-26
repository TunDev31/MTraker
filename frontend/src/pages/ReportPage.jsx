import { useEffect, useMemo, useState } from "react";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronFirst,
  ChevronLast,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import CardSkeleton from "@/components/CardSkeleton";
import PieChartComponent from "@/components/PieChart";
import BarChartComponent from "@/components/BarChart";
import AreaChartComponent from "@/components/AreaChart";
import { sumByType } from "@/utils/ChartUtils.js/TrendUtils";

const DATE_OPTIONS = [
  { value: "day", label: "Ngày" },
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");

function getDateLabel(filter, offset) {
  if (offset === 0) {
    if (filter === "day") return "Hôm nay";
    if (filter === "month") return "Tháng này";
    if (filter === "year") return "Năm nay";
  }
  const d = new Date();
  if (filter === "day") {
    d.setDate(d.getDate() - offset);
    return d.toLocaleDateString("vi-VN");
  }
  if (filter === "month") {
    d.setDate(1);
    d.setMonth(d.getMonth() - offset);
    return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  d.setFullYear(d.getFullYear() - offset);
  return `Năm ${d.getFullYear()}`;
}

// ── KPI card ──
const KpiCard = ({ label, value, sub, icon: Icon, color, loading }) => (
  <div
    className={cn("flex flex-1 flex-col gap-1.5 rounded-2xl border p-4", color)}
  >
    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
      <Icon size={13} /> {label}
    </div>
    {loading ? (
      <Skeleton className="mt-1 h-6 w-28" />
    ) : (
      <span className="text-lg font-extrabold tabular-nums text-gray-900">
        {fmt(value)}{" "}
        <span className="text-xs font-medium text-gray-400">₫</span>
      </span>
    )}
    {sub && <span className="text-[11px] text-gray-400">{sub}</span>}
  </div>
);

export default function ReportPage() {
  const transLoading = useTransactionsStore((s) => s.loading);
  const fetchTrans = useTransactionsStore((s) => s.fetchTransactions);
  const fetchTransAnalyze = useTransactionsStore((s) => s.fetchTransAnalyze);
  const report = useTransactionsStore((s) => s.report);
  const walletLoading = useWalletStore((s) => s.loading);
  const fetchReport = useWalletStore((s) => s.fetchReport);

  const walletReport = useWalletStore((s) => s.walletReport);
  const fetchTransTrend = useTransactionsStore((s) => s.fetchTransTrend);
  const trend = useTransactionsStore((s) => s.trend);
  const [filter, setFilter] = useState("month");
  const [offset, setOffset] = useState(0);
  const isLoading = transLoading || walletLoading;
  useEffect(() => {
    fetchReport();
  }, []);
  // ── Fetch ──
  useEffect(() => {
    fetchTransTrend({ selectedDateFilter: filter, count: 6 });
  }, [filter]);

  useEffect(() => {
    fetchTransAnalyze({ offSet: offset, selectedDateFilter: filter });
    fetchTrans({ offSet: offset, selectedDateFilter: filter });
  }, [offset, filter]);

  // ── KPI ──
  const totalExpense = report?.totalExpense;
  const totalIncome = report?.totalIncome;
  const netBalance = report?.balance;
  const totalBalance = walletReport?.total;

  return (
    <div className="flex flex-col gap-5 px-4 py-5 pb-24 md:px-8 md:py-6 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Báo cáo & Phân tích
          </h1>
          <p className="mt-0.5 text-xs text-gray-400">
            Tổng quan tài chính theo kỳ
          </p>
        </div>
      </div>

      {/* Period selector + navigator */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1 rounded-xl bg-[#E5EEFF] p-1">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setFilter(opt.value);
                setOffset(0);
              }}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                filter === opt.value
                  ? "bg-white text-[#2563eb] shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Kỳ trước"
            onClick={() => setOffset((o) => o + 1)}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronFirst size={16} />
          </button>
          <span className="min-w-[80px] text-center text-xs font-semibold text-gray-700">
            {isLoading ? (
              <Skeleton className="mx-auto inline-block h-4 w-16" />
            ) : (
              getDateLabel(filter, offset)
            )}
          </span>
          <button
            type="button"
            aria-label="Kỳ sau"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0 || isLoading}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronLast size={16} />
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="flex flex-wrap gap-3">
        <KpiCard
          label="Tổng chi"
          value={totalExpense}
          loading={isLoading}
          icon={TrendingDown}
          color="border-red-100 bg-red-50/60"
        />
        <KpiCard
          label="Tổng thu"
          value={totalIncome}
          loading={isLoading}
          icon={TrendingUp}
          color="border-emerald-100 bg-emerald-50/60"
        />
        <KpiCard
          label="Số dư ròng"
          value={Math.abs(netBalance)}
          sub={netBalance >= 0 ? "▲ Dư dương" : "▼ Thâm hụt"}
          loading={isLoading}
          icon={netBalance >= 0 ? ArrowUpRight : ArrowDownLeft}
          color={
            netBalance >= 0
              ? "border-blue-100 bg-blue-50/60"
              : "border-orange-100 bg-orange-50/60"
          }
        />
        <KpiCard
          label="Tổng tài sản"
          value={totalBalance}
          loading={walletLoading}
          icon={Wallet}
          color="border-purple-100 bg-purple-50/60"
        />
      </div>

      {/* Pie + Bar */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {isLoading ? (
          <CardSkeleton h="h-72" />
        ) : (
          <PieChartComponent report={report} selectedDateFilter={filter} />
        )}

        {isLoading ? (
          <CardSkeleton h="h-72" />
        ) : (
          <BarChartComponent trend={trend} />
        )}
      </div>

      {/* Area */}
      {isLoading ? (
        <CardSkeleton h="h-64" />
      ) : (
        <AreaChartComponent trend={trend} />
      )}
    </div>
  );
}
