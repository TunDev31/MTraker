import { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatCurrency } from "@/utils/Format/formatCurrency";

const schema = z.object({
  limit: z.coerce
    .number({ message: "Vui lòng nhập số hợp lệ!" })
    .min(0, "Hạn mức không được âm!")
    .int("Hạn mức phải là số nguyên!"),
});

const QUICK_LIMITS = [5000000, 10000000, 20000000, 50000000];

const EditLimitModal = ({ wallet, onClose }) => {
  const updateWalletLimit = useWalletStore((s) => s.updateWalletLimit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { limit: wallet?.limit || 0 },
  });

  useEffect(() => {
    setValue("limit", wallet?.limit || 0);
  }, [wallet, setValue]);

  const onSubmit = async (data) => {
    const ok = await updateWalletLimit(wallet._id, data.limit);
    if (ok) onClose();
  };

  const currentLimit = watch("limit");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">Điều chỉnh hạn mức</h3>
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
          {/* Thông tin ví hiện tại */}
          <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-blue-500 font-medium">Số dư hiện tại</p>
              <p className="text-base font-bold text-blue-800">
                {formatCurrency(wallet?.remainAmount || 0, "vi-VN")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-500 font-medium">Hạn mức hiện tại</p>
              <p className="text-base font-bold text-blue-800">
                {wallet?.limit ? formatCurrency(wallet.limit, "vi-VN") : "Không giới hạn"}
              </p>
            </div>
          </div>

          {/* Hạn mức mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hạn mức mới (VND)
            </label>
            <input
              type="number"
              {...register("limit")}
              placeholder="0 = Không giới hạn"
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition",
                errors.limit ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              )}
            />
            {errors.limit && (
              <p className="mt-1 text-xs text-red-600">{errors.limit.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Nhập 0 để không giới hạn hạn mức.</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {QUICK_LIMITS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue("limit", n, { shouldDirty: true })}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-medium transition-colors border",
                    Number(currentLimit) === n
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                  )}
                >
                  {n.toLocaleString("vi-VN")} đ
                </button>
              ))}
            </div>
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
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu hạn mức"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLimitModal;
