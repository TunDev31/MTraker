import { ArrowLeft, LockKeyhole, Settings } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import avatar from "../assets/avatarImg.png";
import { userStore } from "@/stores/useAuthStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
const PersonalPage = () => {
  const user = userStore((state) => state.user);
  const report = useWalletStore((state)=> state.walletReport);
  const fetchReport = useWalletStore((state)=> state.fetchReport);
  const wallet = useWalletStore((state)=> state.wallets);
  const fetchTransReport = useTransactionsStore((state)=> state.fetchTransAnalyze);
  const trans =  useTransactionsStore((state)=> state.transactions);
  const transReport = useTransactionsStore((state)=> state.report);
  useEffect(()=> {
    fetchReport();
    fetchTransReport();
  },[wallet,trans])
  const date = user?.createdAt;
  const joinDate = new Date(date);
  return (
    <div className="flex flex-col gap-3 p-4 bg">
      <div className="flex justify-between items-center p-1">
        <ArrowLeft size={28} className="bg-[#EFF4FF]" />
        <h1>Trang cá nhân</h1>
        <Settings size={28} className="bg-[#EFF4FF]" />
      </div>

      <div className="flex flex-col gap-1 justify-center items-center bg-white rounded-xl p-3">
        <img
          src={avatar}
          alt="AvatarImg"
          className="size-24 rounded-full object-cover"
        />
        <p className="text-2xl">{user?.displayedName}</p>
        <div className="flex gap-1 justify-center items-center">
          <p className="text-green-700 font-bold">@{user?.userName}</p>
          <LockKeyhole />
        </div>
        <p>
          Tham gia từ{" "}
          {joinDate.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
       <div className="grid grid-cols-3">
        <div>
            <p>Số ví</p>
            <p>{report?.totalWalletNums}</p>
        </div>
        <div>
            <p>Tổng giao dịch</p>
            <p>{transReport?.count}</p>
        </div>
        <div></div>

      </div>
      </div>



      
    </div>
  );
};

export default PersonalPage;
