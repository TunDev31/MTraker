import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { getDateFilter } from "@/utils/DateUtils/DateFilterUtils";
import TransactionsIcon from "./TransactionsIcon";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactions } from "@/hooks/useTransactions";

const ExpenseAnalyze = ({ selectedDateFilter }) => {
  // 1. Lấy state & action từ Store
  const transactions = useTransactionsStore((state) => state.transactions);
  const fetchTransactions = useTransactionsStore((state) => state.fetchTransactions);
  const selectedWallet = useWalletStore((state) => state.selectedWallet);
   const walletName = selectedWallet?.walletName || "";
    console.log("walletName: "+walletName);
    console.log("selectedDateFilter: "+selectedDateFilter);
 console.log("transactions: "+transactions);
  const {transactionCalculation} = useTransactions({selectedWallet:walletName,transactions,selectedDateFilter,offset: 0});
  console.log("total: "+transactionCalculation.currentExpenseValueByDate);
 

  // 2. Kích hoạt gọi API mỗi khi đổi Ví hoặc đổi Mốc thời gian


  // 3. Tính toán các chỉ số hiển thị phụ (dựa trên dữ liệu từ Backend)

  // Tính phần trăm danh mục chi nhiều nhất so với tổng chi


  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 1. Thống kê tổng chi tiêu */}
      <div className="flex flex-col px-3 py-3 gap-1 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-center gap-1">
          <h2 className="text-xs font-semibold text-gray-600">
            TỔNG CHI {getDateFilter(selectedDateFilter).toUpperCase()}
          </h2>
        </div>

        <div className="flex gap-1 items-baseline mt-1">
          <p className="text-lg font-bold truncate text-red-600">
            {transactionCalculation.currentExpenseValueByDate.toLocaleString("vi-VN")}
          </p>
          <span className="text-xs text-gray-500 font-medium">VND</span>
        </div>
      </div>

      {/* 2. Danh mục chi nhiều nhất */}
      <div className="flex flex-col p-3 gap-2 bg-white rounded-xl shadow-md justify-between">
        <div className="flex items-center justify-center">
          <h2 className="text-xs font-semibold text-gray-600">
            DANH MỤC CHI NHIỀU
          </h2>
        </div>

        <div className="flex gap-2 items-center justify-center my-1">
          <TransactionsIcon type={transactionCalculation.currentExpenseValueByDate} />
          <p className="text-base font-bold text-black truncate">
            {transactionCalculation.currentExpenseValueByDate}
          </p>
        </div>

        <div className="flex justify-center items-center">
          <p className="text-xs flex gap-1 items-center">
            <span className="text-green-700 font-bold">
              {transactionCalculation.currentExpenseValueByDate}%
            </span>
            <span className="text-gray-500">
              / Chi tiêu {getDateFilter(selectedDateFilter).toLowerCase()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalyze;