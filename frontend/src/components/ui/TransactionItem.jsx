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
} from "lucide-react";
import { useState } from "react";
function TransactionItem({ item, deleteTransaction }) {
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
  const hourString = formattedHour+":"+formattedMinute;
  
  return (
    <tr
      onDoubleClick={()=>setOpenTransDetail(true)}
    className="flex border-b  hover:bg-gray-200 hover:border hover:border-(--Green-color) transition-colors">
      {/* Cột 1: Transaction info */}
      <td className={`flex items-center py-1 px-2 gap-2 ${isOpenTransDetails ? 'hidden' : ''}`}>
        <div className="bg-red-400 rounded-full">
          <IconComponent className="m-2 text-black rounded-full" />
        </div>
      </td>
      <td className={`flex items-center w-full py-1 px-2 gap-2 ${isOpenTransDetails ? 'hidden' : ''}` }>
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
          
            {item.tag?.map((tag,index) => {
              return (
                <div key={index} className="flex justify-between">
                <div  className="bg-blue-200 text-black rounded-xl m-0.5">
                  #{tag}
                </div>
                <div>
                  {hourString}
                </div>
                 </div>
              );
            })}
           
         
        </div>
      </td>
      <td colSpan={2} className={`min-h-16 ${isOpenTransDetails ? '':'hidden'}`}>
        <div className="flex p-3 h-full w-full">
          <button 
          className="text-red-500 rounded-full p-1 border border-red-500"
          onClick={()=> {
            deleteTransaction(item._id);
            setOpenTransDetail(false);

          }}>X</button>
        </div>
      </td>
    </tr>
  );
}
export default TransactionItem;
