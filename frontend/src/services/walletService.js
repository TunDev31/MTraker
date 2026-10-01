import api from "@/lib/axios";

export const walletService = {
 
  fetchWallet: async () => {
    const res = await api.get("/wallets", { withCredentials: true });
    return res.data;
  },
  createWallet: async (walletName, remainAmount) => {
    const res = await api.post(
      "/wallets",
      { walletName, remainAmount },
      { withCredentials: true },
    );
    return res.data;
  },
  updateWallet: async (walletName, amount, type) => {
    const amountType = type === "deposit" ? amount : -amount; // Adjust amount based on transaction type
    const res = await api.put(`/wallets/${walletName}`, { amount: amountType }, { withCredentials: true });
    return res.data;
  },
};
