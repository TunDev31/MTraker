import api from "@/lib/axios";
export const getAllTransactions = () => api.get("/transactions");
export const getTransAnalyze = (params) =>
  api.get("/transactions/analyze", { params });
export const createTransaction = (transaction, walletId) => api.post(`/transactions`, { ...transaction, walletId });
export const updateTransaction = (transactionId, data) =>
  api.put(`/transactions/${transactionId}`, data);
export const deleteTransaction = (transactionId) =>
  api.delete(`/transactions/${transactionId}`);
