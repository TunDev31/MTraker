import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Film,
  HelpCircle,
  Pencil,
  RotateCcw,
  Tag,
  Trash2,
  Utensils,
  Van,
  Wallet,
  X,
} from "lucide-react";
import React, { useState } from "react";
import MyCombobox from "./ui/MyCombobox";
import { useUpdateTrans } from "@/hooks/useUpdateTrans";

const WALLET_OPTIONS = [
  { value: "cash", label: "Tiền mặt" },
  { value: "momo", label: "Ví MoMo" },
  { value: "bidv", label: "BIDV" },
  { value: "sacombank", label: "Sacombank" },
];

const WALLET_LABELS = {
  cash: "Tiền mặt",
  momo: "Ví MoMo",
  bidv: "BIDV",
  sacombank: "Sacombank",
};

const TAG_CONFIG = {
  food: { label: "Ăn uống", icon: Utensils },
  travel: { label: "Đi lại", icon: Van },
  entertainment: { label: "Giải trí", icon: Film },
};

const TransactionsDetails = ({
  item,
  onClose,
  deleteTransaction,
  handleUpdateTransaction,
}) => {
  const [isRewriteEnable, setRewriteEnable] = useState(false);

  const {
    spendingName,
    spendingAmount,
    spendingDesc,
    selectedType,
    selectedTag,
    selectedCashType,
    setSelectedType,
    setSelectedCashType,
    setSpendingName,
    setSpendingAmount,
    handleSubmit,
    setSpendingDesc,
    handleTagSelect,
  } = useUpdateTrans(setRewriteEnable, item, handleUpdateTransaction);

  const itemDate = new Date(item?.createdAt || Date.now());
  const timeString = itemDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = itemDate.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const primaryTagKey = selectedTag?.[0]?.toLowerCase();
  const TagIcon = TAG_CONFIG[primaryTagKey]?.icon || HelpCircle;

  const isExpense = selectedType === "expense";

  const handleCancelEdit = () => {
    // Khôi phục lại trạng thái ban đầu từ item
    if (item) {
      setSelectedType(item.type || "expense");
      setSelectedCashType(item.walletType || "cash");
      setSpendingName(item.title || "");
      setSpendingAmount(item.amount || 0);
      setSpendingDesc(item.description || "");
    }
    setRewriteEnable(false);
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-5 shadow-2xl transition-all duration-200 text-gray-800">
      {/* < Header: Icon, Tiêu đề, Thời gian & Nút Đóng >*/}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-xs",
              isExpense
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            )}
          >
            <TagIcon size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 leading-tight">
              Chi tiết giao dịch
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
              <Calendar size={12} />
              <span>{dateString}</span>
              <span>•</span>
              <span>{timeString}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Đóng"
        >
          <X size={18} />
        </button>
      </div>
      {/* < Header: Icon, Tiêu đề, Thời gian & Nút Đóng  /> */}

      <div className="flex flex-col gap-4 mt-4">
        {/* < 2. Bộ chọn Loại giao dịch (Chi tiêu / Thu nhập) >*/}
        {isRewriteEnable ? (
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
                    : "text-gray-600 hover:text-gray-900"
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
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <ArrowUpRight size={16} />
                Thu nhập (Income)
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                isExpense
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-200"
              )}
            >
              {isExpense ? (
                <>
                  <ArrowDownLeft size={14} /> Khoản chi tiêu
                </>
              ) : (
                <>
                  <ArrowUpRight size={14} /> Khoản thu nhập
                </>
              )}
            </span>
          </div>
        )}

        {/* 3. Card Số tiền */}
        <div
          className={cn(
            "p-3.5 rounded-2xl border transition-all",
            isExpense
              ? "bg-red-50/70 border-red-200/80"
              : "bg-emerald-50/70 border-emerald-200/80"
          )}
        >
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider mb-1",
              isExpense ? "text-red-700" : "text-emerald-700"
            )}
          >
            {isExpense ? "Số tiền chi" : "Số tiền nhận"}
          </p>

          {!isRewriteEnable ? (
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-2xl sm:text-3xl font-extrabold tracking-tight",
                  isExpense ? "text-red-600" : "text-emerald-600"
                )}
              >
                {isExpense ? "- " : "+ "}
                {Number(spendingAmount || 0).toLocaleString("vi-VN")}
              </span>
              <span
                className={cn(
                  "text-base font-bold",
                  isExpense ? "text-red-500" : "text-emerald-500"
                )}
              >
                ₫
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-300 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
              <span
                className={cn(
                  "font-bold text-lg",
                  isExpense ? "text-red-500" : "text-emerald-500"
                )}
              >
                {isExpense ? "-" : "+"}
              </span>
              <input
                type="number"
                value={spendingAmount}
                onChange={(e) => setSpendingAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full text-xl font-bold bg-transparent outline-none focus:outline-none text-gray-900"
              />
              <span className="text-gray-400 font-semibold text-xs">VND</span>
            </div>
          )}
        </div>

        {/* 4. Tên giao dịch */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Tên giao dịch
          </label>
          {!isRewriteEnable ? (
            <p className="text-base font-bold text-gray-900 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
              {spendingName || "Chưa đặt tên"}
            </p>
          ) : (
            <input
              type="text"
              value={spendingName}
              onChange={(e) => setSpendingName(e.target.value)}
              placeholder="VD: Tiền chợ, Lương tháng..."
              className="w-full text-sm font-semibold bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none transition-all"
            />
          )}
        </div>

        {/* 5. Danh mục (Tags) & Phương thức (Ví) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Danh mục */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Tag size={13} /> Danh mục
            </label>
            {!isRewriteEnable ? (
              <div className="flex flex-wrap gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-100 min-h-[42px] items-center">
                {selectedTag?.length > 0 ? (
                  selectedTag.map((tag, idx) => {
                    const cfg = TAG_CONFIG[tag?.toLowerCase()];
                    const Icon = cfg?.icon || HelpCircle;
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold px-2 py-0.5 rounded-lg"
                      >
                        <Icon size={12} />
                        {cfg?.label || tag}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    Không có tag
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 p-1">
                {Object.entries(TAG_CONFIG).map(([key, cfg]) => {
                  const isChecked = selectedTag?.includes(key);
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTagSelect({ target: { value: key } })}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
                        isChecked
                          ? "bg-[#ccff00] text-black border-[#ccff00] font-bold shadow-xs"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      )}
                    >
                      <Icon size={13} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Phương thức ví */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Wallet size={13} /> Phương thức
            </label>
            {!isRewriteEnable ? (
              <div className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100 min-h-[42px]">
                <span className="text-sm font-semibold text-gray-800">
                  {WALLET_LABELS[selectedCashType] || selectedCashType}
                </span>
              </div>
            ) : (
              <MyCombobox
                className="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl hover:bg-white"
                placeholder="Loại Ví"
                searchPlaceholder="Tìm ví..."
                emptyMessage="Không tìm thấy ví"
                value={selectedCashType}
                onChange={(val) => setSelectedCashType(val)}
                data={WALLET_OPTIONS}
              />
            )}
          </div>
        </div>

        {/* 6. Mô tả */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Mô tả chi tiết
          </label>
          {!isRewriteEnable ? (
            <p className="text-sm text-gray-700 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 min-h-[38px] flex items-center">
              {spendingDesc ? (
                spendingDesc
              ) : (
                <span className="text-gray-400 italic">Không có mô tả</span>
              )}
            </p>
          ) : (
            <textarea
              rows={2}
              value={spendingDesc}
              onChange={(e) => setSpendingDesc(e.target.value)}
              placeholder="Nhập ghi chú thêm cho giao dịch..."
              className="w-full text-sm bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl px-3 py-2 outline-none resize-none transition-all placeholder:text-gray-400"
            />
          )}
        </div>
      </div>

      {/* 7. Action Buttons ở đáy */}
      <div className="flex items-center justify-between gap-3 mt-1 pt-1 border-t border-gray-100">
        {!isRewriteEnable ? (
          <>
            <button
              type="button"
              onClick={() => {
                deleteTransaction(item._id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 size={15} />
              Xóa
            </button>

            <button
              type="button"
              onClick={() => setRewriteEnable(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white bg-[#1e1f24] hover:bg-black text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Pencil size={15} />
              Chỉnh sửa
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw size={14} />
              Hủy
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-black bg-[#ccff00] hover:bg-[#b8e600] font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Check size={16} />
              Lưu thay đổi
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsDetails;
