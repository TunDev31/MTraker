import React, { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Ban,
  Check,
  Film,
  HelpCircle,
  RotateCcw,
  ShoppingCart,
  Tag,
  Utensils,
  Van,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MyCombobox from "./ui/MyCombobox";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";

// Dùng chung với TransactionsDetails (import từ file này).
// Nếu muốn gọn hơn, có thể chuyển ra file riêng, ví dụ "@/constants/tags".
export const TAG_CONFIG = {
  food: { label: "Ăn uống", icon: Utensils },
  travel: { label: "Đi lại", icon: Van },
  entertainment: { label: "Giải trí", icon: Film },
  shopping: { label: "Mua sắm", icon: ShoppingCart },
  khac: { label: "Khác", icon: HelpCircle },
  none: { label: "Không có tag", icon: Ban },
};

/**
 * Form chỉnh sửa giao dịch.
 * @param item      giao dịch đang sửa
 * @param onCancel  gọi khi bấm Hủy
 * @param onSaved   gọi khi lưu thành công
 */
const UpdatingTransForm = ({ item, onCancel, onSaved }) => {
  const wallets = useWalletStore((state) => state.wallets);
  const walletOptions = useMemo(
    () => wallets.map((w) => ({ label: w.walletName, value: w.walletName })),
    [wallets],
  );

  const updateTransactions = useTransactionsStore(
    (state) => state.updateTransactions,
  );

  // State khởi tạo từ item. Form chỉ được mount khi bấm "Chỉnh sửa",
  // nên hủy form đồng nghĩa với việc bỏ toàn bộ thay đổi (không cần reset thủ công).
  const [selectedType, setSelectedType] = useState(item?.type || "expense");
  const [selectedCashType, setSelectedCashType] = useState(
    item?.walletType || "cash",
  );
  const [selectedTag, setSelectedTag] = useState(item?.tag || "");
  const [spendingName, setSpendingName] = useState(item?.title || "");
  const [spendingAmount, setSpendingAmount] = useState(item?.amount || 0);
  const [spendingDesc, setSpendingDesc] = useState(item?.description || "");

  const [isSaving, setIsSaving] = useState(false);
  const [updateError, setUpdateError] = useState(false);

  const isExpense = selectedType === "expense";
  const visibleTags = Object.entries(TAG_CONFIG).filter(
    ([key]) => key !== "none" && (isExpense ? key !== "khac" : key === "khac"),
  );

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (isSaving) return;
    if (!spendingName.trim() || Number(spendingAmount) <= 0 || !selectedTag)
      return;

    setIsSaving(true);
    setUpdateError(false);
    try {
      const ok = await updateTransactions({
        ...item,
        type: selectedType,
        walletType: selectedCashType,
        tag: selectedTag,
        title: spendingName.trim(),
        amount: Number(spendingAmount),
        description: spendingDesc,
      });

      // store trả false khi lỗi -> giữ form mở để người dùng thử lại
      if (ok === true) onSaved?.();
      else setUpdateError(true);
    } catch {
      setUpdateError(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mt-4">
        {/* Loại giao dịch */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Loại giao dịch
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedType("expense")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer",
                isExpense
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <ArrowDownLeft size={16} />
              Chi tiêu (Expense)
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("income")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer",
                !isExpense
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <ArrowUpRight size={16} />
              Thu nhập (Income)
            </button>
          </div>
        </div>

        {/* Số tiền */}
        <div
          className={cn(
            "p-3.5 rounded-2xl border transition-all",
            isExpense
              ? "bg-red-50/70 border-red-200/80"
              : "bg-emerald-50/70 border-emerald-200/80",
          )}
        >
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider mb-1",
              isExpense ? "text-red-700" : "text-emerald-700",
            )}
          >
            {isExpense ? "Số tiền chi" : "Số tiền nhận"}
          </p>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-300 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
            <span
              className={cn(
                "font-bold text-lg",
                isExpense ? "text-red-500" : "text-emerald-500",
              )}
            >
              {isExpense ? "-" : "+"}
            </span>
            <input
              type="number"
              value={spendingAmount}
              onChange={(e) => setSpendingAmount(e.target.value)}
              placeholder="0"
              className="w-full text-xl font-bold bg-transparent outline-none focus:outline-none text-gray-900"
            />
            <span className="text-gray-400 font-semibold text-xs">VND</span>
          </div>
        </div>

        {/* Tên giao dịch */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Tên giao dịch
          </label>
          <input
            type="text"
            value={spendingName}
            onChange={(e) => setSpendingName(e.target.value)}
            placeholder="VD: Tiền chợ, Lương tháng..."
            className="w-full text-sm font-semibold bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none transition-all"
          />
        </div>

        {/* Danh mục & Phương thức */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Tag size={13} /> Danh mục
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1">
              {visibleTags.map(([key, cfg]) => {
                const isChecked = selectedTag === key;
                const Icon = cfg.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTag(key)}
                    className={cn(
                      "flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
                      isChecked
                        ? "bg-[#ccff00] text-black border-[#ccff00] font-bold shadow-xs"
                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200",
                    )}
                  >
                    
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Wallet size={13} /> Phương thức
            </label>
            <MyCombobox
              className="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl hover:bg-white"
              placeholder="Loại Ví"
              searchPlaceholder="Tìm ví..."
              emptyMessage="Không tìm thấy ví"
              value={selectedCashType}
              onChange={(val) => setSelectedCashType(val)}
              data={walletOptions}
            />
          </div>
        </div>

        {/* Mô tả */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Mô tả chi tiết
          </label>
          <textarea
            rows={2}
            value={spendingDesc}
            onChange={(e) => setSpendingDesc(e.target.value)}
            placeholder="Nhập ghi chú thêm cho giao dịch..."
            className="w-full text-sm bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl px-3 py-2 outline-none resize-none transition-all placeholder:text-gray-400"
          />
        </div>

        {updateError && (
          <p role="alert" className="text-xs font-medium text-red-600">
            Không lưu được, vui lòng thử lại.
          </p>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Hủy
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-black bg-[#ccff00] hover:bg-[#b8e600] font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Check size={16} />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
};

export default UpdatingTransForm;