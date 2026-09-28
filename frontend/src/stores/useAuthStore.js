import { create } from "zustand";
import { toast } from "sonner";

import { authService } from "@/services/authServices";
export const userStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  signUp: async (userName, password, email, firstName, lastName) => {
    try {
      set({ loading: true });

      await authService.signUp(userName, password, email, firstName, lastName);

      toast("Đăng ký thành công .Vui lòng đợi giây lát!");
    } catch (error) {
      console.error("Loi he thong!");
      toast("Đăng ký không thàng công!");
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (userName, password) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(userName, password);
      set({ accessToken: accessToken });
      toast("Chào mừng bạn quay trở lại!");
    } catch (error) {
      console.error("Loi he thong!");
      toast("Đăng nhập không thàng công!");
    } finally {
      set({ loading: false });
    }
  },
}));
