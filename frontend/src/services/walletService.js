import api from "@/lib/axios";

export const walletService = {
 
  fetchWallet: async ()=> {
    const res = await api.get("/wallet",{withCredentials:true})
    return res.data;
  }
};
