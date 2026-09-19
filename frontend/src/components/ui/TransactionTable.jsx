import { ChevronFirst, ChevronLast } from "lucide-react";
import TransactionItem from "./TransactionItem";

function TransactionTable({
  transactions,
  deleteTransaction,
  setOffSet,
  offSet,
  selectedDateFilter,
  setSelectedDateFilter,
  
}) {
  // 1. Logic tính toán mốc thời gian dựa trên offSet
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

  return (
    // Cuộn nằm ở div bao ngoài này (max-h-125 tương đương 500px)
    <div className="w-full max-h-125 overflow-auto border border-black rounded-md bg-(--bg-primary)">
      <table className="w-full border-collapse text-left">
        {/* Header cố định trên cùng khi cuộn */}
        <thead className="sticky top-0 bg-(--bg-primary) border-b z-10">
          <tr className="text-xs font-bold text-(--credit-bg-color) uppercase">
            <th className="py-2 px-3 flex items-center justify-between">
              <span>CHI TIÊU: {getDateLabel()}</span>

              {/* Cụm nút chuyển đổi mốc thời gian */}
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

        {/* Body render danh sách Item */}
        <tbody className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map((trans) => (
              <TransactionItem
                key={trans._id}
                item={trans}
                deleteTransaction={deleteTransaction}
                
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
    </div>
  );
}

export default TransactionTable;
