
import { TrendingUp, TrendingDown, Wallet, ShieldCheck } from "lucide-react";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/Format/formatCurrency";
import DesktopKpiCardsSkeleton from "./DesktopKpiCardsSkeleton";

import { getDateFilter } from "@/utils/DateUtils/DateFilterUtils";
import KpiCard from "./KpiCard";
import {  getWarningLimitLabel } from "@/utils/temp/Fund";
import { TAG_CONFIG } from "@/utils/temp/tagOption";
import { useConfigStore } from "@/stores/useConfigStore";
import { getDefaultLimitUsage } from "@/utils/DefaultConfig/spendingLimit";
import { useState } from "react";



// ─── Card shell ──────────────────────────────────────────────────────────────


// ─── Badge ───────────────────────────────────────────────────────────────────
function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
        className,
      )}
    >
      {children}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DesktopKpiCards({
  selectedDateFilter,
  offSet,
  loading,
}) {
  const walletReport = useWalletStore((s) => s.walletReport);
  const report = useTransactionsStore((s) => s.report);
const spendingLimit = useConfigStore((s)=> s.spendingLimits);
const isValidLimit = spendingLimit.filter((l)=> l.period===selectedDateFilter)?.[0];
const limit = isValidLimit ? isValidLimit?.amount : (getDefaultLimitUsage(selectedDateFilter) );
  
  const totalIncome = report?.totalIncome ?? 0;
  const totalExpense = report?.totalExpense ?? 0;

  const remaining =  (limit - totalExpense) ;
   
  const usedPercent =
    
       Math.min(Math.round((1-(remaining / limit || 1)) * 100), 100)
     ;
     
  
  const period = getDateFilter(selectedDateFilter, offSet);
  const limitObject = getWarningLimitLabel(usedPercent);
const LimitIcon = limitObject?.ICON;


  const incomeGoalPercent =
    totalIncome > 0
      ? Math.round((totalIncome / (totalIncome * 0.926)) * 100)
      : 0; // placeholder ratio



  if (loading) return <DesktopKpiCardsSkeleton />; // skeleton handled by DesktopKpiCardsSkeleton

  return (
    <div className=" grid grid-cols-4 gap-4 px-6 mb-4">
      {/* ── Card 1: Tổng Số Dư ─────────────────────────────────────────────── */}
      <KpiCard>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Tổng Số Dư
          </p>
          <Wallet className="w-4 h-4 text-gray-300" />
        </div>
        <p className="text-2xl font-bold text-gray-900 leading-tight">
          {formatCurrency(walletReport?.total, "vi-VN")}
        </p>
        <Badge className={cn(" self-start bg-[#EEF2FF] text-black/60")}>
          {"Thống kê trên tổng "}
          <span className="text-black"> {walletReport?.count}</span>{" "}
          {" ví hiện có"}
        </Badge>
      </KpiCard>

      {/* ── Card 2: Thu nhập ────────────────────────────────────────────────── */}
      <KpiCard>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Thu nhập{period ? ` ${period}` : ""}
          </p>
          <TrendingUp className="w-4 h-4 text-green-600" />
        </div>
        <p className="text-2xl font-bold text-green-600 leading-tight">
          {formatCurrency(totalIncome, "vi-VN")}
        </p>
        {incomeGoalPercent > 0 ? (
          <Badge className="bg-green-50 text-green-700 self-start">
            ✓ Đạt {incomeGoalPercent}% mục tiêu
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-500 self-start">
            Chưa có dữ liệu
          </Badge>
        )}
      </KpiCard>

      {/* ── Card 3: Chi tiêu ────────────────────────────────────────────────── */}
      <KpiCard>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Chi tiêu{period ? ` ${period}` : ""}
          </p>
          <TrendingDown className="w-4 h-4 text-red-600" />
        </div>
        <p className="text-2xl font-bold text-red-500 leading-tight">
          {formatCurrency(totalExpense, "vi-VN")}
        </p>
        <div className="flex gap-1.5 items-center ">
          <p className="flex justify-center items-center text-sm bg-red-100 text-red-600  py-0.5 px-1 rounded-xl">Chi nhiều vào</p>
          <span className="text-sm">
            #{TAG_CONFIG[report?.byTag?.[0]?.tag]?.label}
          </span>
        </div>
      </KpiCard>

      {/* ── Card 4: Hạn mức còn lại ─────────────────────────────────────────── */}
      <KpiCard>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Hạn mức chi tiêu còn lại
          </p>
          <LimitIcon className={cn(limitObject?.BGROUND,"rounded-full")}/>
        </div>
        <p
          className={cn(
            "text-2xl font-bold leading-tight",
            remaining >= 0 ? "text-gray-900" : "text-red-500",
          )}
        >
          {remaining <0 ? 0 : remaining }
         <span className="text-sm"> {!isValidLimit && '(Mặc định)'}</span>
        </p>

        {/* Progress bar */}
        <div className="space-y-1 mt-1">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                usedPercent >= 90
                  ? "bg-red-400"
                  : usedPercent >= 70
                    ? "bg-amber-400"
                    : "bg-green-400",
              )}
              style={{ width: `${usedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400 font-medium">
            <span>Đã dùng {usedPercent}%</span>
             <span className={cn("p-0.5 rounded-sm",limitObject?.TEXT, limitObject?.BGROUND)}>{limitObject?.LABEL}</span> 
          </div>
        </div>
      </KpiCard>
    </div>
  );
}
