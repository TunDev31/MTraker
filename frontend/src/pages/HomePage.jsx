// pages/HomePage.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import MoneyManager from "@/components/MoneyManager";
import CardLayout from "@/components/CardLayout";
import TransactionTable from "@/components/TransactionTable";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import MoneyManagerSkeleton from "@/components/MoneyManagerSkeleton";
import CardLayoutSkeleton from "@/components/CardLayoutSkeleton";
import TransactionTableSkeleton from "@/components/TransactionTableSkeleton";

function HomePage() {
  const [walletForm, setWalletForm] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("day");
  const [offSet, setOffSet] = useState(0);

  const loadingWallet = useWalletStore((s) => s.loading);
  const loadingTrans = useTransactionsStore((s) => s.loading);
  const isLoading = loadingWallet || loadingTrans;
const fetchWallet = useWalletStore((s) => s.fetchWallets);
  const fetchTransactions = useTransactionsStore((s) => s.fetchTransactions);
  const fetchTransAnalyze = useTransactionsStore((s)=>s.fetchTransAnalyze);
  const trans = useTransactionsStore((s)=>s.transactions);
  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);
  useEffect(()=> {
    fetchTransAnalyze({offSet,selectedDateFilter});
  },[offSet,selectedDateFilter,trans]);
  return (
    <div className="flex-1 flex flex-col gap-1 px-1 py-1 sm:py-3 sm:px-3 sm:gap-2">
      <Header
        setSelectedDateFilter={setSelectedDateFilter}
        setOffset={setOffSet}
      />
      <main className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <MoneyManagerSkeleton />
        ) : (
          <MoneyManager
            setWalletForm={setWalletForm}
            selectedDateFilter={selectedDateFilter}
          />
        )}

        {isLoading ? (
          <CardLayoutSkeleton />
        ) : (
          <CardLayout  />
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
