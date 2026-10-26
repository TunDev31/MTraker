import {
  Landmark,
  Banknote,
  CreditCard,
  ShieldAlert,
  ArrowLeftRight,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/Format/formatCurrency";

// ── helpers ──
function getWalletIcon(walletName = "", size = "md") {
  const lower = walletName.toLowerCase();
  const sizeClass = size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const iconSize = size === "lg" ? "h-6 w-6" : "h-5 w-5";

  if (lower.includes("mặt") || lower.includes("cash") || lower.includes("tien")) {
    return (
      <span className={cn("flex items-center justify-center rounded-full bg-green-100", sizeClass)}>
        <Banknote className={cn(iconSize, "text-green-600")} />
      </span>
    );
  }
  if (lower.includes("momo")) {
    return (
      <span className={cn("flex items-center justify-center rounded-full bg-pink-100", sizeClass)}>
        <span className={size === "lg" ? "text-xl font-black text-pink-600" : "text-sm font-bold text-pink-500"}>
          M
        </span>
      </span>
    );
  }
  if (lower.includes("zalopay") || lower.includes("zalo")) {
    return (
      <span className={cn("flex items-center justify-center rounded-full bg-blue-100", sizeClass)}>
        <span className={size === "lg" ? "text-xl font-black text-blue-600" : "text-sm font-bold text-blue-500"}>
          Z
        </span>
      </span>
    );
  }
  return (
    <span className={cn("flex items-center justify-center rounded-full bg-indigo-100", sizeClass)}>
      <Landmark className={cn(iconSize, "text-indigo-500")} />
    </span>
  );
}

function getWalletGradient(walletName = "") {
  const lower = walletName.toLowerCase();
  if (lower.includes("mặt") || lower.includes("cash")) return "from-green-700 to-emerald-900";
  if (lower.includes("momo")) return "from-pink-600 to-rose-800";
  if (lower.includes("zalopay") || lower.includes("zalo")) return "from-blue-600 to-blue-900";
  return "from-slate-700 to-slate-900";
}

function SpendingProgress({ wallet }) {
  const spent = wallet?.spent || 0;
  const limit = wallet?.spendingLimit || 0;
  if (!limit) return null;
  const pct = Math.min(100, (spent / limit) * 100);
  const isWarning = pct >= 80;
  const isDanger = pct >= 100;
  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex justify-between text-xs">
        <span
          className={cn(
            "font-medium",
            isDanger ? "text-red-600" : isWarning ? "text-orange-600" : "text-gray-500",
          )}
        >
          Chi tiêu tháng này
        </span>
        <span className="font-semibold text-gray-700 tabular-nums">
          {formatCurrency(spent, "vi-VN")} / {formatCurrency(limit, "vi-VN")}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            isDanger ? "bg-red-500" : isWarning ? "bg-orange-400" : "bg-green-500",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isWarning && (
        <p className={cn("text-xs font-medium", isDanger ? "text-red-600" : "text-orange-600")}>
          ⚠ {isDanger ? "Đã vượt giới hạn chi tiêu!" : `Đã dùng ${pct.toFixed(0)}% giới hạn`}
        </p>
      )}
    </div>
  );
}

// ── component ──
const WalletCard = ({
  wallet,
  ownerName,
  isSelected,
  isMenuOpen,
  balanceVisible,
  onSelect,
  onToggleMenu,
  onEditLimit,
  onSpendingLimit,
  onTransfer,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative bg-white rounded-2xl shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden",
        isSelected
          ? "border-green-300 ring-2 ring-green-200"
          : "border-gray-100 hover:border-gray-200",
      )}
    >
      {/* Card Visual Top */}
      <div
        className={cn(
          "relative bg-linear-to-br p-5 text-white",
          getWalletGradient(wallet.walletName),
        )}
      >
        <span className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/5" />
        <span className="absolute -bottom-4 right-8 h-16 w-16 rounded-full bg-white/5" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-2">
            {getWalletIcon(wallet.walletName)}
            <div>
              <p className="font-semibold text-sm">{wallet.walletName}</p>
              <p className="text-xs text-white/60 mt-0.5">{ownerName}</p>
            </div>
          </div>

          {/* Context menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onToggleMenu}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 text-gray-700 text-sm">
                <button
                  onClick={onEditLimit}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Điều chỉnh hạn mức
                </button>
                <button
                  onClick={onSpendingLimit}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Giới hạn chi tiêu
                </button>
                <button
                  onClick={onTransfer}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Nạp / Rút tiền
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa ví
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4 relative z-10">
          <p className="text-xs text-white/50 mb-0.5">Số dư khả dụng</p>
          <p className="text-xl font-bold tabular-nums">
            {balanceVisible ? formatCurrency(wallet.remainAmount, "vi-VN") : "••••••••"}
          </p>
        </div>

        {isSelected && (
          <span className="absolute bottom-3 left-3 text-[10px] font-semibold tracking-widest text-green-300 uppercase">
            ✓ Đang chọn
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <CreditCard className="w-3 h-3" />
              Hạn mức
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {wallet.limit ? (
                formatCurrency(wallet.limit, "vi-VN")
              ) : (
                <span className="text-gray-400 text-xs">Không giới hạn</span>
              )}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <ShieldAlert className="w-3 h-3" />
              Giới hạn CT
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {wallet.spendingLimit ? (
                formatCurrency(wallet.spendingLimit, "vi-VN")
              ) : (
                <span className="text-gray-400 text-xs">Chưa đặt</span>
              )}
            </p>
          </div>
        </div>

        <SpendingProgress wallet={wallet} />

        
      </div>
    </div>
  );
};

export default WalletCard;