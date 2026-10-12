import { ArrowLeft, LockKeyhole, Settings } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import avatar from "../assets/avatarImg.png";
import { userStore } from "@/stores/useAuthStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import PersonalPageSkeleton from "@/components/PersonalPageSkeleton";
const PersonalPage = () => {
  const user = userStore((state) => state.user);
  const userLoading = userStore((state) => state.loading);
  const report = useWalletStore((state) => state.walletReport);
  const fetchReport = useWalletStore((state) => state.fetchReport);

  const wallet = useWalletStore((state) => state.wallets);
  const trans = useTransactionsStore((state) => state.transactions);

  const transReport = useTransactionsStore((state) => state.report);
  const reportLoading = useWalletStore((s) => s.reportLoading);
  const isLoading = userLoading || (reportLoading && !report);
  useEffect(() => {
    fetchReport();
  }, [wallet, trans]);
  const date = user?.createdAt;
  if (isLoading) return <PersonalPageSkeleton />;
  const joinDate = new Date(date);
  return (
    <div className="flex flex-col gap-3 p-4 ">
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
        <div className="grid grid-cols-3 gap-2  w-full">
          <div className="flex flex-col  justify-between items-center bg-[#E5EEFF] rounded-xl py-1 text-sm ">
            <p>Số ví</p>
            <p className="text-black font-bold text-xl">{report?.count}</p>
          </div>
          <div className="flex flex-col justify-between items-center bg-[#E5EEFF] rounded-xl py-1 text-sm px-0.5 ">
            <p>Giao dịch</p>
            <p className="text-black font-bold  text-xl">
              {transReport?.count}
            </p>
          </div>
          <div className="flex flex-col justify-between items-center bg-[#E5EEFF] rounded-xl py-1 text-sm ">
            <p>Tổng dư</p>
            <p className="text-black font-bold  text-xl">
              {report?.total.toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
