import { deleteSpendingLimit, getSpendingLimits, updateSpendingLimit, upsertSpendingLimit } from "../Controller/userConfig.js";
import express from 'express'

const router = express.Router();
router.get("/spending-limits", getSpendingLimits);
router.post("/spending-limits", upsertSpendingLimit);
router.put("/spending-limits/:limitId", updateSpendingLimit);
router.delete("/spending-limits/:limitId", deleteSpendingLimit);

export default router