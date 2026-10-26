import { getGroupLabel } from "../DateUtils/DatePeriodUtils";

export const groupTransactionsByDate = (transactions)=> {
  const groups = {};
  for (const t of transactions) {
    const key = new Date(t.createdAt).toDateString();
    if (!groups[key])
      groups[key] = {
        label: getGroupLabel(t.createdAt),
        items: [],
        dateKey: key,
      };
    groups[key].items.push(t);
  }
  // Sort groups newest first, take 2
  return Object.values(groups)
    .sort(
      (a, b) => new Date(b.items[0].createdAt) - new Date(a.items[0].createdAt),
    )
    .slice(0, 2);
}