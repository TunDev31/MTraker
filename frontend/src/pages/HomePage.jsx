import Header from "../components/Header";
import DateFilter from "../components/DateFilter";
import TotalBalance from "../components/TotalBalance";
import TransactionTable from "../components/TransactionTable";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import TransactionForm from "../components/TransactionForm";

import { deleteSpendings, getSpendings } from "../services/transactionsServices";
import { useTransactions } from "../hooks/useTransactions";
import { toast } from "sonner";

import WalletForm from "@/components/WalletForm";
import ExpenseAnalyze from "@/components/ExpenseAnalyze";
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useWalletStore } from "@/stores/useWalletStore";

function HomePage() {
 
  const [walletForm, setWalletForm] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("day");

  const [isOpenForm, setIsOpenForm] = useState(false);

const fetchWallet = useWalletStore((state) => state.fetchWallets);
 const selectedWallet = useWalletStore((state) => state.selectedWallet);
 const wallet = selectedWallet?.walletName;
   const fetchTransactions = useTransactionsStore((state)=> state.fetchTransactions);
  useEffect(() => {
    fetchTransactions();
     fetchWallet();
  }, []);


 
  const handleUpdateTransaction = (updatedData) => {
   
  };
  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await deleteSpendings(transactionId);
      if (response.status === 200) {
        // Xóa thành công, cập nhật danh sách transactions
        setTransactions((prevTransactions) =>
          prevTransactions.filter(
            (transaction) => transaction._id !== transactionId,
          ),
        );
        toast("Xoa thanh cong!");
      } else {
        console.error("Failed to delete transaction:", response.data);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="h-dvh overflow-hidden flex flex-col gap-1 px-1 py-1 sm:py-3 sm:px-3 sm:gap-2 bg-(--bg-primary)">
      
      <Header />
      <main className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <DateFilter
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
        />
        <ExpenseAnalyze
        selectedDateFilter={selectedDateFilter}
      />
        {/* <TotalBalance
          isInsertMode={isInsertMode}
          setIsInsertMode={setIsInsertMode}
          selectedDateFilter={selectedDateFilter}
          expenseStats={transactionCalculation}
        /> */}
        {/* <FilterBar /> */}
        {/* <TransactionTable
          handleUpdateTransaction={handleUpdateTransaction}
          transactions={TransFilter.filteredTransByDate}
          deleteTransaction={handleDeleteTransaction}
          setOffSet={setOffSet}
          offSet={offset}
          selectedDateFilter={selectedDateFilter}
        /> */}
        {/* <TablePagination /> */}
        <NavBar setIsOpenForm={setIsOpenForm}  setWalletForm={setWalletForm}/>
        {isOpenForm && (
          <TransactionForm
            
            setIsOpenForm={setIsOpenForm}
          />
        )}
        {walletForm && (
          <WalletForm setWalletForm={setWalletForm}/>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;