import express from 'express'
import { createNewWallet, getUserWallet, updateWallet } from '../Controller/walletController.js';
 const router = express.Router();
 router.get ("/", getUserWallet);
    router.post("/",createNewWallet);
    router.put("/:walletName", updateWallet);
 export default router