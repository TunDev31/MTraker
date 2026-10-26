import express from 'express'
import { createNewWallet, deleteWallet, getAnalyzeReport, getUserWallet, updateWallet } from '../Controller/walletController.js';
 const router = express.Router();
 router.get ("/", getUserWallet);
    router.post("/",createNewWallet);
    router.put("/:walletId", updateWallet);
    router.get("/analyze", getAnalyzeReport);
    router.delete("/:walletId",deleteWallet);
 export default router;