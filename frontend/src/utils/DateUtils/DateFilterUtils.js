import { isSameDay, isSameMonth, isSameYear} from "./dateChecker"

export const filterTransactionsByDate = (transactions, filter, offset) => {
  if (!Array.isArray(transactions)) return [];
  switch (filter) {
    case "day":
      return transactions.filter((trans) => isSameDay(trans, offset));
    case "month":
      return transactions.filter((trans) => isSameMonth(trans, offset));
    case "year":
      return transactions.filter((trans) => isSameYear(trans, offset));
    default:
      return transactions;
  }
};
export const getDateFilter = (selectedDateFilter) => {
  if (selectedDateFilter === "day") {
    return "Ngày";
  } else if (selectedDateFilter === "month") {
    return "Tháng";
  } else if (selectedDateFilter === "year") {
    return "Năm";
  }
}