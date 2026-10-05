import { create } from "zustand";
import { toast } from "sonner";

import { authService } from "@/services/authServices";
import api, { setTokenGetter, setTokenSetter } from "@/lib/axios";


export const userStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: true,
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },
  initAuth: async () => {
 
  try {
    const res = await api.post("/auth/refreshtoken");
    set({ accessToken: res.data.accessToken });
    await get().fetchMe();          // lấy user, fetchMe tự tắt loading
  } catch {
    get().clearState();             // clearState tắt loading
  }
  finally {
    // Đảm bảo loading luôn được tắt dù fetchMe có throw bất ngờ
    set({ loading: false });
  }
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

// Đăng ký getter/setter để axios interceptor tự động lấy và lưu accessToken
setTokenGetter(() => userStore.getState().accessToken);
setTokenSetter((token) => userStore.setState({ accessToken: token }));


