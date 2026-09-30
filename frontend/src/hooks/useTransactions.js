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
  const TransFilter = useMemo(() => {
    const prevfilteredTrans = filterTransactionsByDate(
      transactions,
      selectedDateFilter,
      1,
    );
    console.log("prevTrans"+prevfilteredTrans);
    const filteredTrans = filterTransactionsByDate(
      transactions,
      selectedDateFilter,
      0,
    );
    console.log("filteredTrans"+filteredTrans);
    const filteredTransByDate = filterTransactionsByDate(
      transactions,
      selectedDateFilter,
      offset,
    );
    return {
      prevfilteredTrans,
      filteredTrans,
      filteredTransByDate,
    };
  }, [transactions, offset, selectedDateFilter]);

  const transactionCalculation = useMemo(() => {
    const walletName = typeof selectedWallet === "object" ? selectedWallet?.walletName : selectedWallet;
    const totalExpenseAllTime = getTotalExpense(transactions, walletName);
    const totalIncomeAllTime =  getToltalIncome(transactions, walletName);
    const prevExpenseValueByDate = getPrevTotalExpense(
      TransFilter.prevfilteredTrans,
    );

    const currentExpenseValueByDate = getCurrTotalExpense(
      TransFilter.filteredTrans,
    );

    const expensePercentage = getExpensePercentage(
      prevExpenseValueByDate,
      currentExpenseValueByDate,
    );

    const isIncrease = expensePercentage > 0;
    const { type: mostExpensiveType, amount: mostExpensiveAmount } =
      getMostExpensiveType(TransFilter.filteredTrans);
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
  }, [transactions, selectedWallet, TransFilter]);

  return {
    transactionCalculation,
    TransFilter,
  };
};
