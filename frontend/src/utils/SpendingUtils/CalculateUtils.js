export const getPrevTotalExpense = (prevTransaction) => {
  if (!prevTransaction) {
    console.log("undefined prevTrans!");
    return;
  }

  return prevTransaction
    .filter((trans) => trans.type === "expense")
    .reduce((total, trans) => {
      return total + (trans.amount || 0);
    }, 0);
};
export const getCurrTotalExpense = (currTransaction) => {
  if (!currTransaction) {
    console.log("undefined prevTrans!");
    return;
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
      const type = trans.tag?.[0] || "Khác";
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
        trans.type === "expense" && trans.walletType === selectedWallet,
    )
    .reduce((total, trans) => {
      return total + trans.amount;
    }, 0);
};
export const getToltalIncome = (transactions, selectedWallet) => {
  if (!Array.isArray(transactions) || transactions.length === 0) return 0;
  return transactions
    .filter(
      (trans) => trans.type === "income" && trans.walletType === selectedWallet,
    )
    .reduce((total, trans) => {
      return total + trans.amount;
    }, 0);
};
