// layouts/AppLayout.jsx
import { useEffect, useState } from "react";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TransactionForm from "@/components/TransactionForm";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { Outlet } from "react-router";

export default function AppLayout() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const fetchWallet = useWalletStore((s) => s.fetchWallets);
  const fetchTransactions = useTransactionsStore((s) => s.fetchTransactions);
  
  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  return (
    // pb-20 chừa chỗ cho thanh nav cố định ở đáy
    <div className="min-h-dvh flex flex-col pb-20 bg-(--bg-primary) justify-between">
      <Outlet />
      <Footer />
      <NavBar setIsOpenForm={setIsOpenForm} />
      {isOpenForm && <TransactionForm setIsOpenForm={setIsOpenForm} />}
    </div>
  );
}