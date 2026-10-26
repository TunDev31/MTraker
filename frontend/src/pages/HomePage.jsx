// pages/HomePage.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import MoneyManager from "@/components/MoneyManager";

import TransactionTable from "@/components/TransactionTable";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import MoneyManagerSkeleton from "@/components/MoneyManagerSkeleton";

import TransactionTableSkeleton from "@/components/TransactionTableSkeleton";

// Desktop-only components
import DesktopHeader from "@/components/DestopHeader";
import DesktopKpiCards from "@/components/DesktopKpiCards";
import DesktopKpiCardsSkeleton from "@/components/DesktopKpiCardsSkeleton";
import DesktopWalletCard from "@/components/DesktopWalletCard";
import DesktopWalletCardSkeleton from "@/components/DesktopWalletCardSkeleton";
import DesktopTransactionHistory from "@/components/DesktopTransactionHistory";
import DesktopTransactionHistorySkeleton from "@/components/DesktopTransactionHistorySkeleton";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useConfigStore } from "@/stores/useConfigStore";


function HomePage() {
  const [walletForm, setWalletForm] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("day");
  const [offSet, setOffSet] = useState(0);

  const loadingWallet = useWalletStore((s) => s.loading);
  const loadingTrans = useTransactionsStore((s) => s.loading);
  const isLoading = loadingWallet || loadingTrans;

  const fetchWallet = useWalletStore((s) => s.fetchWallets);
  const fetchTransactions = useTransactionsStore((s) => s.fetchTransactions);
  const fetchTransAnalyze = useTransactionsStore((s) => s.fetchTransAnalyze);
  const fetchReport = useWalletStore((s) => s.fetchReport);
  const fetchSpendingLimits = useConfigStore((s)=> s.fetchSpendingLimits)
  const isMobile = useIsMobile();
  useEffect(() => {
    fetchWallet();
    fetchReport();
    fetchSpendingLimits();
  }, []);

  useEffect(() => {
    fetchTransAnalyze({ offSet, selectedDateFilter });
    fetchTransactions({ offSet, selectedDateFilter });
  }, [offSet, selectedDateFilter]);
  if (!isMobile)
    return (
      <div className="flex-1 flex flex-col gap-1 px-1 py-1 h-full w-full">
        {/* ── Mobile header ── */}
     
        {/* ── Desktop header (filter bar + add button) ── */}
        <DesktopHeader
          selectedDateFilter={selectedDateFilter}
          offset={offSet}
          setSelectedDateFilter={setSelectedDateFilter}
          setOffset={setOffSet}
        />

        {/* ── Desktop: KPI cards row ── */}
        {isLoading ? (
          <DesktopKpiCardsSkeleton />
        ) : (
          <DesktopKpiCards
            selectedDateFilter={selectedDateFilter}
            offSet={offSet}
          />
        )}

        {/* ── Mobile: wallet card + category cards ── */}

        {/* ── Desktop: 2-column main area ── */}
        <div className="hidden md:grid md:grid-cols-[420px_1fr] gap-5 px-6 pb-6">
          {/* Left: Wallet card */}
          {isLoading ? <DesktopWalletCardSkeleton /> : <DesktopWalletCard />}

          {/* Right: Transaction history */}
          {isLoading ? (
            <DesktopTransactionHistorySkeleton />
          ) : (
            <DesktopTransactionHistory
              
            />
          )}
        </div>
      </div>
    );
  return (
    <div className="flex-1 flex flex-col gap-1 px-1 py-1 h-full w-full">
      <Header
        setSelectedDateFilter={setSelectedDateFilter}
        setOffset={setOffSet}
      />

      <main className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <MoneyManagerSkeleton />
        ) : (
          <MoneyManager setWalletForm={setWalletForm} />
        )}
       
        {isLoading ? (
          <TransactionTableSkeleton rows={4} />
        ) : (
          <TransactionTable
            selectedDateFilter={selectedDateFilter}
            setOffSet={setOffSet}
            offSet={offSet}
          />
        )}
      </main>
    </div>
  );
}

export default HomePage;
