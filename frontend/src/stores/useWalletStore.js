import { walletService } from "@/services/walletService";
import { create } from "zustand";

export const useWalletStore = create((set, get) => ({
  wallets: [],
  loading: false,
  selectedWallet: undefined, // Khởi tạo ban đầu là null

  // Fetch danh sách ví từ API
  fetchWallets: async () => {
    set({ loading: true });
    try {
      const walletData = await walletService.fetchWallet();
      

      const list = walletData || [];
      
      set({ 
        wallets: list,
        // Tự động gán ví đầu tiên làm selectedWallet nếu chưa có ví nào được chọn
        selectedWallet: get().selectedWallet || list[0] || null 
      });
    } catch (error) {
      console.error("Lỗi khi fetch ví:", error);
      set({ wallets: [], selectedWallet: null });
    } finally {
      set({ loading: false });
    }
  },

  // Chọn ví hiện tại
  changeWallet: (walletName) => {
    const walletNeedChange = get().wallets.find((w) => w.walletName === walletName);
    set({ selectedWallet: walletNeedChange || null });
  },

  // Lấy nhanh số dư của 1 ví theo tên
  getBalanceById: (walletName) => {
    const wallet = get().wallets.find((w) => w.walletName === walletName);
    return wallet ? wallet.remainAmount : 0;
  },

  // Tính tổng số dư tất cả các ví
  getTotalBalance: () => {
    return get().wallets.reduce((sum, w) => sum + (w.remainAmount || 0), 0);
  },

  // Chuyển đổi danh sách ví thành dạng option cho Combobox / Select
  getWalletOptions: () => {
    return get().wallets.map((wallet) => ({
      label: wallet.walletName,
      value: wallet.walletName,
    }));
  },
}));