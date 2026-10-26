export const getDateRange = (filter, offset = 0) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  switch (filter) {
    case "day":
      return {
        start: new Date(y, m, d - offset),
        end: new Date(y, m, d - offset),
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
export const periodFormat = (d, withYear = false) => {
  const pad = (n) => String(n).padStart(2, "0");

  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}${withYear ? `/${d.getFullYear()}` : ""}`;
};
export const getPeriodDay = (day) => {
  const dayNum = day.getDay();
  switch (dayNum) {
    case 0: {
      return "Chủ nhật";
    }
    case 1: {
      return "Thứ hai";
    }

    case 2: {
      return "Thứ ba";
    }
    case 3: {
      return "Thứ tư";
    }
    case 4: {
      return "Thứ năm";
    }
    case 5: {
      return "Thứ sáu";
    }
    case 6: {
      return "Thứ bảy";
    }
    default:
      return null;
  }
};
export const  getGroupLabel =(dateStr) =>{
  const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
  const d = new Date(dateStr);
  if (d.toDateString() === today.toDateString()) return "HÔM NAY";
  if (d.toDateString() === yesterday.toDateString()) return "HÔM QUA";
  return d.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}