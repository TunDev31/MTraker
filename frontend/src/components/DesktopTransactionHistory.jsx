import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";

import TransRow from "./TransRow";

import { groupTransactionsByDate } from "@/utils/SpendingUtils/TransFilter";
import TransactionForm from "./TransactionForm";
import TransactionItem from "./TransactionItem";

// ── helpers ──────────────────────────────────────────────────────────────────

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

export default function DesktopTransactionHistory() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const getWalletById = useWalletStore((s) => s.getWalletById);

  const [selected, setSelected] = useState(null);

  const groups = groupTransactionsByDate(transactions);

  const newCount = useMemo(() => {
    return transactions.filter(
      (t) => new Date(t.createdAt).toDateString() === today.toDateString(),
    ).length;
  }, [transactions]);



  return (
    <div className="hidden md:flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-gray-900">Lịch Sử Giao Dịch</h2>
          {newCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              {newCount} mục mới
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
            <ArrowUpRight size={32} className="opacity-20" />
            <p className="text-sm">Không có giao dịch nào</p>
          </div>
        ) : (
          groups.map((group) => {
            return (
              <div key={group.dateKey}>
                {/* Group header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80">
                  <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                    {group.label}
                  </span>
                </div>
                {/* Items */}
                {group.items.slice(0, 5).map((item) => (
                  <TransRow
                    key={item._id}
                    item={item}
                    onSelect={setSelected}
                  />
                ))}
                {group.items.length > 5 && (
                  <p className="px-4 py-1.5 text-[11px] text-gray-400">
                    +{group.items.length - 5} giao dịch khác
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3">
        <NavLink
          to="/transactions"
          className="flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Xem toàn bộ giao dịch →
        </NavLink>
      </div>
    </div>
  );
}
