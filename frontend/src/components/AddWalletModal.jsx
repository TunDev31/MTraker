import { useState } from "react";
import { X, Landmark, Banknote, Plus, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores/useWalletStore";

const schema = z.object({
  walletName: z.string().min(1, "Tên ví không được để trống!").max(50, "Tên ví tối đa 50 ký tự!"),
  remainAmount: z.coerce
    .number({ message: "Vui lòng nhập số hợp lệ!" })
    .min(0, "Số dư không được âm!")
    .int("Số dư phải là số nguyên!"),
  limit: z.coerce
    .number({ message: "Vui lòng nhập số hợp lệ!" })
    .min(0, "Hạn mức không được âm!")
    .int("Hạn mức phải là số nguyên!")
    .optional()
    .or(z.literal("")),
  spendingLimit: z.coerce
    .number({ message: "Vui lòng nhập số hợp lệ!" })
    .min(0, "Giới hạn chi tiêu không được âm!")
    .int("Giới hạn chi tiêu phải là số nguyên!")
    .optional()
    .or(z.literal("")),
});

const WALLET_TYPES = [
  { key: "bank", label: "Ngân hàng", icon: Landmark, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { key: "cash", label: "Tiền mặt", icon: Banknote, color: "bg-green-50 text-green-600 border-green-200" },
  { key: "ewallet", label: "Ví điện tử", icon: Wallet, color: "bg-purple-50 text-purple-600 border-purple-200" },
];

const QUICK_AMOUNTS = [100000, 500000, 1000000, 5000000];

const AddWalletModal = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState("bank");
  const createWallet = useWalletStore((s) => s.createWallet);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { walletName: "", remainAmount: 0, limit: "", spendingLimit: "" },
  });

  const addQuickAmount = (n) => {
    const current = Number(watch("remainAmount")) || 0;
    setValue("remainAmount", current + n, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    const ok = await createWallet(data.walletName, data.remainAmount);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">Thêm ví mới</h3>
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
          {/* Loại ví */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại ví</label>
            <div className="grid grid-cols-3 gap-2">
              {WALLET_TYPES.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedType(key)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                    selectedType === key
                      ? color + " border-current"
                      : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tên ví */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên ví <span className="text-red-500">*</span>
            </label>
            <input
              {...register("walletName")}
              placeholder="VD: Vietcombank, Tiền mặt..."
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500/30 transition",
                errors.walletName ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              )}
            />
            {errors.walletName && (
              <p className="mt-1 text-xs text-red-600">{errors.walletName.message}</p>
            )}
          </div>

          {/* Số dư ban đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số dư ban đầu (VND)
            </label>
            <input
              type="number"
              {...register("remainAmount")}
              placeholder="0"
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500/30 transition",
                errors.remainAmount ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              )}
            />
            {errors.remainAmount && (
              <p className="mt-1 text-xs text-red-600">{errors.remainAmount.message}</p>
            )}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {QUICK_AMOUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => addQuickAmount(n)}
                  className="bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-1.5 rounded-lg transition-colors"
                >
                  +{n.toLocaleString("vi-VN")}
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
              className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo ví"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWalletModal;
