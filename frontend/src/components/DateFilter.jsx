import { cn } from "@/lib/utils";
import MyCombobox from "./ui/MyCombobox";
import React from "react";
const DateFilter = ({ selectedDateFilter, setSelectedDateFilter }) => {
 
  
  
  return (
    <div className="flex justify-between items-center px-2  ">
      <div className="flex gap-2 sm:gap-2 items-center justify-between">
        <p className=" text-xs font-bold text-center border-b border-slate-200 dark:border-slate-600 sm:text-base">
          PHÂN TÍCH CHI TIÊU THEO
        </p>  
      </div>
     
    </div>
  );
};
export default DateFilter;
