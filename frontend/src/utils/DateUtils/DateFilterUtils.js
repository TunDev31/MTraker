

export const getDateFilter = (selectedDateFilter) => {
  if (selectedDateFilter === "day") {
    return "Ngày";
  } 
else if (selectedDateFilter==='week') {
  return "Tuần";
}  
  else if (selectedDateFilter === "month") {
    return "Tháng";
  } else if (selectedDateFilter === "year") {
    return "Năm";
  }
}