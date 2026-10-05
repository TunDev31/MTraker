import React from "react";
import { BanknoteArrowDown, BanknoteArrowUp, X } from "lucide-react";
import { z } from "zod";
import { useWalletStore } from "@/stores/useWalletStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import MyCombobox from "./ui/MyCombobox";


// 1. Cập nhật Schema đồng bộ với tất cả các input trong Form
const walletTransferSchema = z.object({
  type: z.enum(["withdraw", "deposit"], {
    message: "Vui lòng chọn loại giao dịch!",
  }),
  walletName: z
    .string()
    .min(1, "Bạn chưa chọn hoặc nhập tên ví!")
    .max(20, "Tên ví tối đa chỉ 20 kí tự!"),
  amount: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số!" })
    .positive("Số tiền phải lớn hơn 0!")
    .int("Số tiền phải là số nguyên!"),
});

const defaultFormValues = {
  walletName: "",
  amount: 0,
  type: "deposit",
};

const WalletTransferForm = ({ setWalletTransferForm }) => {
  const getWalletOptions = useWalletStore((state) => state.getWalletOptions);
  const updateWallet = useWalletStore((state) => state.updateWallet);
  const options = getWalletOptions ? getWalletOptions() : [];

  const {
    register,
    handleSubmit,
    control, 
    setValue,
   watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(walletTransferSchema),
    defaultValues: defaultFormValues,
  });
 const add = (n) => {
    const current = Number(watch("amount")) || 0;
    setValue("amount", current + n, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  const onSubmit = async (data) => {
    try {
      // 3. Đúng tên trường dữ liệu từ form
      await updateWallet(data.walletName, data.amount, data.type); // Refresh danh sách ví
      setWalletTransferForm(false); // Đóng modal
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-800">Nạp / Rút</h3>
          <button
            type="button"
            onClick={() => setWalletTransferForm(false)}
            className="rounded-lg p-1 text-gray-700 bg-gray-100 "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Loại giao dịch */}
          {/* Loại giao dịch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại giao dịch
            </label>

            <div className="grid grid-cols-2 gap-2 bg-[#EFF4FF] p-2 rounded-xl">
              {/* Nạp tiền: xanh */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="deposit"
                  {...register("type")}
                  className="peer sr-only"
                />
                <div
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#EFF4FF] py-2.5 text-center text-sm font-semibold text-[#0F172A] transition
                   peer-checked:border-white peer-checked:bg-white peer-checked:text-green-600
                   peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2"
                >
                   <BanknoteArrowUp />
                  Nạp tiền
                </div>
              </label>

              {/* Rút tiền: đỏ */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="withdraw"
                  {...register("type")}
                  className="peer sr-only"
                />
                <div
                   className="flex items-center justify-center gap-2 rounded-xl bg-[#EFF4FF] py-2.5 text-center text-sm font-semibold text-[#0F172A] transition
                   peer-checked:border-white peer-checked:bg-white peer-checked:text-red-600
                   peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2"
                >
                 <BanknoteArrowDown />
                  Rút tiền
                </div>
              </label>
            </div>

            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Tên ví (Combobox) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên ví
            </label>
            <Controller
              name="walletName" // Đổi walletType thành walletName cho khớp với Schema
              control={control}
              render={({ field }) => (
                <MyCombobox
                  value={field.value}
                  onChange={field.onChange}
                  data={options}
                  placeholder="Chọn ví thực hiện giao dịch..."
                  className='bg-[#EFF4FF] text-gray-700 w-full p-4'
                />
              )}
            />
            {errors.walletName && (
              <div className="mt-1.5 rounded-lg bg-red-50 p-2 text-xs text-red-600">
                {errors.walletName.message}
              </div>
            )}
          </div>

          {/* Số tiền giao dịch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền giao dịch
            </label>
            <input
              type="number"
              placeholder="0"
              {...register("amount")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-[#EFF4FF] focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.amount && (
              <div className="mt-1.5 rounded-lg bg-red-50 p-2 text-xs text-red-600">
                {errors.amount.message}
              </div>
            )}
          </div>

          {/* Số dư ban đầu */}
            <div className="grid grid-cols-3 gap-2">
              <button type="button" className="bg-[#EFF4FF] p-2 rounded-xl" onClick={() => add(10000)}>+10,000</button>
              <button type="button" className="bg-[#EFF4FF] p-2 rounded-xl" onClick={() => add(50000)}>+50,000</button>
              <button type="button" className="bg-[#EFF4FF] p-2 rounded-xl" onClick={() => add(100000)}>+100,000</button>
            </div>
          {/* Nút bấm hành động */}
          <div className="flex justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setWalletTransferForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletTransferForm;
