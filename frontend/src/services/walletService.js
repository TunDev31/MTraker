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

  updateWallet: async (walletId, amount, type) => {
    const amountType = type === "expense" ? -amount : amount;
    const res = await api.put(`/wallets/${walletId}`, { amount: amountType }, { withCredentials: true });
    return res.data;
  },

  // Cập nhật hạn mức (số dư tối đa)
  updateWalletLimit: async (walletId, limit) => {
    const res = await api.patch(`/wallets/${walletId}/limit`, { limit }, { withCredentials: true });
    return res.data;
  },

  // Cập nhật giới hạn chi tiêu
  updateSpendingLimit: async (walletId, spendingLimit) => {
    const res = await api.patch(`/wallets/${walletId}/spending-limit`, { spendingLimit }, { withCredentials: true });
    return res.data;
  },

  // Xóa ví
  deleteWallet: async (walletId) => {
    const res = await api.delete(`/wallets/${walletId}`, { withCredentials: true });
    return res.data;
  },

  fetchWalletReport: async () => {
    const res = await api.get("/wallets/analyze", { withCredentials: true });
    return res.data;
  },
};
