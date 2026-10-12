export const getDateRange = (filter, offset = 0) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  switch (filter) {
    case "day":
      return {
        start: new Date(y, m, d - offset),
        end: new Date(y, m, d - offset + 1),
      };
    case "week": {
      const dow = (now.getDay() + 6) % 7; // thứ Hai = 0
      return {
        start: new Date(y, m, d - dow - offset * 7),
        end: new Date(y, m, d - dow - offset * 7 + 7),
      };
    }
    case "month":
      return {
        start: new Date(y, m - offset, 1),
        end: new Date(y, m - offset + 1, 1),
      };
    case "year":
      return {
        start: new Date(y - offset, 0, 1),
        end: new Date(y - offset + 1, 0, 1),
      };
    default:
      return null;
  }
};