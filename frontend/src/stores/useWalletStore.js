import { walletService } from "@/services/walletService";
import { create } from "zustand";

export const useWalletStore = create((set, get) => ({
  wallets: [],
  loading: false,
  selectedWallet: null,

  fetchWallets: async () => {
    set({ loading: true });
    try {
      const walletData = await walletService.fetchWallet();
      const data = walletData || [];

      // 1. Lấy tên ví đang được chọn hiện tại
      const currentSelectedName = get().selectedWallet?.walletName;

      // 2. Tìm lại chính ví đó trong danh sách data MỚI vừa fetch về
      const updatedSelectedWallet =
        data.find((w) => w.walletName === currentSelectedName) || data[0] || null;

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

  updateWallet: async (walletName, amount, type) => {
    await walletService.updateWallet(walletName, amount, type);
    await get().fetchWallets(); 
  },

  changeWallet: (walletName) => {
    const walletNeedChange = get().wallets.find((w) => w.walletName === walletName);
    set({ selectedWallet: walletNeedChange ? { ...walletNeedChange } : null });
  },

  getBalanceById: (walletName) => {
    const wallet = get().wallets.find((w) => w.walletName === walletName);
    return wallet ? wallet.remainAmount : 0;
  },

  getTotalBalance: () => {
    return get().wallets.reduce((sum, w) => sum + (w.remainAmount || 0), 0);
  },

  getWalletOptions: () => {
    return get().wallets?.map((wallet) => ({
      label: wallet.walletName,
      value: wallet.walletName,
    }));
  },
}));