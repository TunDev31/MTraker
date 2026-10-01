import Header from "../components/Header";
import DateFilter from "../components/DateFilter";

import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import TransactionForm from "../components/TransactionForm";




import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";
import MoneyManager from "@/components/MoneyManager";

import CardLayout from "@/components/CardLayout";
import TransactionTable from "@/components/TransactionTable";


function HomePage() {
  const [walletForm, setWalletForm] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("day");
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [offset, setOffSet] = useState(0);

  const fetchWallet = useWalletStore((state) => state.fetchWallets);
  const selectedWallet = useWalletStore((state) => state.selectedWallet);
 
  const fetchTransactions = useTransactionsStore((state) => state.fetchTransactions);

  useEffect(() => {
    fetchTransactions();
    fetchWallet();
  }, []);



  

  return (
    <div className="min-h-dvh flex flex-col gap-1 px-1 py-1 sm:py-3 sm:px-3 sm:gap-2 bg-(--bg-primary)">
      <Header />
      <main className="flex-1 flex flex-col gap-3 overflow-y-auto">
        <DateFilter
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
        />
        <MoneyManager setWalletForm={setWalletForm} />
      <CardLayout selectedDateFilter={selectedDateFilter} />
      
        
<TransactionTable selectedDateFilter={selectedDateFilter} setOffSet={setOffSet} offSet={offset}/>
        <NavBar setIsOpenForm={setIsOpenForm} setWalletForm={setWalletForm}  />
        {isOpenForm && (
          <TransactionForm setIsOpenForm={setIsOpenForm} />
        )}
        
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;