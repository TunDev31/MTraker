import { ChevronFirst, ChevronLast } from "lucide-react";
import TransactionItem from "./TransactionItem";
import { TablePagination } from "./TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import TransactionsDetails from "./TransactionsDetails";
import { cn } from "@/lib/utils";

function TransactionTable({
  transactions,
  deleteTransaction,
  setOffSet,
  offSet,
  selectedDateFilter,
  setSelectedDateFilter,
  handleUpdateTransaction
  
}) {
  // 1. Logic tính toán mốc thời gian dựa trên offSet

  const [itemSelected, setSelectedItem] = useState(undefined);
  const {   visibleTaskNums, pageNums ,handlePrevPage,handleNextPage,handleChangePage} = usePagination(transactions,4 );
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
    /* Khung bọc khi xem Chi tiết - giữ nguyên style giống với Bảng */
    <div className=" fixed inset-0 z-10 w-full h-full bg-black/60 backdrop-blur-xs px-4 pt-10 pb-18 flex items-center justify-center">
      <TransactionsDetails 
      handleUpdateTransaction={handleUpdateTransaction}
        item={itemSelected} 
        onClose={() => setSelectedItem(undefined)} 
        deleteTransaction={deleteTransaction}
      />
    </div>
  ) : (
    /* Bảng danh sách khi chưa chọn item */
    <div className="w-full flex flex-col flex-1 h-full mt-3 mb-18 overflow-auto border border-black rounded-md bg-(--bg-primary) justify-between">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 bg-(--bg-primary) border-b z-10">
          <tr className="text-xs font-bold text-(--credit-bg-color) uppercase">
            <th className="py-2 px-3 flex items-center justify-between">
              <span>CHI TIÊU: {getDateLabel()}</span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOffSetChange("prev")}
                  className="p-1 hover:text-green-500 transition-colors"
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
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:text-green-500"
                  }`}
                  title="Tiến thời gian"
                >
                  <ChevronLast size={18} />
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {visibleTaskNums?.transShow?.length > 0 ? (
            visibleTaskNums?.transShow?.map((trans) => (
              <TransactionItem
                key={trans._id}
                item={trans}
                setSelectedItem={setSelectedItem}
              />
            ))
          ) : (
            <tr>
              <td className="py-4 text-center text-sm text-gray-500">
                Không có giao dịch nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
