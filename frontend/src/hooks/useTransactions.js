import { filterTransactionsByDate } from "@/utils/DateUtils/DateFilterUtils";
import {
  getCurrTotalExpense,
  getExpensePercentage,
  getMostExpensiveType,
  getPrevTotalExpense,
  getToltalIncome,
  getTotalExpense,
} from "@/utils/SpendingUtils/CalculateUtils";
import { ICON_MAP } from "@/utils/SpendingUtils/TransactionsIconUtils";
import { Ban } from "lucide-react";
import { useMemo } from "react";

export const useTransactions = ({
  selectedWallet,
  transactions,
  selectedDateFilter,
  offset,
}) => {
  const walletName =
    typeof selectedWallet === "object"
      ? selectedWallet?.walletName
      : selectedWallet;

  const TransFilter = useMemo(() => {
    // THÊM: lọc theo ví trước, để mọi thống kê và danh sách đều theo ví đang chọn
    const walletTrans =
      walletName && Array.isArray(transactions)
        ? transactions.filter((t) => t.walletType === walletName && t.tag !=="transfer")
        : transactions;

    const prevfilteredTrans = filterTransactionsByDate(
      walletTrans,
      selectedDateFilter,
      1,
    );
    const filteredTrans = filterTransactionsByDate(
      walletTrans,
      selectedDateFilter,
      0,
    );
    // Danh sách theo kỳ đang xem (đổi theo offset khi bấm mũi tên)
    const filteredTransByDate = filterTransactionsByDate(
      walletTrans,
      selectedDateFilter,
      offset,
    );
    return {
      prevfilteredTrans,
      filteredTrans,
      filteredTransByDate,
    };
  }, [transactions, walletName, offset, selectedDateFilter]);

  const transactionCalculation = useMemo(() => {
    const totalExpenseAllTime = getTotalExpense(transactions, walletName);
    const totalIncomeAllTime = getToltalIncome(transactions, walletName);
    const prevExpenseValueByDate = getPrevTotalExpense(
      TransFilter.prevfilteredTrans,
    );

    const currentExpenseValueByDate = getCurrTotalExpense(
      TransFilter.filteredTransByDate,
    );

    const expensePercentage = getExpensePercentage(
      prevExpenseValueByDate,
      currentExpenseValueByDate,
    );

    const isIncrease = expensePercentage > 0;
    const { type: mostExpensiveType, amount: mostExpensiveAmount } =
      getMostExpensiveType(TransFilter.filteredTransByDate);
    const mostExpensePerDay =
      (mostExpensiveAmount / (currentExpenseValueByDate || 1)) * 100;
    const iconType = mostExpensiveType?.toLowerCase();
    const IconTypeComponent = ICON_MAP[iconType] || Ban;
    return {
      totalIncomeAllTime,
      totalExpenseAllTime,
      expensePercentage,
      prevExpenseValueByDate,
      currentExpenseValueByDate,
      isIncrease,
      mostExpensePerDay,
      IconTypeComponent,
      mostExpensiveType,
      mostExpensiveAmount,
    };
  }, [transactions, walletName, TransFilter]);

  return {
    transactionCalculation,
    TransFilter,
  };
};