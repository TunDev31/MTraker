import api from "@/lib/axios";
export const getAllTransactionsApi = (params) => api.get("/transactions",{params});
export const getTransTrend = (params) => api.get("/transactions/trend",{params});
export const getTransAnalyzeApi = (params) =>
  api.get("/transactions/analyze", { params });
export const createTransactionApi = (data, walletId) => api.post(`/transactions`, { ...data, walletId });
export const updateTransactionApi = (transactionId, data) =>
  api.put(`/transactions/${transactionId}`, data);
export const deleteTransactionApi = (transactionId) =>
  api.delete(`/transactions/${transactionId}`);
