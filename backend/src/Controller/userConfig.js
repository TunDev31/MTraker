import mongoose from "mongoose";
import UserConfig from "../Model/UserConfig.js";

const VALID_PERIODS = ["day", "month", "year"];

const getConfig = (userId) =>
  UserConfig.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { upsert: true, new: true },
  );

// GET /config/spending-limits
export const getSpendingLimits = async (req, res) => {
  try {
    const config = await getConfig(req.user._id);
    
    return res.status(200).json(config.spendingLimits);
  } catch (error) {
    console.error("Loi khi get limits:", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

// POST /config/spending-limits  → tạo mới, nếu trùng (period+tag+walletId) thì cập nhật
export const upsertSpendingLimit = async (req, res) => {
  try {
    const { period, amount } = req.body;
    const n = Number(amount);

    if (!VALID_PERIODS.includes(period))
      return res.status(400).json({ message: "period khong hop le" });
    if (!Number.isFinite(n) || n <= 0)
      return res.status(400).json({ message: "amount phai la so duong" });
   
    const config = await getConfig(req.user._id);

    const existing = config.spendingLimits.find(
      (l) =>
        l.period === period 
       
    );

    if (existing) existing.amount = n;
    else config.spendingLimits.push({ period, amount: n });

    await config.save();
    return res.status(200).json(config.spendingLimits);
  } catch (error) {
    console.error("Loi khi upsert limit:", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

// PATCH /config/spending-limits/:limitId  → sửa amount / bật tắt
export const updateSpendingLimit = async (req, res) => {
  try {
    const { limitId } = req.params;
    const { amount, enabled } = req.body;

    if (!mongoose.isValidObjectId(limitId))
      return res.status(400).json({ message: "ID khong hop le" });

    const config = await getConfig(req.user._id);
    const limit = config.spendingLimits.id(limitId);
    if (!limit) return res.status(404).json({ message: "Khong tim thay gioi han" });

    if (amount !== undefined) {
      const n = Number(amount);
      if (!Number.isFinite(n) || n <= 0)
        return res.status(400).json({ message: "amount phai la so duong" });
      limit.amount = n;
    }
    if (enabled !== undefined) limit.enabled = Boolean(enabled);

    await config.save();
    return res.status(200).json(config.spendingLimits);
  } catch (error) {
    console.error("Loi khi update limit:", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

// DELETE /config/spending-limits/:limitId
export const deleteSpendingLimit = async (req, res) => {
  try {
    const { limitId } = req.params;
    if (!mongoose.isValidObjectId(limitId))
      return res.status(400).json({ message: "ID khong hop le" });

    const config = await getConfig(req.user._id);
    config.spendingLimits.pull({ _id: limitId });
    await config.save();
    return res.status(200).json(config.spendingLimits);
  } catch (error) {
    console.error("Loi khi xoa limit:", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};