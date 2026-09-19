// Component này chỉ đóng vai trò là 1 hàng (<tr>)
import { cn } from "@/lib/utils";
import {
  Film,
  HelpCircle,
  Info,
  ShoppingCart,
  Utensils,
  Van,
  Apple,
  EllipsisVertical,
} from "lucide-react";
import { useState } from "react";
function TransactionItem({ item,
                setSelectedItem }) {
  const [isOpenTransDetails, setOpenTransDetail] = useState(false);
  const ICON_MAP = {
    food: Utensils,
    travel: Van,
    entertainment: Film,
  };
  const iconKey = item.tag?.[0]?.toLowerCase();
  const IconComponent = ICON_MAP[iconKey] || HelpCircle;

  const itemDate = new Date(item.createdAt);
  const hour = itemDate.getHours();
  const minute = itemDate.getMinutes();
  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");
  const hourString = formattedHour + ":" + formattedMinute;

  return (
    <tr
      onDoubleClick={() => setSelectedItem(item)}
      className="flex border-b  hover:bg-gray-200 hover:border hover:border-(--Green-color) transition-colors"
    >
      {/* Cột 1: Transaction info */}
      <td
        className={`flex items-center py-1 px-2 gap-2 ${isOpenTransDetails ? "hidden" : ""}`}
      >
        <div className="bg-red-100 rounded-full">
          <IconComponent className="m-2 text-red-500 rounded-full" />
        </div>
      </td>

      <td
        className={`flex items-center w-full py-1 px-2 gap-2 ${isOpenTransDetails ? "hidden" : ""}`}
      >
        <div className="flex flex-col w-full">
          <div className="flex justify-between w-full items-center">
            <span className="font-bold text-xl">{item.title}</span>
            <span
              className={cn(
                "flex items-center truncate px-2 font-semibold gap-1 text-center text-xl whitespace-nowrap",
                item.type === "expense" ? "text-red-500" : "text-green-400",
              )}
            >
              {item.type === "expense" ? "- " : "+ "}
              {item.amount} <span className="text-xl text-shadow-black">đ</span>
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              {item.tag?.map((tag, index) => 
              
                 (
                  <div key={index} className="flex justify-between">
                    <div className="bg-blue-200 text-black rounded-xl px-1.5">
                      #{tag}
                    </div>
                  </div>
                )
              )}
            </div>
            {hourString}
            
          </div>
          
        </div>
       
      </td>
    </tr>
  );
}
export default TransactionItem;
