import { useState, useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatCurrency } from "@/utils/Format/formatCurrency";

const schema = z.object({
  spendingLimit: z.coerce
    .number({ message: "Vui lòng nhập số hợp lệ!" })
    .min(0, "Giới hạn không được âm!")
    .int("Giới hạn phải là số nguyên!"),
});

const QUICK_LIMITS = [1000000, 3000000, 5000000, 10000000];

const SpendingLimitModal = ({ wallet, onClose }) => {
  const updateSpendingLimit = useWalletStore((s) => s.updateSpendingLimit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { spendingLimit: wallet?.spendingLimit || 0 },
  });

  useEffect(() => {
    setValue("spendingLimit", wallet?.spendingLimit || 0);
  }, [wallet, setValue]);

  const currentSpendingLimit = watch("spendingLimit");

  // Tính % chi tiêu so với giới hạn (giả định spent được truyền từ wallet hoặc báo cáo)
  const spent = wallet?.spent || 0;
  const limitNum = wallet?.spendingLimit || 0;
  const spentPercent = limitNum > 0 ? Math.min(100, (spent / limitNum) * 100) : 0;

  const onSubmit = async (data) => {
    const ok = await updateSpendingLimit(wallet._id, data.spendingLimit);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">Giới hạn chi tiêu</h3>
              <p className="text-xs text-gray-500">{wallet?.walletName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Thống kê chi tiêu */}
          <div className="bg-orange-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-orange-500 font-medium">Đã chi tiêu (tháng này)</p>
                <p className="text-base font-bold text-orange-800">
                  {formatCurrency(spent, "vi-VN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-orange-500 font-medium">Giới hạn hiện tại</p>
                <p className="text-base font-bold text-orange-800">
                  {limitNum > 0 ? formatCurrency(limitNum, "vi-VN") : "Chưa đặt"}
                </p>
              </div>
            </div>
            {/* Progress bar */}
            {limitNum > 0 && (
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-orange-200">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      spentPercent >= 90 ? "bg-red-500" :
                      spentPercent >= 70 ? "bg-orange-500" : "bg-green-500"
                    )}
                    style={{ width: `${spentPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">{spentPercent.toFixed(1)}% giới hạn</p>
              </div>
            )}
          </div>

          {/* Giới hạn mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới hạn chi tiêu mới (VND/tháng)
            </label>
            <input
              type="number"
              {...register("spendingLimit")}
              placeholder="0 = Không giới hạn"
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/30 transition",
                errors.spendingLimit ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              )}
            />
            {errors.spendingLimit && (
              <p className="mt-1 text-xs text-red-600">{errors.spendingLimit.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Nhập 0 để tắt cảnh báo giới hạn chi tiêu.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {QUICK_LIMITS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue("spendingLimit", n, { shouldDirty: true })}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-medium transition-colors border",
                    Number(currentSpendingLimit) === n
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100"
                  )}
                >
                  {n.toLocaleString("vi-VN")} đ
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="flex gap-2 rounded-xl bg-yellow-50 border border-yellow-200 p-3">
            <ShieldAlert className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700">
              Bạn sẽ nhận cảnh báo khi chi tiêu vượt <strong>80%</strong> giới hạn đã đặt.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu giới hạn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpendingLimitModal;
