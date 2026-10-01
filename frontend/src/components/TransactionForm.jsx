import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { useWalletStore } from "@/stores/useWalletStore";
import MyCombobox from "./ui/MyCombobox";

import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { toast } from "sonner";
import { useEffect } from "react";


// 1. Định nghĩa Zod Schema
const transactionSchema = z.object({
  title: z
    .string()
    .min(1, "Bạn chưa nhập tên giao dịch!")
    .max(20, "Tên giao dịch tối đa chỉ 20 kí tự!"),
  amount: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số!" })
    .positive("Số tiền phải lớn hơn 0!")
    .int("Số tiền phải là số nguyên!"),
  description: z.string().max(100, "Mô tả chỉ tối đa 100 ký tự!").optional(),
  tag: z
    .string()
    .min(1, "Vui lòng chọn ít nhất 1 tag!"),
  type: z.enum(["expense", "income"], {
    errorMap: () => ({ message: "Loại giao dịch không hợp lệ!" }),
  }),
  walletType: z.string().min(1, "Bạn chưa chọn ví để thực hiện giao dịch!"),
});

const defaultFormValues = {
  title: "",
  amount: "",
  description: "",
  tag: "",
  type: "expense",
  walletType: "",
};

const TAG_OPTIONS = [
  { label: "ĂN UỐNG", value: "food" },
  { label: "ĐI LẠI", value: "travel" },
  { label: "GIẢI TRÍ", value: "entertainment" },
  { label: "MUA SẮM", value: "shopping" },
  { label: "KHÁC", value: "khac" },
];
const TransactionForm = ({ setIsOpenForm }) => {
  // 2. Lấy danh sách ví từ Zustand Store
  const getWalletOptions = useWalletStore((state) => state.getWalletOptions);
  const options = getWalletOptions ? getWalletOptions() : [];

  const createTransaction = useTransactionsStore((state) => state.createTransaction);

  // 3. Khởi tạo useForm
  const {
   register,
  handleSubmit,
  control,
  watch,
  setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultFormValues,
  });
const type = watch("type");

// Chi tiêu: hiện mọi tag trừ "khac". Thu nhập: chỉ hiện "khac"
const visibleTags = TAG_OPTIONS.filter((t) =>
  type === "income" ? t.value === "khac" : t.value !== "khac",
);
  const onSubmit = async (data) => {
    try {
      const success = await createTransaction(data);
      if (success) {
        toast("Thêm giao dịch thành công!");
        setIsOpenForm(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo giao dịch:", error);
      toast("Thêm giao dịch thất bại!");
    }
  };
useEffect(() => {
  setValue("tag", type === "income" ? "khac" : "");
}, [type, setValue]);
  return (
    <div
      className="fixed inset-0 z-50 w-full h-full bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
      onClick={() => setIsOpenForm(false)}
    >
      <div
        className="relative w-full max-w-lg bg-[#1e1f24] text-white rounded-2xl p-5 shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#ccff00] text-black flex items-center justify-center font-bold text-sm">
              +
            </div>
            <h3 className="text-[#ccff00] font-bold text-base uppercase tracking-wider">
              Thêm khoản giao dịch mới
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpenForm(false)}
            className="text-gray-400 hover:text-red-500 text-xl font-bold p-1 transition-colors leading-none"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Tên giao dịch */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Tên khoản giao dịch
            </label>
            <Input
              type="text"
              id="title"
              placeholder="VD: Mua trà sữa..."
              className="w-full bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
              {...register("title")}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Loại giao dịch */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Loại
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-[:checked]:border-[#ccff00] has-[:checked]:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  value="expense"
                  className="accent-[#ccff00] w-4 h-4"
                  {...register("type")}
                />
                <span className="text-sm font-medium text-gray-200">Chi tiêu</span>
              </label>

              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-[:checked]:border-[#ccff00] has-[:checked]:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  value="income"
                  className="accent-[#ccff00] w-4 h-4"
                  {...register("type")}
                />
                <span className="text-sm font-medium text-gray-200">Thu nhập</span>
              </label>
            </div>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          {/* Ví giao dịch (Dùng Controller để binding với MyCombobox) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Loại Ví
            </label>
            <Controller
              name="walletType"
              control={control}
              render={({ field }) => (
                <MyCombobox
                  value={field.value}
                  onChange={field.onChange}
                  data={options}
                />
              )}
            />
            {errors.walletType && <p className="text-red-500 text-xs mt-1">{errors.walletType.message}</p>}
          </div>

          {/* Số tiền */}
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Số tiền (VND)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="VD: 50000"
              className="w-full bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
              {...register("amount")}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Tags
            </label>
            <div className="grid grid-cols-3 gap-2">
              {visibleTags.map((tagItem) => (
                <label
                  key={tagItem.value}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-[:checked]:border-[#ccff00] has-[:checked]:bg-[#ccff00]/10 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    value={tagItem.value}
                    className="accent-[#ccff00] w-4 h-4"
                    {...register("tag")}
                  />
                  <span className="text-xs font-medium text-gray-200">{tagItem.label}</span>
                </label>
              ))}
            </div>
            {errors.tag && <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>}
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Mô tả
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Chi tiết nếu có..."
              className="w-full bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors resize-none placeholder-gray-500"
              {...register("description")}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#ccff00] hover:bg-[#b5f100] text-black font-bold text-sm py-3 rounded-xl transition-all shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Thêm mới"}
          </button>
        </form>
      </div>
     
    </div>
  );
};

export default TransactionForm;