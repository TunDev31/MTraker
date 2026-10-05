import { cn } from "@/lib/utils";
import MyCombobox from "./ui/MyCombobox";
import React from "react";
const DateFilter = ({ selectedDateFilter, setSelectedDateFilter }) => {
 
  const [selectedValue, setSelectedValue] = React.useState("day");
  const handleChange = (value) => {
    if (!value) return;
    setSelectedValue(value);
    setSelectedDateFilter(value);
  };
  
  return (
    <div className="flex justify-between items-center px-2  ">
      <div className="flex gap-2 sm:gap-2 items-center justify-between">
        <p className=" text-xs font-bold text-center border-b border-slate-200 dark:border-slate-600 sm:text-base">
          PHÂN TÍCH CHI TIÊU THEO
        </p>
        {/* <MyCombobox
          value={selectedValue}
          onChange={handleChange}
          data={[
            { value: "day", label: "Ngày" },
            { value: "month", label: "Tháng" },
            { value: "year", label: "Năm" },
          ]}
        /> */}
        
        
      </div>
     <div className="flex items-center bg-[#E5EEFF] rounded-xl p-1 gap-1" >
          <button className={cn(" px-2 py-1 rounded-sm", selectedValue === "day" && "bg-white text-green-700")} type="button" onClick={() => handleChange("day")}>
            Ngày
          </button>
          <button className={cn(" px-2 py-1 rounded-sm", selectedValue === "month" && "bg-white text-green-700")} type="button" onClick={() => handleChange("month")}>
            Tháng
          </button>
          <button className={cn(" px-2 py-1 rounded-sm", selectedValue === "year" && "bg-white text-green-700")} type="button" onClick={() => handleChange("year")}>
            Năm
          </button>
        </div>
    </div>
  );
};
export default DateFilter;
