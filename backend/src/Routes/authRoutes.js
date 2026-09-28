import express from "express";
import { signIn, signUp,signOut } from "../Controller/authController.js";
import User from "../Model/Users.js";

const router = express.Router();
router.post("/signup", signUp);
router.post("/signin",signIn);
router.post("/signout",signOut);
export default router;