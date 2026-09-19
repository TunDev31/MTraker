import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
export const getSpendings = () => axios.get(`${API_URL}/api/spending`);
export const createSpendings= () => axios.post(`${API_URL}/api/spending`,);
export const deleteSpendings = (transactionId) =>
  axios.delete(`${API_URL}/api/spending/${transactionId}`);
