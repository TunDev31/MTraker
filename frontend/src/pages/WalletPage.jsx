import { useEffect, useState } from "react";
import {
  Plus,
  Landmark,
  Banknote,
  Wallet,
  CreditCard,
  ShieldAlert,
  ArrowLeftRight,
  Eye,
  EyeOff,
  TrendingDown,
  ChevronRight,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores/useWalletStore";
import { userStore } from "@/stores/useAuthStore";
import { formatCurrency } from "@/utils/Format/formatCurrency";
import AddWalletModal from "@/components/AddWalletModal";
import EditLimitModal from "@/components/EditLimitModal";
import SpendingLimitModal from "@/components/SpendingLimitModal";
import WalletTransferForm from "@/components/WalletTransferForm";
import WalletCard from "@/components/walletCard";

// ── helpers ────────────────────────────────────────────────────────────────────

function getWalletIcon(walletName = "", size = "md") {
  const lower = walletName.toLowerCase();
  const sizeClass = size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const iconSize = size === "lg" ? "h-6 w-6" : "h-5 w-5";

  if (
    lower.includes("mặt") ||
    lower.includes("cash") ||
    lower.includes("tien")
  ) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-green-100",
          sizeClass,
        )}
      >
        <Banknote className={cn(iconSize, "text-green-600")} />
      </span>
    );
  }
  if (lower.includes("momo")) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-pink-100",
          sizeClass,
        )}
      >
        <span
          className={
            size === "lg"
              ? "text-xl font-black text-pink-600"
              : "text-sm font-bold text-pink-500"
          }
        >
          M
        </span>
      </span>
    );
  }
  if (lower.includes("zalopay") || lower.includes("zalo")) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-blue-100",
          sizeClass,
        )}
      >
        <span
          className={
            size === "lg"
              ? "text-xl font-black text-blue-600"
              : "text-sm font-bold text-blue-500"
          }
        >
          Z
        </span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-indigo-100",
        sizeClass,
      )}
    >
      <Landmark className={cn(iconSize, "text-indigo-500")} />
    </span>
  );
}

function getWalletGradient(walletName = "") {
  const lower = walletName.toLowerCase();
  if (lower.includes("mặt") || lower.includes("cash"))
    return "from-green-700 to-emerald-900";
  if (lower.includes("momo")) return "from-pink-600 to-rose-800";
  if (lower.includes("zalopay") || lower.includes("zalo"))
    return "from-blue-600 to-blue-900";
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
            isDanger
              ? "text-red-600"
              : isWarning
                ? "text-orange-600"
                : "text-gray-500",
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
            isDanger
              ? "bg-red-500"
              : isWarning
                ? "bg-orange-400"
                : "bg-green-500",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isWarning && (
        <p
          className={cn(
            "text-xs font-medium",
            isDanger ? "text-red-600" : "text-orange-600",
          )}
        >
          ⚠{" "}
          {isDanger
            ? "Đã vượt giới hạn chi tiêu!"
            : `Đã dùng ${pct.toFixed(0)}% giới hạn`}
        </p>
      )}
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────

const WalletPage = () => {
  const wallets = useWalletStore((s) => s.wallets);
  const selectedWallet = useWalletStore((s) => s.selectedWallet);
  const changeWallet = useWalletStore((s) => s.changeWallet);
  const fetchWallets = useWalletStore((s) => s.fetchWallets);
  const loading = useWalletStore((s) => s.loading);
  const getTotalBalance = useWalletStore((s) => s.getTotalBalance);
  const deleteWallet = useWalletStore((s) => s.deleteWallet);

  const user = userStore((s) => s.user);

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditLimit, setOpenEditLimit] = useState(false);
  const [openSpendingLimit, setOpenSpendingLimit] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const totalBalance = getTotalBalance();
  const ownerName = user?.displayedName || "Người dùng";

  const handleDelete = async (walletId) => {
    if (!window.confirm("Bạn có chắc muốn xóa ví này không?")) return;
    await deleteWallet(walletId);
    setOpenMenuId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 p-4 md:p-8 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ví của tôi</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Quản lý tài khoản và giới hạn chi tiêu
          </p>
        </div>
        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm ví
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Tổng tài sản</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              {balanceVisible
                ? formatCurrency(totalBalance, "vi-VN")
                : "••••••••"}
            </p>
            <button
              onClick={() => setBalanceVisible((v) => !v)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {balanceVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Số ví liên kết</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {wallets.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            Có giới hạn chi tiêu
          </p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            {wallets.filter((w) => w.spendingLimit > 0).length}
          </p>
        </div>
      </div>

      {/* ── Wallet Cards Grid ── */}
      {wallets.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Wallet className="w-8 h-8 opacity-40" />
          </div>
          <div className="text-center">
            <p className="font-medium">Chưa có ví nào</p>
            <p className="text-sm text-gray-400 mt-1">
              Thêm ví để bắt đầu quản lý tài chính
            </p>
          </div>
          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm ví đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {wallets.map((wallet) => {
            const isMenuOpen = openMenuId === wallet._id;
            const openModal = (setter) => () => {
              changeWallet(wallet._id);
              setter(true);
              setOpenMenuId(null);
            };

            return (
              <WalletCard
                key={wallet._id}
                wallet={wallet}
                ownerName={ownerName}
                isSelected={selectedWallet?._id === wallet._id}
                isMenuOpen={isMenuOpen}
                balanceVisible={balanceVisible}
                onSelect={() => changeWallet(wallet._id)}
                onToggleMenu={() =>
                  setOpenMenuId(isMenuOpen ? null : wallet._id)
                }
                onEditLimit={openModal(setOpenEditLimit)}
                onSpendingLimit={openModal(setOpenSpendingLimit)}
                onTransfer={openModal(setOpenTransfer)}
                onDelete={() => handleDelete(wallet._id)}
              />
            );
          })}

          {/* Add wallet card */}
          <button
            onClick={() => setOpenAdd(true)}
            className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50/30 min-h-[200px] transition-all group"
          >
            <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 group-hover:text-green-700">
                Thêm ví mới
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Ngân hàng, ví điện tử...
              </p>
            </div>
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      {openAdd && <AddWalletModal onClose={() => setOpenAdd(false)} />}
      {openEditLimit && selectedWallet && (
        <EditLimitModal
          wallet={selectedWallet}
          onClose={() => setOpenEditLimit(false)}
        />
      )}
      {openSpendingLimit && selectedWallet && (
        <SpendingLimitModal
          wallet={selectedWallet}
          onClose={() => setOpenSpendingLimit(false)}
        />
      )}
      {openTransfer && (
        <WalletTransferForm setWalletTransferForm={setOpenTransfer} />
      )}
    </div>
  );
};

export default WalletPage;
