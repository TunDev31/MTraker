import {
  getAllTransactions,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
  createTransaction as createTransactionApi,
  getTransAnalyze,
} from "@/services/transactionsServices.js";
import { create } from "zustand";

export const useTransactionsStore = create((set, get) => ({
  transactions: [],
  loading: false,
  report: null,
  fetchTransAnalyze: async (params)=> {
    try {
      set({loading:true});
    
      const report = await getTransAnalyze(params);
   
      set({report :report.data});
      return true;
    } catch (error)
    {
      console.error("Loi he thong");
      return false;
    } finally {
      set({loading:false})
    }
  },
  fetchTransactions: async () => {
    try {
      set({ loading: true });
      const res = await getAllTransactions();
     
      set({ transactions: res.data });
     
    } catch (error) {
      console.error("Loi khi lay trans!", error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  createTransaction: async (data,walletId) => {
    try {
      const res = await createTransactionApi(data, walletId);
      set({ transactions: [res.data, ...get().transactions] });
      return true;
    } catch (error) {
      console.error("Loi khi tao trans!", error);
      return false;
    }
  },

  updateTransactions: async (newTransaction) => {
    try {
      set({ loading: true });
   
      await updateTransactionApi(newTransaction._id, newTransaction);
      const updated = get().transactions.map((t) =>
        t._id === newTransaction._id ? newTransaction : t,
      );
      set({ transactions: updated });
      return true;
    } catch (error) {
      console.error("Loi khi cap nhat trans!", error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Xóa giao dịch: gỡ khỏi UI ngay, nếu API lỗi thì khôi phục lại
  // Trả về true/false để component biết có đóng khung chi tiết hay không
  deleteTransaction: async (id) => {
    const prev = get().transactions;
    set({ transactions: prev.filter((t) => t._id !== id) });
    try {
      await deleteTransactionApi(id);
       
      return true;
    } catch (error) {
      console.error("Loi khi xoa trans!", error);
      set({ transactions: prev }); // rollback
      return false;
    }
  },
}));