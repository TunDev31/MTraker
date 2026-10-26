export const defaultLimitUsage = {
  day: 100000,
  week: 700000,
  month: 3500000,
  year: 42000000,
};

export const getDefaultLimitUsage = (selectedDateFilter) => {
  if (!selectedDateFilter) return defaultLimitUsage['day'];
  return defaultLimitUsage[selectedDateFilter] ?? 0;
};