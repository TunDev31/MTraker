import { useState, useEffect } from "react";
import {
  X,
  Settings,
  ShieldAlert,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/stores/useConfigStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { formatCurrency } from "@/utils/Format/formatCurrency";
import { iconLabel } from "@/utils/Icon/iconConfig";

// ─── Constants ────────────────────────────────────────────────────────────────
const PERIODS = [
  { value: "day", label: "Theo ngày" },
  { value: "month", label: "Theo tháng" },
  { value: "year", label: "Theo năm" },
];

const QUICK_AMOUNTS = [500000, 1000000, 3000000, 5000000, 10000000];

const TAGS = [
  { value: null, label: "Tất cả danh mục" },
  ...Object.entries(iconLabel).map(([key, val]) => ({
    value: key,
    label: val.value,
  })),
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const addSchema = z.object({
  period: z.enum(["day", "month", "year"]),
  amount: z.coerce
    .number({ message: "Vui lòng nhập số hợp lệ!" })
    .positive("Giới hạn phải lớn hơn 0!"),

});

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Hiển thị 1 dòng limit với toggle + delete */
const LimitRow = ({ limit, wallets, onToggle, onDelete }) => {
  const wallet = wallets.find((w) => w._id === limit.walletId);
  const periodLabel = PERIODS.find((p) => p.value === limit.period)?.label ?? limit.period;
  const tagLabel = limit.tag ? (iconLabel[limit.tag]?.value ?? limit.tag) : "Tất cả";

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border p-3 gap-3 transition-colors",
        limit.enabled ? "bg-white border-gray-100" : "bg-gray-50 border-gray-100 opacity-60"
      )}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-800">
            {formatCurrency(limit.amount, "vi-VN")}
          </span>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
            {periodLabel}
          </span>
          {limit.tag && (
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              {tagLabel}
            </span>
          )}
          {wallet && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full truncate max-w-[100px]">
              {wallet.walletName}
            </span>
          )}
        </div>
        {!limit.enabled && (
          <p className="text-xs text-gray-400 mt-0.5">Đang tắt</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggle(limit._id, !limit.enabled)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title={limit.enabled ? "Tắt giới hạn" : "Bật giới hạn"}
        >
          {limit.enabled ? (
            <ToggleRight className="w-5 h-5 text-indigo-600" />
          ) : (
            <ToggleLeft className="w-5 h-5" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onDelete(limit._id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Xóa giới hạn"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/** Form thêm limit mới (có thể thu gọn) */
const AddLimitForm = ({ wallets, onAdd }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addSchema),
    defaultValues: { period: "month", amount: ""},
  });

  const currentAmount = watch("amount");

  const onSubmit = async (data) => {
    const ok = await onAdd({
      period: data.period,
      amount: data.amount,
      
    });
    if (ok) {
      reset();
      setOpen(false);
    }
  };

  return (
    <div className="border border-dashed border-indigo-200 rounded-xl overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Thêm giới hạn mới
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-indigo-500 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Form body */}
      {open && (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3 bg-white">
          {/* Period */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Chu kỳ
            </label>
            <select
              {...register("period")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400/30"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tag */}
          {/* <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Danh mục (tùy chọn)
            </label>
            <select
              {...register("tag")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400/30"
            >
              {TAGS.map((t) => (
                <option key={t.value ?? "__all"} value={t.value ?? ""}>
                  {t.label}
                </option>
              ))}
            </select>
          </div> */}

          {/* Wallet */}
          {/* {wallets.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Ví (tùy chọn)
              </label>
              <select
                {...register("walletId")}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="">Tất cả ví</option>
                {wallets.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.walletName}
                  </option>
                ))}
              </select>
            </div>
          )} */}

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Số tiền giới hạn (VND)
            </label>
            <input
              type="number"
              {...register("amount")}
              placeholder="Nhập số tiền..."
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400/30 transition",
                errors.amount ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              )}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>
            )}
            {/* Quick picks */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_AMOUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue("amount", n, { shouldValidate: true })}
                  className={cn(
                    "py-1 px-2 rounded-lg text-xs font-medium transition-colors border",
                    Number(currentAmount) === n
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
                  )}
                >
                  {n.toLocaleString("vi-VN")}đ
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { reset(); setOpen(false); }}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Đang lưu..." : "Thêm giới hạn"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
const UserSettingsModal = ({ onClose }) => {
  const { spendingLimits, loading, fetchSpendingLimits, saveSpendingLimit, updateSpendingLimit, deleteSpendingLimit } =
    useConfigStore();
  const wallets = useWalletStore((s) => s.wallets);

  useEffect(() => {
    fetchSpendingLimits();
  }, []);

  const handleToggle = async (limitId, enabled) => {
    await updateSpendingLimit(limitId, { enabled });
  };

  const handleDelete = async (limitId) => {
    await deleteSpendingLimit(limitId);
  };

  const handleAdd = async (payload) => {
    return await saveSpendingLimit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-violet-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Cài đặt cá nhân</h2>
              <p className="text-xs text-gray-500">Quản lý giới hạn chi tiêu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* Section: Spending Limits */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-gray-700">Giới hạn chi tiêu</h3>
              {!loading && (
                <span className="ml-auto text-xs text-gray-400">
                  {spendingLimits.length} giới hạn
                </span>
              )}
            </div>

            {/* List */}
            <div className="space-y-2 mb-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : spendingLimits.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-400">
                  Chưa có giới hạn nào. Hãy thêm giới hạn đầu tiên!
                </div>
              ) : (
                spendingLimits.map((limit) => (
                  <LimitRow
                    key={limit._id}
                    limit={limit}
                    wallets={wallets}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>

            {/* Add form */}
            <AddLimitForm wallets={wallets} onAdd={handleAdd} />
          </section>

          {/* Tip */}
          <div className="flex gap-2 rounded-xl bg-amber-50 border border-amber-100 p-3">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Bạn sẽ nhận cảnh báo khi chi tiêu vượt <strong>80%</strong> giới hạn đã đặt trong chu kỳ tương ứng.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3 border-t bg-gray-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
