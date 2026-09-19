import axios from "axios";
import api from "@/lib/axios";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
export const getSpendings = () => api.get("/spending");
export const createSpendings = (spending) => api.post(`/spending`, spending);
export const deleteSpendings = (transactionId) =>
  api.delete(`/spending/${transactionId}`);
