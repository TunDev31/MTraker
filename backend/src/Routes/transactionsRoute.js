import express from "express";
import { createTransaction, deleteTransaction, getAllTransactions, updateTransaction } from "../Controller/transactionsController.js";
const router = express.Router();

// Define your transaction routes here
router.get("/", getAllTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);


export default router;