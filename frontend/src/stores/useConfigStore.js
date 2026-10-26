// stores/useConfigStore.js
import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export const useConfigStore = create((set) => ({
  spendingLimits: [],
  loading: false,

  fetchSpendingLimits: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/config/spending-limits");
     
      const data = res.data ?? res;
     
      set({ spendingLimits: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("Lỗi khi tải spending limits:", error);
    } finally {
      set({ loading: false });
    }
  },

  // tạo mới hoặc ghi đè nếu trùng period/tag/wallet
  saveSpendingLimit: async (payload) => {
    try {
      const res = await api.post("/config/spending-limits", payload);
      set({ spendingLimits: res.data ?? res });
      toast.success("Đã thêm giới hạn chi tiêu!");
      return true;
    } catch (error) {
      console.error("Lỗi khi lưu spending limit:", error);
      toast.error("Lỗi khi lưu giới hạn chi tiêu!");
      return false;
    }
  },

  updateSpendingLimit: async (limitId, patch) => {
    try {
      const res = await api.put(`/config/spending-limits/${limitId}`, patch);
      set({ spendingLimits: res.data ?? res });
      toast.success("Đã cập nhật giới hạn chi tiêu!");
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật spending limit:", error);
      toast.error("Lỗi khi cập nhật giới hạn chi tiêu!");
      return false;
    }
  },

  deleteSpendingLimit: async (limitId) => {
    try {
      const res = await api.delete(`/config/spending-limits/${limitId}`);
      set({ spendingLimits: res.data ?? res });
      toast.success("Đã xóa giới hạn chi tiêu!");
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa spending limit:", error);
      toast.error("Lỗi khi xóa giới hạn chi tiêu!");
      return false;
    }
  },
}));
