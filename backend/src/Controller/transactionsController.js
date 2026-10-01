import Transaction from "../Model/Transaction.js";
import mongoose from "mongoose";
// 1. GET ALL TRANSACTIONS
export const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Loi khi get:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// 2. CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Kiểm tra userId
    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy thông tin người dùng!" });
    }

    const { title, description, amount, type, tag, walletType } = req.body;
    const errors = [];

    if (!title || title.trim() === "") errors.push("Title không được để trống");
    if (!amount) errors.push("Amount không được để trống");
    if (!type || !["income", "expense"].includes(type)) errors.push("Type phải là 'income' hoặc 'expense'");
    if (!tag ||  tag.trim() === "") errors.push("Tag không được để trống");
    const numAmount = typeof amount === "string" ? Number(amount.trim()) : amount;
if (!Number.isFinite(numAmount) || numAmount <= 0) {
  errors.push("Amount phải là số hợp lệ và lớn hơn 0");
}

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    // 2. Khởi tạo và Lưu
    const transaction = new Transaction({
      userId,
      title: title.trim(),
      description: description || "",
      amount: numAmount,
      type: type || "expense",
      tag: tag || "",
      walletType: walletType || "cash",
    });

    const newTransaction = await transaction.save();
    return res.status(201).json(newTransaction);

  } catch (error) {
    // 🚨 QUAN TRỌNG: Log toàn bộ lỗi chi tiết ra Terminal Server để Debug
    console.error("🔴 LỖI CHI TIẾT KHI CREATE TRANSACTION:", error);
    
    return res.status(500).json({ 
      message: "Lỗi hệ thống khi tạo giao dịch!"
    });
  }
};

// 3. UPDATE TRANSACTION
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }

  const { title, amount, type, tag, walletType, description } = req.body;
  const errors = [];

  if (title !== undefined && (!title || title.trim() === ""))
    errors.push("Tên giao dịch không được trống!");
  if (title !== undefined && title.trim().length > 100)
    errors.push("Tên quá dài!");
  if (amount !== undefined) {
    const n = Number(amount);
    if (!isFinite(n) || isNaN(n) || n <= 0)
      errors.push("Amount phải là số dương hợp lệ");
  }
  if (type !== undefined && !["income", "expense"].includes(type))
    errors.push("Type không hợp lệ");
  if (tag !== undefined && (typeof tag !== "string" || tag.trim() === ""))
    errors.push("Tag không được để trống");

  if (errors.length > 0)
    return res.status(400).json({ message: errors.join(", ") });

  const allowedFields = {};
  if (title !== undefined) allowedFields.title = title.trim();
  if (amount !== undefined) allowedFields.amount = Number(amount);
  if (type !== undefined) allowedFields.type = type;
  if (tag !== undefined) allowedFields.tag = tag; // schema vẫn là [String]
  if (walletType !== undefined) allowedFields.walletType = walletType;
  if (description !== undefined) allowedFields.description = description;

  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { $set: allowedFields },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy giao dịch!" });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Lỗi khi update:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" }); // không lộ error.message
  }
};

// 4. DELETE TRANSACTION
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const userId = req.user._id;

    const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Loi khi xoa:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};