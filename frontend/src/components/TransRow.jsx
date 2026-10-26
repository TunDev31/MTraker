import { Banknote, Ellipsis, Landmark } from "lucide-react";
import { formatCurrency } from "@/utils/Format/formatCurrency";
import { cn } from "@/lib/utils";

import { ICON_CLASS, ICON_TEXTCOLOR } from "@/utils/SpendingUtils/TransactionsIconUtils";

import { icon, iconLabel } from "@/utils/Icon/iconConfig";
import { useWalletStore } from "@/stores/useWalletStore";

const TransRow = ({ item, onSelect })=> {
  const getWalletById = useWalletStore((s)=>s.getWalletById);
  const wallet = getWalletById(item.walletId);
  const d = new Date(item.createdAt);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const isExpense = item.type === "expense";
const label = iconLabel[item?.tag]?.value || "None";
const Icon = icon[item?.tag]?.value ||Ellipsis ;
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-xl"
    >
      <Icon className={cn("p-1 w-10 h-10 rounded-xl",icon[item?.tag]?.class)} />

      <div className="flex flex-1 flex-col min-w-0 gap-0.5">
        <span className="truncate text-sm font-semibold text-gray-900">{item.title}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-md", ICON_TEXTCOLOR[item.tag], ICON_CLASS[item.tag])}>
           {label}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            {wallet?.walletName === "Tiền mặt" ? <Banknote size={11} className="text-green-600" /> : <Landmark size={11} />}
            {wallet?.walletName || "—"} · {time}
          </span>
        </div>
      </div>

      <span className={cn("text-sm font-bold tabular-nums shrink-0", isExpense ? "text-red-500" : "text-emerald-600")}>
        {isExpense ? "-" : "+"}{formatCurrency(item.amount)} 
      </span>
    </button>
  );
}
export default TransRow;