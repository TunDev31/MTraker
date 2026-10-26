export const getTrendCount = (filter) =>
  filter === "year" ? 5 : filter === "month" ? 6 : 7;

/** Tạo nhãn + offset của N kỳ gần nhất */
export function buildTrendPeriods(filter, count) {
  const periods = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    let label = "";
    if (filter === "day") {
      d.setDate(d.getDate() - i);
      label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else if (filter === "month") {
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      label = `T${d.getMonth() + 1}/${d.getFullYear()}`;
    } else {
      d.setFullYear(d.getFullYear() - i);
      label = `${d.getFullYear()}`;
    }
    periods.push({ label, offset: i });
  }
  return periods;
}

/** Tổng tiền theo loại (expense | income) */
export const sumByType = (list, type) =>
  list.filter((t) => t.type === type).reduce((s, t) => s + (t.amount || 0), 0);

/** Dữ liệu xu hướng: [{ label, expense, income }] */
export function buildTrendData(transactions, filter, count) {
  return buildTrendPeriods(filter, count).map(({ label }) => ({
    label,
    expense: sumByType(transactions, "expense"),
    income: sumByType(transactions, "income"),
  }));
}