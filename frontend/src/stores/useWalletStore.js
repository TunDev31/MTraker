import { walletService } from "@/services/walletService";
import { create } from "zustand";
import { toast } from "sonner";

export const useWalletStore = create((set, get) => ({
  wallets: [],
  loading: false,
  selectedWallet: null,
  walletReport: null,
  reportLoading: false,

  fetchReport: async () => {
    set({ reportLoading: true });
    try {
      const report = await walletService.fetchWalletReport();
      if (!report) {
        console.log("Loi khi tai report");
        return false;
      }
      set({ walletReport: report });
      return true;
    } catch (error) {
      console.log("Loi he thong", error);
      return false;
    } finally {
      set({ reportLoading: false });
    }
  },

  fetchWallets: async () => {
    set({ loading: true });
    try {
      const walletData = await walletService.fetchWallet();
      const walletReportData = await walletService.fetchWalletReport();
      const data = walletData || [];

      const currentSelectedId = get().selectedWallet?._id;
      const updatedSelectedWallet =
        data.find((w) => w._id === currentSelectedId) || data[0] || null;

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

  // Tạo ví mới
  createWallet: async (walletName, remainAmount) => {
    try {
      await walletService.createWallet(walletName, remainAmount);
      await get().fetchWallets();
      toast.success("Tạo ví thành công!");
      return true;
    } catch (error) {
      console.error("Lỗi khi tạo ví:", error);
      toast.error("Tạo ví thất bại!");
      return false;
    }
  },

  // Cập nhật hạn mức ví
  updateWalletLimit: async (walletId, limit) => {
    try {
      await walletService.updateWalletLimit(walletId, limit);
      await get().fetchWallets();
      toast.success("Cập nhật hạn mức thành công!");
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật hạn mức:", error);
      toast.error("Cập nhật hạn mức thất bại!");
      return false;
    }
  },

  // Cập nhật giới hạn chi tiêu
  updateSpendingLimit: async (walletId, spendingLimit) => {
    try {
      await walletService.updateSpendingLimit(walletId, spendingLimit);
      await get().fetchWallets();
      toast.success("Cập nhật giới hạn chi tiêu thành công!");
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật giới hạn chi tiêu:", error);
      toast.error("Cập nhật giới hạn chi tiêu thất bại!");
      return false;
    }
  },

  // Xóa ví
  deleteWallet: async (walletId) => {
    try {
      await walletService.deleteWallet(walletId);
      await get().fetchWallets();
      toast.success("Xóa ví thành công!");
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa ví:", error);
      toast.error("Xóa ví thất bại!");
      return false;
    }
  },

  changeWallet: (walletId) => {
    const walletNeedChange = get().wallets.find((w) => w._id === walletId);
    set({ selectedWallet: walletNeedChange ? { ...walletNeedChange } : null });
  },

  getWalletById: (walletId) => {
    const wallet = get().wallets.find((w) => w._id === walletId);
    return wallet;
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
