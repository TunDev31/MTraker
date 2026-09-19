import express from "express";
import { getAllSpending, createSpending, updateSpending, deleteSpending } from "../Controller/spendingController.js";
const router = express.Router();

// Define your spending routes here
router.get("/", getAllSpending);
router.post("/", createSpending);
router.put("/:id", updateSpending);
router.delete("/:id", deleteSpending);


export default router;