import { getSpendings } from "@/services/transactionsServices";
import { create } from "zustand";
export const useTransactionsStore = create((set,get)=> ({
    transactions: [],
    loading:false,
    fetchTransactions: async()=> {
        try {
            set({loading:true});
            const res = await getSpendings();
            set({transactions: res.data});
        } catch (error) {
            console.error("Loi khi luu trans!");
            
        } finally{
            set({loading:false});
        }
    }
}))