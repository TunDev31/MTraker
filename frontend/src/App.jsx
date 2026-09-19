import Header from "./components/Header";
import DateFilter from "./components/DateFilter";
import TotalBalance from "./components/TotalBalance";
import FilterBar from "./components/FilterBar";
import TransactionTable from "./components/ui/TransactionTable";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import TransactionForm from "./components/TransactionForm";
import { toast, Toaster } from "sonner";

import { INITIAL_WALLETS } from "./lib/mockData";
import { deleteSpendings, getSpendings } from "./services/SpendingServices";

import { useTransactions } from "./hooks/useTransactions";
function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState("day");
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isInsertMode, setIsInsertMode] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("cash");
  const [offset, setOffSet] = useState(0);
  const [userWallet, setUserWallet] = useState(INITIAL_WALLETS);

  useEffect(() => {
    fetchTransactions();
  }, []);
  const {  TransFilter } = useTransactions({
    selectedWallet,
    transactions,
    selectedDateFilter,
    offset,
  });

  const fetchTransactions = async () => {
    try {
      const response = await getSpendings();

      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
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
    <div className="min-h-screen flex flex-col gap-1 px-1 py-1 sm:py-3 sm:px-3 sm:gap-2 bg-(--bg-primary)">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: "#1c232b",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
      <Header />
      <main className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <DateFilter
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
        />
        <TotalBalance
          transactions={transactions}
          userWallet={userWallet}
          setUserWallet={setUserWallet}
          isInsertMode={isInsertMode}
          setIsInsertMode={setIsInsertMode}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
        />
        <FilterBar />
        <TransactionTable
          transactions={TransFilter.filteredTransByDate}
          deleteTransaction={handleDeleteTransaction}
          setOffSet={setOffSet}
          offSet={offset}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
        />
        {/* <TablePagination /> */}
        <NavBar setIsOpenForm={setIsOpenForm} />
        {isOpenForm && (
          <TransactionForm
            setTransactions={setTransactions}
            setIsOpenForm={setIsOpenForm}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
