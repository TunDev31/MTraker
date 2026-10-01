import {
  CreditCard,
  Eye,
  EyeOff,
  Settings,
  Plus,
  ArrowLeftRight,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import MyCombobox from "./ui/MyCombobox";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import WalletTransferForm from "./WalletTransferForm";

/* ---------------------------------------------------------------
 * Ảnh thẻ của từng ví
 * Tự quét ảnh (jpg, png, webp) trong src/assets và src/asset, kể cả thư mục con.
 * Tên file khớp với tên ví (không phân biệt hoa/thường, bỏ dấu và khoảng trắng).
 * Ví dụ: ví "momo" -> momo.jpg. Ảnh dự phòng: default.jpg (tùy chọn).
 * ------------------------------------------------------------- */
const walletImageModules = import.meta.glob(
  [
    "/src/assets/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}",
    "/src/asset/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}",
  ],
  { eager: true, import: "default" },
);

const normalizeName = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const walletImageMap = Object.fromEntries(
  Object.entries(walletImageModules).map(([path, src]) => [
    normalizeName(path.split("/").pop().replace(/\.(jpe?g|png|webp)$/i, "")),
    src,
  ]),
);

const getWalletImage = (walletName) => {
  const key = normalizeName(walletName);
  if (key) {
    if (walletImageMap[key]) return walletImageMap[key];
    // Khớp gần đúng: "vimomo" ~ "momo"
    const fuzzy = Object.keys(walletImageMap).find(
      (k) => k.length > 2 && (k.includes(key) || key.includes(k)),
    );
    if (fuzzy) return walletImageMap[fuzzy];
  }
  return walletImageMap["default"] ?? null;
};

// Gỡ lỗi (bỏ comment nếu cần): xem các ảnh tìm thấy và tên ví hiện tại
// console.log("wallet images:", Object.keys(walletImageMap));

/* --------------------------------------------------------------- */

const MoneyManager = ({ selectedDateFilter, setWalletForm }) => {
  const [isUserWalletVisible, setUserWalletVisible] = useState(true);
  const [openTransferForm, setOpenTransferForm] = useState(false);

  const userWallet = useWalletStore((state) => state.wallets);
  const fetchWallet = useWalletStore((state) => state.fetchWallets);
  const changeWallet = useWalletStore((state) => state.changeWallet);
  const selectedWallet = useWalletStore((state) => state.selectedWallet);
  const getWalletOptions = useWalletStore((state) => state.getWalletOptions);
  const transactions = useTransactionsStore((state) => state.transactions);

  const walletName = selectedWallet?.walletName || "";
  const { transactionCalculation } = useTransactions({
    selectedWallet: walletName,
    transactions,
    selectedDateFilter,
    offset: 0,
  });

  const currWalletRemainOrg = !selectedWallet ? 0 : selectedWallet.remainAmount;
  const currWalletRemain =
    currWalletRemainOrg -
    transactionCalculation.totalExpenseAllTime +
    transactionCalculation.totalIncomeAllTime;
  const currWalletName = !selectedWallet ? "" : selectedWallet.walletName;

  const cardImage = getWalletImage(currWalletName);

  useEffect(() => {
    fetchWallet();
  }, []);

  const walletOptions = useMemo(() => {
    if (!Array.isArray(userWallet)) return [];
    return getWalletOptions();
  }, [userWallet]);

  const handleChange = (value) => {
    changeWallet(value);
  };

  const wallets = Array.isArray(userWallet) ? userWallet : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <div className="flex min-w-0 items-center gap-2 text-gray-600">
            <CreditCard size={18} className="shrink-0" />
            <h2 className="truncate text-sm font-medium">Quản lí ví tiền</h2>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <MyCombobox
              placeholder="Loại Thẻ"
              searchPlaceholder="Tìm loại thẻ"
              emptyMessage="Không tìm thấy ví"
              value={currWalletName}
              onChange={handleChange}
              data={walletOptions}
            />
            <button
              type="button"
              aria-label="Cài đặt ví"
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-(--Green-color)"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Thẻ: đổi theo ví đang chọn */}
        <div className="px-6 pt-3">
          <div
            key={currWalletName}
            className="animate-in fade-in zoom-in-95 duration-300"
          >
            {cardImage ? (
              <img
                src={cardImage}
                alt={`Thẻ ${currWalletName}`}
                className="aspect-[2.1/1] w-full rounded-2xl object-cover object-top shadow-lg"
              />
            ) : (
              <div className="flex aspect-[2.1/1] w-full items-start rounded-2xl bg-linear-to-br from-(--Green-color)/70 to-[#1c232b] p-4 shadow-lg">
                <span className="text-lg font-semibold text-white">
                  {currWalletName || "Chưa chọn ví"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bảng số dư đè lên phần dưới của thẻ */}
        <div className="relative -mt-9 rounded-t-3xl border-t border-black/5 bg-white px-4 pt-2 pb-4 shadow-[0_-8px_16px_rgba(0,0,0,0.12)]">
          {/* Chấm chuyển ví */}
          {wallets.length > 1 && (
            <div className="flex items-center justify-center">
              {wallets.map((w) => {
                const isActive = w.walletName === currWalletName;
                return (
                  <button
                    key={w._id ?? w.walletName}
                    type="button"
                    onClick={() => changeWallet(w.walletName)}
                    aria-label={`Chọn ví ${w.walletName}`}
                    aria-current={isActive}
                    className="p-1.5 focus-visible:outline-2 focus-visible:outline-(--Green-color)"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all ${
                        isActive
                          ? "w-5 bg-gray-900"
                          : "w-1.5 bg-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Số dư */}
          <div className="mt-1 flex flex-col items-center">

            <p className="mt-1 max-w-full truncate text-3xl font-bold tabular-nums text-gray-900">
              {isUserWalletVisible
                ? currWalletRemain.toLocaleString("vi-VN")
                : "••••••••"}
              <span className="ml-1.5 text-base font-medium text-gray-400">
                VND
              </span>
            </p>

            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              Số dư khả dụng
              <button
                type="button"
                aria-label={isUserWalletVisible ? "Ẩn số dư" : "Hiện số dư"}
                onClick={() => setUserWalletVisible((v) => !v)}
                className="rounded p-0.5 transition hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-(--Green-color)"
              >
                {isUserWalletVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </p>
          </div>

          {/* Hành động */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWalletForm(true)}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-black/10 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--Green-color)"
            >
              <Plus size={16} />
              Thêm ví mới
            </button>

            <button
              type="button"
              onClick={() => setOpenTransferForm(true)}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-(--Green-color) text-sm font-semibold text-black transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              <ArrowLeftRight size={16} />
              Nạp / Rút tiền
            </button>
          </div>
        </div>
      </div>

      {openTransferForm && (
        <WalletTransferForm setWalletTransferForm={setOpenTransferForm} />
      )}
    </div>
  );
};

export default MoneyManager;