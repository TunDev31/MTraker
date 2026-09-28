import api from "@/lib/axios";

export const authService = {
  signUp: async (userName, password, email, firstName, lastName) => {
    const res = await api.post(
      "/auth/signup",
      { userName, password, email, firstName, lastName },
      { withCredentials: true },
    );
    return res.data;
  },
  signIn: async (userName, password) => {
    const res = await api.post(
      "/auth/signin",
      { userName, password },
      { withCredentials: true },
    );
    return res.data;
  },
};
