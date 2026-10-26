import {
  createTransactionApi,
  deleteTransactionApi,
  getAllTransactionsApi,
  getTransAnalyzeApi,
  getTransTrend,
  updateTransactionApi,
} from "@/components/api/transactionsApi";


export const transactionsService = {
  getAllTransactions: async (params) => getAllTransactionsApi(params),
  createTransaction: async (data, walletId) => 
    createTransactionApi(data, walletId),
getTransTrend : async (params) => getTransTrend(params),
  getTransAnalyze:async (params)=> getTransAnalyzeApi(params) ,
  updateTransaction: async (transactionId, data) =>
    updateTransactionApi(transactionId, data),
  deleteTransaction: async (transactionId) =>
    deleteTransactionApi(transactionId),
};
