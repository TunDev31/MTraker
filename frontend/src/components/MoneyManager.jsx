import { Eye, EyeOff, Settings, Plus, ArrowLeftRight, CardSim } from "lucide-react";
import React, { useState, useMemo } from "react";
import MyCombobox from "./ui/MyCombobox";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import WalletTransferForm from "./WalletTransferForm";

// Nền thẻ: gradient xanh đậm + viền xanh mờ
const CARD_STYLE = {
  background:
    "radial-gradient(circle at 15% 10%, #143823 0%, #0a1a11 100%), linear-gradient(135deg, #0e2317 0%, #06120b 100%)",
  border: "1px solid rgba(34, 197, 94, 0.2)",
};

const MoneyManager = ({ selectedDateFilter, setWalletForm }) => {
  const [isUserWalletVisible, setUserWalletVisible] = useState(true);
  const [openTransferForm, setOpenTransferForm] = useState(false);

  const userWallet = useWalletStore((state) => state.wallets);
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

  const wallets = Array.isArray(userWallet) ? userWallet : [];

  const walletOptions = useMemo(() => {
    if (!Array.isArray(userWallet)) return [];
    return getWalletOptions();
  }, [userWallet]);

  return (
    <div className="flex flex-col gap-3">
      {/* Thẻ gradient */}
      <div
        key={currWalletName}
        style={CARD_STYLE}
        className="animate-in fade-in zoom-in-95 duration-300 overflow-hidden relative min-h-52 rounded-3xl p-5 text-white shadow-lg"
      >
        {/* Họa tiết trang trí */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-400/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-green-400/5" />

        <div className="relative">
          {/* Hàng trên: tên ví (chọn ví) + cài đặt */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <MyCombobox
              placeholder="Loại Thẻ"
              searchPlaceholder="Tìm loại thẻ"
              emptyMessage="Không tìm thấy ví"
              value={currWalletName}
              onChange={changeWallet}
              data={walletOptions}
            />
            <button
              type="button"
              aria-label="Cài đặt ví"
              className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-(--Green-color)"
            >
              <Settings size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-between py-0.5 px-2 bg-[#FDEB9A] w-fit rounded-lg">
              <CardSim  className="bg-[#FDEB9A] text-black"  />
            </div>
            <p>****** 88888</p>
          </div>
          {/* Số dư */}
          <div className="mt-5">
            <p className="flex items-center gap-2 text-sm text-white/70">
              Số dư khả dụng
              <button
                type="button"
                aria-label={isUserWalletVisible ? "Ẩn số dư" : "Hiện số dư"}
                onClick={() => setUserWalletVisible((v) => !v)}
                className="rounded p-0.5 transition hover:text-white focus-visible:outline-2 focus-visible:outline-(--Green-color)"
              >
                {isUserWalletVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </p>

            <p className="mt-1 max-w-full truncate text-3xl font-bold tabular-nums">
              {isUserWalletVisible
                ? currWalletRemain.toLocaleString("vi-VN")
                : "••••••••"}
              <span className="ml-2 text-xl font-semibold text-(--Green-color)">
                VND
              </span>
            </p>
          </div>

         
        </div>
      </div>

      {/* Hành động */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setWalletForm(true)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 text-sm font-semibold text-gray-900 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
        >
          <Plus size={16} />
          Thêm ví mới
        </button>

        <button
          type="button"
          onClick={() => setOpenTransferForm(true)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-800 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          <ArrowLeftRight size={16} />
          Nạp / Rút tiền
        </button>
      </div>

      {openTransferForm && (
        <WalletTransferForm setWalletTransferForm={setOpenTransferForm} />
      )}
    </div>
  );
};

export default MoneyManager;