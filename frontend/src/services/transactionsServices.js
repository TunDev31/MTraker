import api from "@/lib/axios";
export const getAllTransactions = () => api.get("/transactions");
export const createTransaction = (transaction) => api.post(`/transactions`, transaction);
export const updateTransaction = (transactionId, data) =>
  api.put(`/transactions/${transactionId}`, data);
export const deleteTransaction = (transactionId) =>
  api.delete(`/transactions/${transactionId}`);
