export const getPrevTotalExpense = (prevTransaction) => {
  if (!prevTransaction) {
    console.log("undefined prevTrans!");
    return 0;
  }

  return prevTransaction
    .filter((trans) => trans.type === "expense")
    .reduce((total, trans) => {
      return total + (trans.amount || 0);
    }, 0);
};
export const getCurrTotalExpense = (currTransaction) => {
  if (!currTransaction) {
    console.log("undefined currTrans!");
    return 0;
  }
  return currTransaction
    .filter((trans) => trans.type === "expense")
    .reduce((total, trans) => {
      return total + (trans.amount || 0);
    }, 0);
};

export const getMostExpensiveType = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { type: "Chưa có dữ liệu", amount: 0 };
  }

  // 1. Gom nhóm & tính tổng
  const totalByType = transactions
    .filter((trans) => trans.type === "expense")
    .reduce((acc, trans) => {
      const type = trans.tag|| "Khác";
      acc[type] = (acc[type] || 0) + trans.amount;
      return acc;
    }, {});

  // 2. Tìm danh mục lớn nhất
  return Object.entries(totalByType).reduce(
    (max, [type, amount]) => {
      return amount > max.amount ? { type, amount } : max;
    },
    { type: null, amount: 0 },
  );
};
export const getExpensePercentage = (
  prevExpenseValueByDate,
  currentExpenseValueByDate,
) => {
  if (prevExpenseValueByDate === 0 && currentExpenseValueByDate === 0) {
    return 0;
  }
  if (prevExpenseValueByDate === 0) {
    return 0;
  }
  return (
    ((currentExpenseValueByDate -
      (prevExpenseValueByDate || currentExpenseValueByDate)) /
      (prevExpenseValueByDate || 1)) *
    100
  );
};
export const getTotalExpense = (transactions, selectedWallet) => {
  if (!Array.isArray(transactions) || transactions.length === 0) return 0;
  return transactions
    .filter(
      (trans) =>
        trans.type === "expense" && trans.walletType === selectedWallet && trans.tag!=="transfer",
    )
    .reduce((total, trans) => {
      return total + trans.amount;
    }, 0);
};
export const getToltalIncome = (transactions, selectedWallet) => {
  if (!Array.isArray(transactions) || transactions.length === 0) return 0;
  return transactions
    .filter(
      (trans) => trans.type === "income" && trans.walletType === selectedWallet && trans.tag!=="transfer",
    )
    .reduce((total, trans) => {
      return total + trans.amount;
    }, 0);
};
// Thay đoạn `export const cardValue = Object.values(...)` trong file utils bằng hàm này.
// Gom các khoản chi theo tag đầu tiên, tính tổng và phần trăm trong tổng chi.
export const getCardValue = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];

  const byTag = transactions
    .filter((t) => t.type === "expense" && t.tag !=="transfer")
    .reduce((acc, t) => {
      const tag = t.tag|| "khac";
      acc[tag] ??= { tag, total: 0 };
      acc[tag].total += Number(t.amount) || 0;
      return acc;
    }, {});

  const list = Object.values(byTag);
  const grandTotal = list.reduce((sum, c) => sum + c.total, 0);

  return list
    .map((c) => ({
      ...c,
      percent: grandTotal ? Math.round((c.total / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total); // chi nhiều nhất đứng đầu
};

// Kiểm tra giao dịch có thuộc kỳ đang xem không (cùng logic với getDateLabel trong TransactionTable)
const isInPeriod = (createdAt, filter, offset = 0) => {
  const d = new Date(createdAt);
  const ref = new Date();

  if (filter === "day") {
    ref.setDate(ref.getDate() - offset);
    return d.toDateString() === ref.toDateString();
  }
  if (filter === "month") {
    ref.setDate(1); // tránh tràn ngày khi lùi tháng (31 -> 30/28)
    ref.setMonth(ref.getMonth() - offset);
    return (
      d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
    );
  }
  if (filter === "year") {
    ref.setFullYear(ref.getFullYear() - offset);
    return d.getFullYear() === ref.getFullYear();
  }
  return true; // không có bộ lọc thời gian thì giữ nguyên
};

// Store chứa TOÀN BỘ giao dịch (getAllTransactions), nên cần lọc theo ví và kỳ trước khi thống kê
export const filterByWalletAndPeriod = (
  transactions,
  selectedDateFilter,
  offset = 0,
) => {
  if (!Array.isArray(transactions)) return [];
  return transactions.filter(
    (t) =>
      
      isInPeriod(t.createdAt, selectedDateFilter, offset),
  );
};