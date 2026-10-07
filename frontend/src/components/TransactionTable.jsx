import { ChevronFirst, ChevronLast } from "lucide-react";
import TransactionItem from "./TransactionItem";
import { TablePagination } from "./TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import TransactionsDetails from "./TransactionsDetails";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactions } from "@/hooks/useTransactions";

function TransactionTable({ setOffSet, offSet, selectedDateFilter }) {
  // 1. Logic tính toán mốc thời gian dựa trên offSet
  const transactions = useTransactionsStore((state) => state.transactions);
  const selectedWallet = useWalletStore((state) => state.selectedWallet);
  const walletName = selectedWallet?.walletName || "";
  // Hook lọc theo ví + kỳ; offset đổi mỗi lần bấm mũi tên
  const { TransFilter } = useTransactions({
    selectedWallet: "",
    transactions,
    selectedDateFilter,
    offset: offSet,
  });
  const [itemSelected, setSelectedItem] = useState(undefined);
  const {
    visibleTaskNums,
    pageNums,
    handlePrevPage,
    handleNextPage,
    handleChangePage,
  } = usePagination(TransFilter.filteredTransByDate, 4);

  const getDateLabel = () => {
    if (offSet === 0) {
      if (selectedDateFilter === "day") return "Hôm nay";
      if (selectedDateFilter === "month") return "Tháng này";
      if (selectedDateFilter === "year") return "Năm nay";
    }

    const dateByOffSet = new Date();

    if (selectedDateFilter === "day") {
      dateByOffSet.setDate(dateByOffSet.getDate() - offSet);
      return dateByOffSet.toLocaleDateString("vi-VN"); // dd/mm/yyyy
    }

    if (selectedDateFilter === "month") {
      dateByOffSet.setDate(1);
      dateByOffSet.setMonth(dateByOffSet.getMonth() - offSet);
      return `Tháng ${dateByOffSet.getMonth() + 1}/${dateByOffSet.getFullYear()}`;
    }

    if (selectedDateFilter === "year") {
      dateByOffSet.setFullYear(dateByOffSet.getFullYear() - offSet);
      return `Năm ${dateByOffSet.getFullYear()}`;
    }

    return "";
  };

  const handleOffSetChange = (changeOption) => {
    if (changeOption === "prev") {
      setOffSet(offSet + 1);
    } else if (changeOption === "cont" && offSet > 0) {
      setOffSet(offSet - 1);
    }
  };

  return itemSelected ? (
    /* Khung bọc khi xem Chi tiết */
    <div className="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-black/60 px-4 pt-10 pb-18 backdrop-blur-xs">
      <TransactionsDetails
        item={itemSelected}
        onClose={() => setSelectedItem(undefined)}
      />
    </div>
  ) : (
    /* Bảng danh sách khi chưa chọn item */
    <div className="mt-3 mb-16 flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div>
        {/* Header: tiêu đề + điều hướng thời gian */}
        <div className="flex items-center justify-between border-b border-black/5 bg-white px-3 py-2 text-xs font-bold text-(--credit-bg-color) uppercase">
          <span>CHI TIÊU: {getDateLabel()}</span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleOffSetChange("prev")}
              className="p-1 transition-colors hover:text-green-500"
              title="Lùi thời gian"
            >
              <ChevronFirst size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleOffSetChange("cont")}
              disabled={offSet === 0}
              className={`p-1 transition-colors ${
                offSet === 0
                  ? "cursor-not-allowed opacity-30"
                  : "hover:text-green-500"
              }`}
              title="Tiến thời gian"
            >
              <ChevronLast size={18} />
            </button>
          </div>
        </div>

        {/* Danh sách: <ul> chứa các <li> của TransactionItem */}
        <ul className="divide-y divide-black/5">
          {visibleTaskNums?.transShow?.length > 0 ? (
            visibleTaskNums.transShow.map((trans) => (
              <TransactionItem
                key={trans._id}
                item={trans}
                setSelectedItem={setSelectedItem}
              />
            ))
          ) : (
            <li className="py-4 text-center text-sm text-gray-500">
              Không có giao dịch nào
            </li>
          )}
        </ul>
      </div>

      <TablePagination
        pageNums={pageNums}
        handlePrevPage={handlePrevPage}
        totalPage={visibleTaskNums.totalPage}
        handleNextPage={handleNextPage}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default TransactionTable;