import axios from "axios";
import api from "@/lib/axios";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
export const getSpendings = () => api.get("/spending");
// export const createSpendings= () => api.post(`${API_URL}/api/spending`,);
export const deleteSpendings = (transactionId) =>
  axios.delete(`/spending/${transactionId}`);
