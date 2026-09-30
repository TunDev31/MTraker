import { CreditCard, Eye, Settings, EyeOff } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import MyCombobox from "./ui/MyCombobox";
import ExpenseAnalyze from "./ExpenseAnalyze";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionsStore } from "@/stores/useTransactionsStore";

const TotalBalance = ({
  isInsertMode,
  setIsInsertMode,
  selectedDateFilter,
  expenseStats,
}) => {
  const [isUserWalletVisible, setUserWalletVisible] = useState(true);
  // 🟢 2. Lấy state & function từ Zustand bằng hook đúng chuẩn
  const userWallet = useWalletStore((state) => state.wallets);
  const fetchWallet = useWalletStore((state) => state.fetchWallets);
  const changeWallet = useWalletStore((state) => state.changeWallet);
  const selectedWallet = useWalletStore((state) => state.selectedWallet);

  const getWalletOptions = useWalletStore((state)=>state.getWalletOptions);
  const currWalletRemain = !selectedWallet ? 0 : selectedWallet.remainAmount;
  const currWalletName = !selectedWallet ? "" : selectedWallet.walletName;
  // 🟢 3. Gọi API an toàn, có kiểm tra hàm tồn tại
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

  return (
    <div className="flex flex-col gap-3">
     
      

      <div className="bg-linear-to-br from-[#1c232b]/90 to-[#12171d]/90 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-2 py-2 gap-2">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <CreditCard className="text-(--Green-color)" />
            <h2 className="text-lg font-light text-(--Green-color)">
              QUẢN LÍ VÍ TIỀN
            </h2>
          </div>
          <div className="flex gap-2 items-center">
            <MyCombobox
              placeholder="Loại Thẻ"
              searchPlaceholder="Tìm loại thẻ"
              emptyMessage="Không tìm thấy ví"
              value={currWalletName}
              onChange={handleChange}
              data={walletOptions}
            />
            <Settings color="white" />
          </div>
        </div>

        <div className="flex items-center gap-1 justify-between">
          <div className="flex flex-col gap-1 border-b border-white/70 w-full">
            <p className="flex gap-2 text-white font-extralight">
              Số dư khả dụng:
              <span className="hover:cursor-pointer">
                {isUserWalletVisible ? (
                  <Eye onClick={() => setUserWalletVisible(false)} />
                ) : (
                  <EyeOff onClick={() => setUserWalletVisible(true)} />
                )}
              </span>
            </p>
            <p className="text-white font-bold truncate">
              {isUserWalletVisible ? currWalletRemain : "***********"} VND
            </p>
          </div>
        </div>

        <div className="flex p-2 items-center gap-1 justify-between">
          <p className="text-white">**** 89797</p>

          <p
            className="text-(--Green-color) underline hover:cursor-pointer"
            onClick={() => setIsInsertMode(true)}
          >
            Nạp/ Rút tiền
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalBalance;
