import React, { useMemo } from "react";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactions } from "@/hooks/useTransactions";
import { getCardValue } from "@/utils/SpendingUtils/CalculateUtils" // đổi đường dẫn cho đúng file utils của bạn
import CardItem from "./CardItem";

const CardLayout = () => {


  // Hook đã lọc theo ví + kỳ (theo offset)


  // Gom nhóm theo tag: [{ tag, total, percent }, ...]

  const report = useTransactionsStore((s)=> s.report);
  // Map dữ liệu vào CardItem rồi push vào cards
  const cards = [];
  report?.byTag?.filter((item) => item.type ==="expense" ).map((item)=> {
    cards.push(
      <CardItem
        key={item.tag}
        tag={item.tag}
        total={item.total}
        percent={item.percent}
      />,
    );
  })

  if (cards.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-gray-500">
        Chưa có khoản chi nào trong kỳ này
      </p>
    );
  }

  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between px-2">
        <h1 className="font-bold">Thống kê chi tiêu</h1>
        <button>Chi tiết</button>
      </div>
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory px-2 py-3">
        {cards.map((card, i) => (
          <div key={i} className="w-[42%] shrink-0 snap-start">
            {card}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardLayout;