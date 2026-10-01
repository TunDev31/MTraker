import { create } from "zustand";
import { toast } from "sonner";

import { authService } from "@/services/authServices";
import { setTokenGetter } from "@/lib/axios";


export const userStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },
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
      await get().fetchMe();
      toast("Chào mừng bạn quay trở lại!");
      return true; // ✅ báo thành công
    } catch (error) {
      console.error("Loi he thong!");
      toast("Đăng nhập không thàng công!");
      return false; // ✅ báo thất bại
    } finally {
      set({ loading: false });
    }
  },
  signOut: async ()=> {
    try {
        
        await authService.signOut();
        get().clearState();
        toast("Logout thành công!");
    } catch (error) {
        console.error("Loi he thong!");
      toast("Đăng xuất không thàng công!");
    }
  },
  fetchMe: async ()=> {
    try {
        set({loading: true});

        const user = await authService.fetchMe();
        set({user}) 
    } catch (error) {
        console.error("Loi khi fetch user!");
        set({user: null, accessToken: null});
        toast("Loi he thong!")
    } finally {
        set({loading: false})
    }
  }
}));

// Đăng ký getter để axios interceptor tự động lấy accessToken
setTokenGetter(() => userStore.getState().accessToken);
