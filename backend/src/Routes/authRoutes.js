import express from "express";
import { signIn, signUp, signOut, refreshToken } from "../Controller/authController.js";

const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refreshtoken", refreshToken);
export default router;
