import { cn } from "@/lib/utils";
import TransactionsIcon from "./TransactionsIcon";
import { ICON_CLASS, ICON_TEXTCOLOR } from "@/utils/SpendingUtils/TransactionsIconUtils";
import { Banknote, Landmark } from "lucide-react";

function TransactionItem({ item, setSelectedItem }) {
  const iconKey = item.tag
  const itemDate = new Date(item.createdAt);
  const hourString =
    String(itemDate.getHours()).padStart(2, "0") +
    ":" +
    String(itemDate.getMinutes()).padStart(2, "0");

  const isExpense = item.type === "expense";

  return (
    <div>
      <button
        type="button"
        onClick={() => setSelectedItem(item)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--Green-color)"
      >
        {/* Icon */}
        

        {/* Tên + tag */}
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-base font-semibold text-gray-900">
            {item.title}
          </span>
          <span className="flex flex-wrap gap-1">
           
              <span className={cn(`inline-flex px-1 items-center gap-1 text-xs ${ICON_TEXTCOLOR[item.tag]} font-semibold rounded-lg `,ICON_CLASS[item.tag])}>
                      
                      #{item.tag}
                    </span>
           
            <span className="flex gap-1 justify-center items-center text-sm font-semibold text-gray-900">
                    {item?.walletType ==="Tiền mặt" ? <Banknote color="green" /> : <Landmark />}
                    {item?.walletType || "Không xác định"}
                  </span>
          </span>
        </span>

        {/* Số tiền + giờ */}
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={cn(
              "whitespace-nowrap text-base font-semibold tabular-nums",
              isExpense ? "text-red-600" : "text-green-600",
            )}
          >
            {isExpense ? "- " : "+ "}
            {Number(item.amount).toLocaleString("vi-VN")}
            <span className="ml-1 text-xs font-medium text-gray-400">VND</span>
          </span>
          <span className="text-xs tabular-nums text-gray-500">
            {hourString}
          </span>
        </span>
      </button>
    </div>
  );
}

export default TransactionItem;