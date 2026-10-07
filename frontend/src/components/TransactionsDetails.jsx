import React, { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Calendar,
  HelpCircle,
  Landmark,
  Pencil,
  SquarePen,
  Tag,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import UpdatingTransForm, { TAG_CONFIG } from "./UpdatingTransForm";
import TransactionsIcon from "./TransactionsIcon";
import { ICON_CLASS, ICON_COLOR, ICON_MAP, ICON_TEXTCOLOR } from '@/utils/SpendingUtils/TransactionsIconUtils'
const TransactionsDetails = ({ item, onClose }) => {
  const [isRewriteEnable, setRewriteEnable] = useState(false);

  const deleteTransaction = useTransactionsStore(
    (state) => state.deleteTransaction,
  );

  // Luồng xóa: bấm Xóa -> xác nhận -> gọi API
  const [isConfirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

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

  // Chế độ xem luôn đọc trực tiếp từ item (store là nguồn dữ liệu duy nhất)
  const isExpense = (item?.type || "expense") === "expense";
  const tagKey = (item?.tag || "").toLowerCase();
  const tagCfg = TAG_CONFIG[tagKey];


  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError(false);
    try {
      const ok = await deleteTransaction(item._id);
      if (ok) {
        onClose(); // giao dịch đã bị gỡ khỏi store, đóng khung chi tiết
      } else {
        setDeleteError(true);
      }
    } catch {
      setDeleteError(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-5 shadow-2xl transition-all duration-200 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
            )}
          >
             {isRewriteEnable ? <SquarePen /> :  <TransactionsIcon type={item.tag} size={20} custom="rounded-full p-2"/>}
           
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 leading-tight">
              {isRewriteEnable ? "Chỉnh sửa giao dịch" : "Chi tiết giao dịch"}
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

      {isRewriteEnable ? (
        <UpdatingTransForm
          item={item}
          onCancel={() => setRewriteEnable(false)}
          onSaved={() => setRewriteEnable(false)}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 mt-4">
            {/* Badge loại giao dịch */}
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  isExpense
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-200",
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

            {/* Số tiền */}
            <div
              className={cn(
                "p-3.5 rounded-2xl border transition-all flex flex-col gap-1 justify-center items-center",
                isExpense
                  ? "bg-red-50/70 border-red-200/80"
                  : "bg-emerald-50/70 border-emerald-200/80",
              )}
            >
              <p
                className={cn(
                  "text-xs uppercase tracking-wider mb-1",
                  isExpense ? "text-red-700" : "text-emerald-700",
                )}
              >
                {isExpense ? "Số tiền chi" : "Số tiền nhận"}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-3xl sm:text-3xl font-extrabold tracking-tight",
                    isExpense ? "text-red-600" : "text-emerald-600",
                  )}
                >
                  {isExpense ? "- " : "+ "}
                  {Number(item?.amount || 0).toLocaleString("vi-VN")}
                </span>
                <span
                  className={cn(
                    "text-base font-bold",
                    isExpense ? "text-red-500" : "text-emerald-500",
                  )}
                >
                  VND
                </span>
              </div>
            </div>

            {/* Tên giao dịch */}
            <div className="space-y-1 flex justify-between items-center bg-gray-50 p-1">
              <label className="text-xs font-bold tracking-wider text-gray-900">
                Tên giao dịch
              </label>
              <p className="text-base font-bold text-gray-900 rounded-xl borde">
                {item?.title || "Chưa đặt tên"}
              </p>
            </div>

            {/* Danh mục & Phương thức */}
            <div className="flex flex-col gap-2">
              <div className="space-y-1 flex  justify-between items-center bg-gray-50 p-1">
                <label className="flex items-center gap-1 text-xs font-bold tracking-wider text-gray-900">
                   Danh mục
                </label>
                <div className="flex flex-wrap gap-1.5 rounded-xl  min-h-10.5 items-center ">
                  {item?.tag ? (
                    <span className={cn(`inline-flex px-1 items-center gap-1 text-xs ${ICON_TEXTCOLOR[item.tag]} font-semibold rounded-lg `,ICON_CLASS[item.tag])}>
                      <TransactionsIcon type={item.tag} custom="rounded-lg p-1"/>
                      {tagCfg?.label || item.tag}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      Không có tag
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 flex justify-between items-center bg-gray-50 p-1">
                <label className="flex items-center gap-1 text-xs font-bold tracking-wider text-gray-900">
                  Phương thức
                </label>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl border border-gray-100 min-h-10.5">
                  <span className="flex gap-1 justify-center items-center text-sm font-semibold text-gray-900">
                    {item?.walletType ==="Tiền mặt" ? <Banknote color="green" /> : <Landmark />}
                    {item?.walletType || "Không xác định"}
                  </span>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-gray-900">
                Mô tả chi tiết
              </label>
              <p className="text-sm text-gray-700 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 min-h-9.5 flex items-center">
                {item?.description ? (
                  item.description
                ) : (
                  <span className="text-gray-400 italic">Không có mô tả</span>
                )}
              </p>
            </div>
          </div>

          {/* Nút hành động: xóa / chỉnh sửa */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
            {isConfirmingDelete ? (
              <div className="flex w-full flex-col gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  Xóa giao dịch này?
                </p>
                <p className="text-xs text-gray-500">
                  Số dư ví sẽ được tính lại. Không thể hoàn tác.
                </p>
                {deleteError && (
                  <p role="alert" className="text-xs font-medium text-red-600">
                    Không xóa được, vui lòng thử lại.
                  </p>
                )}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      setConfirmingDelete(false);
                      setDeleteError(false);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    Giữ lại
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {isDeleting ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsDetails;