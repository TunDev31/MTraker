import api from "@/lib/axios";
export const getSpendings = () => api.get("/spending");
export const createSpendings = (spending) => api.post(`/spending`, spending);
export const updateSpendings = (transactionId, data) =>
  api.put(`/spending/${transactionId}`, data);
export const deleteSpendings = (transactionId) =>
  api.delete(`/spending/${transactionId}`);
