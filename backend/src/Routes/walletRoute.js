import express from 'express'
import { createNewWallet, getUserWallet } from '../Controller/walletController.js';
 const router = express.Router();
 router.get ("/", getUserWallet);
    router.post("/",createNewWallet);
 export default router