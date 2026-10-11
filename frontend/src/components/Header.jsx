import { cn } from "@/lib/utils";
import {  CircleDollarSign } from "lucide-react";
import { useState } from "react";
const Header = ({ setSelectedDateFilter,setOffset }) => {
   const today = new Date();
 

  const [selectedValue, setSelectedValue] = useState("day");
  const handleChange = (value) => {
    if (!value) return;
    setSelectedValue(value);
    setSelectedDateFilter(value);
    setOffset(0);
  };
  const formattedDate = today.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header
      className="flex w-full items-center justify-between  border-b-2
     border-b-black bg-white/80  backdrop-blur-md z-50 "
    >
      <div className="flex items-center gap-1 group cursor-pointer justify-center mb-2">
        <CircleDollarSign className="w-7 h-7 text-green-700 transition-transform group-hover:scale-105" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black bg-clip-text group-hover:scale-105 transition-transform">
            MTracker
          </h1>
           <p className="text-xs sm:text-sm font-medium">{formattedDate}</p>
        </div>
      </div>

      {/* KHU VỰC TÌM KIẾM & THÔNG BÁO */}
      <div className="flex items-center gap-1 justify-between flex-row">
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
    </header>
  );
};

export default Header;
