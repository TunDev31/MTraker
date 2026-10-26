import { cn } from "@/lib/utils";
import { useFormStore } from "@/stores/useFormStore";
import {
  getDateRange,
  getPeriodDay,
  periodFormat,
} from "@/utils/DateUtils/DatePeriodUtils";
import {  Calendar, Download, Plus } from "lucide-react";
import React from "react";
import {exportCSV} from '@/utils/temp/exportCSV.js'
import { useTransactionsStore } from "@/stores/useTransactionsStore";
const FILTERS = [
  { value: "day", label: "Ngày" },
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];

const DesktopHeader = ({
  selectedDateFilter,
  offset,
  setSelectedDateFilter,
  setOffset,
}) => {
  const period = getDateRange(selectedDateFilter, offset);
  const trans = useTransactionsStore((s)=>s.transactions);
  const setOpenForm = useFormStore((s) => s.setOpenForm);
  const handleChange = (value) => {
    if (!value || value === selectedDateFilter) return;
    setSelectedDateFilter(value);
    setOffset(0);
  };

  return (
    <div className=" hidden md:flex gap-2 px-6 py-3 justify-between">
      <div className="flex  gap-3  ">
        <div className="flex w-fit items-center gap-1  bg-[#EEF2FF] p-1.5 rounded-xl shadow-xl">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={selectedDateFilter === value}
              onClick={() => handleChange(value)}
              className={cn(
                "rounded-xl px-2.5 hover:text-green-700 cursor-pointer hover:bg-white hover:scale-110",
                selectedDateFilter === value && "bg-white text-green-700",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center rounded-xl shadow-xl gap-2 bg-white  py-1 px-2">
          <Calendar size={18} className="text-gray-400" />
          <p className="flex font-extralight text-gray-700 ">
            {selectedDateFilter === "day" && (
              <span className="mr-1">{`${getPeriodDay(period.start)}, `}</span>
            )}
            <span>
              {periodFormat(period.start, selectedDateFilter === "day")}
            </span>

            <span
              className={cn(
                "font-vietnam",
                selectedDateFilter === "day" && "hidden",
              )}
            >
              {"-"}
              {periodFormat(period.end, true)}
            </span>
          </p>
        </div>
      </div>

      <div className="flex gap-3   ">
        <button onClick={()=>exportCSV(trans)} className="flex gap-1.5 text-black bg-white shadow-xl items-center justify-center px-2 rounded-xl hover:cursor-pointer ">
          <Download color="black" size={16} />
          <span className="flex items-center">Xuất file</span>
        </button>
        <button
          onClick={() => setOpenForm()}
          className="flex gap-1 text-white items-center justify-center py-1 bg-green-700 rounded-xl px-2 hover:scale-105 hover:cursor-pointer "
        >
          <Plus color="white" size={16} />
          Thêm chi tiêu
        </button>
      </div>
    </div>
  );
};

export default DesktopHeader;
