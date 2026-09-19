import { CreditCard, Eye, Settings, EyeOff } from "lucide-react";
import React, { useState } from "react";
import MyCombobox from "./ui/MyCombobox";
import { cn } from "@/lib/utils";
import { getDateFilter } from "@/utils/DateUtils/DateFilterUtils";

import { useWalletTransactions } from "@/hooks/useWalletTransaction";

import { useTransactions } from "@/hooks/useTransactions";

const TotalBalance = ({
  setUserWallet,
  userWallet,
  isInsertMode,
  setIsInsertMode,
  selectedWallet,
  setSelectedWallet,
  transactions,
  selectedDateFilter,
  expenseStats
}) => {
  const [selectedValue, setSelectedValue] = React.useState("cash");

  const [isUserWalletVisible, setUserWalletVisible] = useState(true);

  
  const {
    currUserWallet,
    setUserChoice,
    setUserAmount,
    handleInsertTransaction,
  } = useWalletTransactions(
    userWallet,
    setUserWallet,
    selectedWallet,
    expenseStats.totalExpenseAllTime,
    expenseStats.totalIncomeAllTime
  );

  const handleChange = (value) => {
    setSelectedValue(value);
    setSelectedWallet(value);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col px-2 py-3 gap-1.5 bg-white rounded-xl  shadow-md">
          <div className="flex justify-between items-center gap-1">
            <h2 className="text-xs font-light">
              TỔNG CHI {getDateFilter(selectedDateFilter).toUpperCase()}{" "}
            </h2>
          </div>
          <div className="flex gap-1">
            <p className="text-lg font-bold">
              {expenseStats.currentExpenseValueByDate.toLocaleString("vi-VN")}{" "}
              <span>VND</span>{" "}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <div
              className={cn(
                "rounded-2xl",
                expenseStats.expensePercentage < 0
                  ? "bg-green-100"
                  : "bg-red-100",
              )}
            >
              <p
                className={cn(
                  "mx-5",
                  expenseStats.expensePercentage < 0
                    ? "text-green-900"
                    : "text-red-900",
                )}
              >
                {expenseStats.expensePercentage !== 0
                  ? `${expenseStats.isIncrease ? "+" : ""}${expenseStats.expensePercentage.toFixed(1)}%`
                  : `Chưa có dữ liệu`}
              </p>
            </div>
            <p className="flex justify-center items-center gap-2 text-xs text-black">
              {expenseStats.expensePercentage !== 0
                ? `${getDateFilter(selectedDateFilter)} trước`
                : ``}
            </p>
          </div>
        </div>

        <div className="flex flex-col p-2 gap-2 bg-white rounded-xl  shadow-md">
          <div className="flex items-center justify-center gap-1">
            <h2 className="items-center justify-center text-xs font-light">
              DANH MỤC CHI NHIỀU
            </h2>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <expenseStats.IconTypeComponent className="border border-black rounded-full p-1" />
            <p className="text-lg font-bold text-(--Green-color)">
              {expenseStats.mostExpensiveType}
            </p>
          </div>
          <div>
            <p className="text-sm flex gap-2">
              <span className="text-(--Green-color) justify-center items-center ">
                {expenseStats.mostExpensePerDay.toFixed(0)} %
              </span>{" "}
              <span>
                /Tổng chi tiêu {getDateFilter(selectedDateFilter).toLowerCase()}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-[#1c232b]/90 to-[#12171d]/90 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-2 py-2 gap-2">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <CreditCard className="text-(--Green-color)" />
            <h2 className="text-lg font-light text-(--Green-color)">
              QUẢN LÍ VÍ TIỀN
            </h2>
            <button className="flex text-white"></button>
          </div>
          <div className="flex gap-2 items-center">
            <MyCombobox
            
              placeholder="Loại Thẻ"
              searchPlaceholder="Tìm loại thẻ"
              emptyMessage="Loại Thẻ"
              value={selectedValue}
              onChange={handleChange}
              data={[
                { value: "momo", label: "MoMo" },
                { value: "sacombank", label: "Sacombank" },
                { value: "cash", label: "Cash" },
                { value: "bidv", label: "BIDV" },
              ]}
            />
            <Settings color="white" />
          </div>
        </div>
        <div className="flex items-center gap-1 justify-between">
          {!isInsertMode && (
            <div className="flex flex-col gap-1 border-b border-white/70 w-full">
              <p className="flex gap-2 text-white font-extralight">
                Số dư khả dụng:
                <span className="hover:cursor-pointer">
                  {isUserWalletVisible && (
                    <Eye onClick={() => setUserWalletVisible(false)} />
                  )}
                  {!isUserWalletVisible && (
                    <EyeOff onClick={() => setUserWalletVisible(true)} />
                  )}
                </span>{" "}
              </p>
              <p className="text-white font-bold truncate">
                {" "}
                {isUserWalletVisible
                  ? currUserWallet.currValue.toLocaleString("vi-VN")
                  : "***********"}{" "}
                VND{" "}
              </p>
            </div>
          )}

          {isInsertMode && (
            <div className="flex flex-col gap-1 border-b border-white/70 w-full my-2">
              <div className="flex gap-2 items-center">
                <div className="flex gap-1 items-center">
                  <label
                    htmlFor="exNin"
                    className="text-xs font-semibold text-gray-400 "
                  >
                    Nap tiền
                  </label>
                  <input
                    type="radio"
                    id="exNin"
                    name="exNin"
                    value="insert"
                    onChange={(e) => setUserChoice(e.target.value)}
                    defaultChecked
                    className=" bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-1 items-center">
                  <label
                    htmlFor="exNout"
                    className="flex text-xs font-semibold text-gray-400 "
                  >
                    Rút tiền
                  </label>
                  <input
                    type="radio"
                    id="exNout"
                    name="exNin"
                    onChange={(e) => setUserChoice(e.target.value)}
                    value="expense"
                    className=" bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    id="expenseAmount"
                    name="expenseAmount"
                    placeholder="Nhập số tiền cần Rút/Nạp"
                    onChange={(e) => setUserAmount(Number(e.target.value))}
                    className="w-full bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex p-2 items-center gap-1 justify-between">
          <p className="text-white">**** 89797</p>
          {!isInsertMode && (
            <p
              className="text-(--Green-color) underline hover:cursor-pointer"
              onClick={() => setIsInsertMode(!isInsertMode)}
            >
              Nạp/Rút tiền
            </p>
          )}
          {isInsertMode && (
            <div className="flex gap-4">
              <p
                className="text-(--Green-color) underline hover:cursor-pointer"
                onClick={() => {
                  setIsInsertMode(!isInsertMode);
                }}
              >
                Huỷ
              </p>
              <p
                className="text-(--Green-color) underline hover:cursor-pointer"
                onClick={() => {
                  setIsInsertMode(!isInsertMode);
                  handleInsertTransaction();
                }}
              >
                Xác nhận
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalBalance;
