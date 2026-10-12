import Transaction from "../Model/Transaction.js";
import mongoose from "mongoose";
import { getDateRange } from "../utils/DatePeriodUtils.js";
// 1. GET ALL TRANSACTIONS
export const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });
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
      return res
        .status(401)
        .json({ message: "Không tìm thấy thông tin người dùng!" });
    }

    const { title, description, amount, type, tag, walletId } = req.body;
    const errors = [];

    if (!title || title.trim() === "") errors.push("Title không được để trống");
    if (!amount) errors.push("Amount không được để trống");
    if (!type || !["income", "expense"].includes(type))
      errors.push("Type phải là 'income' hoặc 'expense'");
    if (!tag || tag.trim() === "") errors.push("Tag không được để trống");
    if (!walletId) errors.push("Wallet không được để trống");
    const numAmount =
      typeof amount === "string" ? Number(amount.trim()) : amount;
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      errors.push("Amount phải là số hợp lệ và lớn hơn 0");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    // 2. Khởi tạo và Lưu
    const transaction = new Transaction({
      userId,
      walletId: walletId,
      title: title.trim(),
      description: description || "",
      amount: numAmount,
      type: type || "expense",
      tag: tag || "",
    });

    const newTransaction = await transaction.save();
    return res.status(201).json(newTransaction);
  } catch (error) {
    // 🚨 QUAN TRỌNG: Log toàn bộ lỗi chi tiết ra Terminal Server để Debug
    console.error("🔴 LỖI CHI TIẾT KHI CREATE TRANSACTION:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi tạo giao dịch!",
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

  const { title, amount, type, tag, walletid, description } = req.body;
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
  if (tag !== undefined) allowedFields.tag = tag;
  if (walletid !== undefined) allowedFields.walletid = walletid;
  if (description !== undefined) allowedFields.description = description;

  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { $set: allowedFields },
      { new: true, runValidators: true },
    );
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy giao dịch!" });
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

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Loi khi xoa:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const getTransReport = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { offSet, selectedDateFilter } = req.query;

    const offset = parseInt(offSet, 10);
    if (isNaN(offset) || offset < 0) {
    
      return res.status(400).json({ message: "offset khong hop le" });
    }

    const range = getDateRange(selectedDateFilter, offset);
    if (!range) {
      return res.status(400).json({ message: "Bo loc ngay khong hop le" });
    }

    const [data] = await Transaction.aggregate([
      { $match: { userId, createdAt: { $gte: range.start, $lt: range.end } } },
      {
        $facet: {
          allTrans: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalIncome: {
                  $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
                },
                totalExpense: {
                  $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
                },
              },
            },
          ],
          byTag: [
            {
              $group: {
                _id: { tag: "$tag", type: "$type" },
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                tag: "$_id.tag",
                type: "$_id.type",
                total: 1,
                count: 1,
              },
            },
            { $sort: { total: -1 } },
          ],
        },
      },
    ]);

    const summaryAll = data.allTrans[0] ?? {
      count: 0,
      totalIncome: 0,
      totalExpense: 0,
    };

    const totals = {
      income: summaryAll.totalIncome,
      expense: summaryAll.totalExpense,
    };

    const byTag = data.byTag.map((item) => {
      const base = totals[item.type];
      return {
        ...item,
        percent: base > 0 ? Number(((item.total / base) * 100).toFixed(1)) : 0,
      };
    });

    return res.status(200).json({
      count: summaryAll.count,
      totalIncome: summaryAll.totalIncome,
      totalExpense: summaryAll.totalExpense,
      balance: summaryAll.totalIncome - summaryAll.totalExpense,
      byTag,
    });
  } catch (error) {
    console.error("Loi khi get trans report:", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};