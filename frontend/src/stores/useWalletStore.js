import { walletService } from "@/services/walletService";

import { create } from "zustand";

export const useWalletStore = create((set, get) => ({
  wallets: [],
  loading: false,
  selectedWallet: null,
  walletReport: null,
  fetchReport: async ()=> {
    try {
      set({loading:true});
     
      if (!get().wallets) return;
      const report = await walletService.fetchWalletReport();
      if (!report) {
        console.log("Loi khi tai report");
        return false;
      }

      set({walletReport: report});
        return true;
    } catch (error) {
      console.log("Loi he thong");
      return false;
    } finally {
      set({loading: false});
    }
  },
  fetchWallets: async () => {
    set({ loading: true });
    try {
      const walletData = await walletService.fetchWallet();

      const data = walletData || [];

      // 1. Lấy _id của ví đang được chọn hiện tại
      const currentSelectedId = get().selectedWallet?._id;

      // 2. Tìm lại chính ví đó trong danh sách data MỚI vừa fetch về
      const updatedSelectedWallet =
        data.find((w) => w._id === currentSelectedId) || data[0] || null;

      // 3. Cập nhật state với array mới VÀ selectedWallet mới
      set({
        wallets: [...data],
        selectedWallet: updatedSelectedWallet ? { ...updatedSelectedWallet } : null,
      });
    } catch (error) {
      console.error("Lỗi khi fetch ví:", error);
      set({ wallets: [], selectedWallet: null });
    } finally {
      set({ loading: false });
    }
  },

  updateWallet: async (walletId, amount, type) => {
    await walletService.updateWallet(walletId, amount, type);
    await get().fetchWallets(); 
  },

  changeWallet: (walletId) => {
    const walletNeedChange = get().wallets.find((w) => w._id === walletId);
    set({ selectedWallet: walletNeedChange ? { ...walletNeedChange } : null });
  },

  getBalanceById: (walletId) => {
    const wallet = get().wallets.find((w) => w._id === walletId);
    return wallet ? wallet.remainAmount : 0;
  },

  getTotalBalance: () => {
    return get().wallets.reduce((sum, w) => sum + (w.remainAmount || 0), 0);
  },

  getWalletOptions: () => {
    return get().wallets?.map((wallet) => ({
      label: wallet.walletName,
      value: wallet._id,
    }));
  },
}));