import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { useWalletStore } from "@/stores/useWalletStore";
import MyCombobox from "./ui/MyCombobox";

import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { toast } from "sonner";
import { useEffect } from "react";
import { Check, TrendingDown, TrendingUp } from "lucide-react";
import { useFormStore } from "@/stores/useFormStore";
import { TAG_OPTIONS } from "@/utils/temp/tagOption";

// 1. Định nghĩa Zod Schema

const TransactionForm = () => {
  // 2. Lấy danh sách ví từ Zustand Store
  const getWalletOptions = useWalletStore((state) => state.getWalletOptions);
  const updateWallet = useWalletStore((state) => state.updateWallet);
  const getWalletById = useWalletStore((state) => state.getWalletById);
  const options = getWalletOptions ? getWalletOptions() : [];
  const selectedWallet = useWalletStore((s) => s.selectedWallet);
  const createTransaction = useTransactionsStore(
    (state) => state.createTransaction,
  );

  const transactionSchema = z
    .object({
      title: z
        .string()
        .min(1, "Bạn chưa nhập tên giao dịch!")
        .max(20, "Tên giao dịch tối đa chỉ 20 kí tự!"),

      amount: z.coerce
        .number({ invalid_type_error: "Vui lòng nhập số!" })
        .positive("Số tiền phải lớn hơn 0!")
        .int("Số tiền phải là số nguyên!"),

      description: z
        .string()
        .max(100, "Mô tả chỉ tối đa 100 ký tự!")
        .optional(),
      tag: z.string().min(1, "Vui lòng chọn ít nhất 1 tag!"),
      type: z.enum(["expense", "income"], {
        errorMap: () => ({ message: "Loại giao dịch không hợp lệ!" }),
      }),
      walletId: z.string().min(1, "Bạn chưa chọn ví để thực hiện giao dịch!"),
    })
    .superRefine((data, ctx) => {
      if (data.type !== "expense") return;

      const wallet = getWalletById(data.walletId);
      const balance = wallet?.remainAmount ?? 0; // đổi "balance" đúng tên field số dư trong store của bạn

      if (data.amount > balance) {
        ctx.addIssue({
          code: "custom",
          path: ["amount"], // hiện lỗi ngay dưới ô số tiền
          message: `Số dư ví không đủ (còn ${balance.toLocaleString("vi-VN")}đ)!`,
        });
      }
    });
  const defaultFormValues = {
    title: "",
    amount: "",
    description: "",
    tag: "",
    type: "expense",
    walletId: selectedWallet.walletId,
  };
  // 3. Khởi tạo useForm
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });
  const type = watch("type");
  const walletCurrSelected = watch("walletId");
  const walletRemain = getWalletById(walletCurrSelected);
  const setOpenForm = useFormStore((s) => s.setOpenForm);
  // Chi tiêu: hiện mọi tag trừ "khac". Thu nhập: chỉ hiện "khac"
  const visibleTags = TAG_OPTIONS.filter((t) =>
    type === "income" ? t.value === "salary" : t.value !== "salary",
  );
  const onSubmit = async (data) => {
    try {
      const { walletId, ...transactionData } = data;

      const success = await createTransaction(transactionData, walletId);

      if (success) {
        const { walletId, amount, type } = data;

        updateWallet(walletId, amount, type);
        toast("Thêm giao dịch thành công!");
        setOpenForm();
      }
    } catch (error) {
      console.error("Lỗi khi tạo giao dịch:", error);
      toast("Thêm giao dịch thất bại!");
    }
  };
  useEffect(() => {
    setValue("tag", type === "income" ? "khac" : "");
  }, [type, setValue]);
  useEffect(() => {
  if (getValues("amount") !== "") trigger("amount");
}, [walletCurrSelected, type, trigger, getValues]);
  return (
    <div
      className="fixed inset-0 z-50 w-full h-full bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
      onClick={() => setOpenForm()}
    >
      <div
        className="relative w-full max-w-lg bg-white text-black rounded-2xl p-5 shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-green-200 p-1 text-green-800 flex items-center justify-center font-bold text-xl">
              +
            </div>
            <h3 className="text-black font-bold text-base uppercase tracking-wider">
              Thêm khoản giao dịch
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setOpenForm()}
            className="text-black bg-gray-200 rounded-md hover:text-red-500 text-xl font-bold p-2 transition-colors leading-none"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Tên giao dịch */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide"
            >
              Tên khoản giao dịch
            </label>
            <Input
              type="text"
              id="title"
              placeholder="VD: Mua trà sữa..."
              className="w-full bg-[#EFF4FF] border border-gray-700 focus:border-black focus:outline-none text-black text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Loại giao dịch */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Loại
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className=" cursor-pointer transition-all">
                <input
                  type="radio"
                  value="expense"
                  className=" w-4 h-4 peer sr-only"
                  {...register("type")}
                />
                <div
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#EFF4FF] py-2.5 text-center text-sm font-semibold text-[#0F172A] transition
                   peer-checked:border-white peer-checked:bg-red-100 peer-checked:text-red-800
                   peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2"
                >
                  <span className="flex gap-1 justify-center items-center text-sm font-medium">
                    <TrendingDown />
                    <p>Chi tiêu</p>
                  </span>
                </div>
              </label>

              <label className=" cursor-pointer transition-all">
                <input
                  type="radio"
                  value="income"
                  className="accent-[#ccff00] w-4 h-4 peer sr-only"
                  {...register("type")}
                />
                <div
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#EFF4FF] py-2.5 text-center text-sm font-semibold text-[#0F172A] transition
                   peer-checked:border-white peer-checked:bg-green-200 peer-checked:text-green-800
                   peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2"
                >
                  <span className="flex gap-1 justify-center items-center text-sm font-medium ">
                    <TrendingUp />
                    <p>Thu nhập</p>
                  </span>
                </div>
              </label>
            </div>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Ví giao dịch (Dùng Controller để binding với MyCombobox) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Loại Ví
            </label>
            <Controller
              name="walletId"
              control={control}
              render={({ field }) => (
                <MyCombobox
                  value={field.value}
                  onChange={field.onChange}
                  data={options}
                  className="w-full bg-[#EFF4FF] border border-gray-700"
                  placeholder="Chọn ví để thực hiện giao dịch"
                />
              )}
            />
            {errors.walletId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.walletId.message}
              </p>
            )}
          </div>

          {/* Số tiền */}
          <div>
            <label
              htmlFor="amount"
              className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide"
            >
              Số tiền (VND)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="VD: 50000"
              className="w-full bg-[#EFF4FF] border border-gray-700 text-black text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Tags
            </label>
            <div className="grid grid-cols-3 gap-1">
              {visibleTags.map((tagItem) => (
                <label
                  key={tagItem.value}
                  className="flex flex-col items-center justify-center rounded-xl gap-0.5 bg-[#2a2b30] border border-transparent  cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    value={tagItem.value}
                    className=" w-4 h-4 peer sr-only"
                    {...register("tag")}
                  />
                  <div
                    className="flex items-center justify-center w-full rounded-xl border border-gray-700 bg-[#EFF4FF] py-2.5 text-center text-sm font-semibold text-[#0F172A] transition
                   peer-checked:border-white peer-checked:bg-green-200 peer-checked:text-green-800
                   peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2"
                  >
                    <span className="text-xs font-medium text-black">
                      {tagItem.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {errors.tag && (
              <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Chi tiết nếu có..."
              className="w-full bg-[#EFF4FF] border border-gray-700 text-black text-sm rounded-xl px-3.5 py-2.5 transition-colors resize-none placeholder-[EFF4FF]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-1 mt-2 bg-green-800 hover:bg-green-800 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {!isSubmitting ? <Check /> : ""}
            {isSubmitting ? "Đang xử lý..." : "Thêm mới"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
