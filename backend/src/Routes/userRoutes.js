import express from 'express'
import { authme } from '../Controller/userController.js';

const router = express.Router();
router.get("/me", authme);
export default router