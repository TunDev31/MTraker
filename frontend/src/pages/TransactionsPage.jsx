import { useEffect, useState } from "react";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import TransactionsDetails from "@/components/TransactionsDetails";

import { TablePagination } from "@/components/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronFirst,
  ChevronLast,
  Filter,
  Search,
  SlidersHorizontal,
  
  
  X,
} from "lucide-react";
import TransactionRowSkeleton from "@/components/TransactionRowSkeleton ";

import {  TAG_OPTIONS } from "@/utils/temp/tagOption";
import TransRow from "@/components/TransRow";
import { getDateFilter } from "@/utils/DateUtils/DateFilterUtils";



const PAGE_SIZE = 10;

const TYPE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "expense", label: "Chi tiêu" },
  { value: "income", label: "Thu nhập" },
];

const DATE_OPTIONS = [
  { value: "day", label: "Ngày" },
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];
// ── Main page ─────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  // ---- store ----
  const transactions = useTransactionsStore((s) => s.transactions);
  const transLoading = useTransactionsStore((s) => s.loading);
  const fetchTransactions = useTransactionsStore((s) => s.fetchTransactions);
  const walletLoading = useWalletStore((s) => s.loading);
  const fetchWallets = useWalletStore((s) => s.fetchWallets);

  const isLoading = transLoading || walletLoading;

  // ---- filters ----
  const [selectedDateFilter, setSelectedDateFilter] = useState("day");
  const [offSet, setOffSet] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all"); // all | expense | income
  const [tagFilter, setTagFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const TAG_FILTER_OPTIONS = [{ label: "Tất cả", value: "all" }, ...TAG_OPTIONS];
  // ---- detail panel ----
  const [itemSelected, setSelectedItem] = useState(undefined);

  // ---- fetch ----
  useEffect(() => {
    fetchWallets();
  }, []);

  useEffect(() => {
    fetchTransactions({ offSet, selectedDateFilter });
  }, [offSet, selectedDateFilter]);

  //filter transaction func
  const filtered = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (tagFilter !== "all" && t.tag !== tagFilter) return false;
    if (
      search.trim() &&
      !t.title?.toLowerCase().includes(search.trim().toLowerCase())
    )
      return false;
    return true;
  });

 

  const { visibleTaskNums, pageNums, handlePrevPage, handleNextPage, handleChangePage } =
    usePagination(filtered, PAGE_SIZE);

  // ---- date label ----
  const getDateLabel = () => {
    if (offSet === 0) {
      if (selectedDateFilter === "day") return "Hôm nay";
      if (selectedDateFilter === "month") return "Tháng này";
      if (selectedDateFilter === "year") return "Năm nay";
    }
    const d = new Date();
    if (selectedDateFilter === "day") {
      d.setDate(d.getDate() - offSet);
      return d.toLocaleDateString("vi-VN");
    }
    if (selectedDateFilter === "month") {
      d.setDate(1);
      d.setMonth(d.getMonth() - offSet);
      return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
    }
    if (selectedDateFilter === "year") {
      d.setFullYear(d.getFullYear() - offSet);
      return `Năm ${d.getFullYear()}`;
    }
    return "";
  };

  const hasActiveFilter =
    typeFilter !== "all" || tagFilter !== "all" || search.trim() !== "";
  const clearFilters = () => {
    setTypeFilter("all");
    setTagFilter("all");
    setSearch("");
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Detail modal */}
      {itemSelected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <TransactionsDetails
            item={itemSelected}
            onClose={() => setSelectedItem(undefined)}
          />
        </div>
      )}

      <div className="flex flex-col gap-4 px-4 py-5 md:px-8 md:py-6">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Giao dịch</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Xem & quản lý lịch sử thu chi
            </p>
          </div>

          {/* Filter toggle */}
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
              showFilters
                ? "bg-[#2563eb] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <SlidersHorizontal size={14} />
            Bộ lọc
            {hasActiveFilter && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#2563eb]">
                !
              </span>
            )}
          </button>
        </div>

        {/* ── Date navigator ── */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          {/* Period selector */}
          <div className="flex items-center gap-1 rounded-xl bg-[#E5EEFF] p-1">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSelectedDateFilter(opt.value);
                  setOffSet(0);
                }}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  selectedDateFilter === opt.value
                    ? "bg-white text-[#2563eb] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Offset arrows + label */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOffSet((o) => o + 1)}
              disabled={isLoading}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
              title="Lùi"
            >
              <ChevronFirst size={16} />
            </button>
            <span className="min-w-[72px] text-center text-xs font-semibold text-gray-700">
              {isLoading ? (
                <Skeleton className="mx-auto h-4 w-16" />
              ) : (
                getDateLabel()
              )}
            </span>
            <button
              type="button"
              onClick={() => setOffSet((o) => Math.max(0, o - 1))}
              disabled={offSet === 0 || isLoading}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
              title="Tiến"
            >
              <ChevronLast size={16} />
            </button>
          </div>
        </div>

   
      

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm tên giao dịch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Type filter */}
            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Loại
              </p>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTypeFilter(opt.value)}
                    className={cn(
                      "flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all",
                      typeFilter === opt.value
                        ? opt.value === "expense"
                          ? "bg-red-50 border-red-200 text-red-600"
                          : opt.value === "income"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : "bg-[#2563eb] border-[#2563eb] text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    {opt.value === "expense" && <ArrowDownLeft size={12} />}
                    {opt.value === "income" && <ArrowUpRight size={12} />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag filter */}
            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Danh mục
              </p>
              <div className="flex flex-wrap gap-2">
                {TAG_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTagFilter(opt.value)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all",
                      tagFilter === opt.value
                        ? "bg-[#2563eb] border-[#2563eb] text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start text-xs font-semibold text-[#2563eb] underline underline-offset-2 hover:text-blue-800"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* ── Transaction list ── */}
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          {/* List header */}
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {filtered.length} giao dịch
              {hasActiveFilter && (
                <span className="ml-1 rounded-full bg-[#2563eb]/10 px-2 py-0.5 text-[10px] font-semibold text-[#2563eb]">
                  đã lọc
                </span>
              )}
            </span>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600"
              >
                <X size={11} /> Xóa lọc
              </button>
            )}
          </div>

          {/* Rows */}
          <ul className="divide-y divide-black/5" aria-busy={isLoading}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TransactionRowSkeleton key={i} />
              ))
            ) : visibleTaskNums?.transShow?.length > 0 ? (
              visibleTaskNums.transShow.map((trans) => (
                <TransRow
                  key={trans._id}
                  item={trans}
                  onSelect={setSelectedItem}
                />
              ))
            ) : (
              <li className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
                <Filter size={32} className="opacity-30" />
                <p className="text-sm font-medium">{`Không có giao dịch nào trong ${getDateFilter(selectedDateFilter).toLowerCase()}`} </p>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-[#2563eb] underline underline-offset-2"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </li>
            )}
          </ul>

          {/* Pagination */}
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
      </div>
    </>
  );
}
