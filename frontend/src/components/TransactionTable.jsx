import { ChevronFirst, ChevronLast } from "lucide-react";
import TransactionItem from "./TransactionItem";
import { TablePagination } from "./TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import TransactionsDetails from "./TransactionsDetails";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { Skeleton } from "@/components/ui/skeleton"; // thêm
import TransactionRowSkeleton from "./TransactionRowSkeleton ";


const PAGE_SIZE = 4; // thêm: dùng chung cho phân trang và số dòng skeleton

function TransactionTable({ setOffSet, offSet, selectedDateFilter }) {
  const transactions = useTransactionsStore((state) => state.transactions);
  const transLoading = useTransactionsStore((state) => state.loading); // thêm
  const walletsLoading = useWalletStore((state) => state.loading); // thêm
  const isLoading = transLoading || walletsLoading; // thêm


  const [itemSelected, setSelectedItem] = useState(undefined);
  const {
    visibleTaskNums,
    pageNums,
    handlePrevPage,
    handleNextPage,
    handleChangePage,
  } = usePagination(transactions, PAGE_SIZE);

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
    <div className="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-black/60 px-4 pt-10 pb-18 backdrop-blur-xs">
      <TransactionsDetails
        item={itemSelected}
        onClose={() => setSelectedItem(undefined)}
      />
    </div>
  ) : (
    <div className="mt-3 mb-16 flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div>
        {/* Header giữ nguyên, chỉ thêm disabled khi đang tải */}
        <div className="flex items-center justify-between border-b border-black/5 bg-white px-3 py-2 text-xs font-bold text-(--credit-bg-color) uppercase">
          <span>CHI TIÊU: {getDateLabel()}</span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleOffSetChange("prev")}
              disabled={isLoading} // thêm
              className="p-1 transition-colors hover:text-green-500 disabled:opacity-30" // thêm disabled:opacity-30
              title="Lùi thời gian"
            >
              <ChevronFirst size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleOffSetChange("cont")}
              disabled={offSet === 0 || isLoading} // sửa
              className={`p-1 transition-colors ${
                offSet === 0 || isLoading
                  ? "cursor-not-allowed opacity-30"
                  : "hover:text-green-500"
              }`}
              title="Tiến thời gian"
            >
              <ChevronLast size={18} />
            </button>
          </div>
        </div>

        {/* Danh sách: loading -> skeleton, rỗng -> empty state, có dữ liệu -> item */}
        <ul className="divide-y divide-black/5" aria-busy={isLoading}>
          {isLoading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <TransactionRowSkeleton key={i} />
            ))
          ) : visibleTaskNums?.transShow?.length > 0 ? (
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

      {/* Phân trang: loading -> skeleton nhỏ */}
      {isLoading ? (
        <div className="flex justify-center p-3">
          <Skeleton className="h-6 w-24" />
        </div>
      ) : (
        <TablePagination
          pageNums={pageNums}
          handlePrevPage={handlePrevPage}
          totalPage={visibleTaskNums.totalPage}
          handleNextPage={handleNextPage}
          handleChangePage={handleChangePage}
        />
      )}
    </div>
  );
}

export default TransactionTable;