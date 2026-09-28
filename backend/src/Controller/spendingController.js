import Spending from "../Model/Spending.js";

// 1. GET ALL SPENDING
export const getAllSpending = async (req, res) => {
  try {
    const userId = req.userId;
    const spendings = await Spending.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(spendings);
  } catch (error) {
    console.error("Loi khi get:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// 2. CREATE SPENDING
export const createSpending = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 1. Kiểm tra userId
    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy thông tin người dùng!" });
    }

    const { title, description, amount, type, tag, walletType } = req.body;
    const errors = [];

    if (!title || title.trim() === "") errors.push("Title không được để trống");
    
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.push("Amount phải là số hợp lệ và lớn hơn 0");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const tagsArray = Array.isArray(tag) ? tag : [];

    // 2. Khởi tạo và Lưu
    const spending = new Spending({
      userId,
      title: title.trim(),
      description: description || "",
      amount: numAmount,
      type: type || "expense",
      tag: tagsArray,
      walletType: walletType || "cash",
    });

    const newSpending = await spending.save();
    return res.status(201).json(newSpending);

  } catch (error) {
    // 🚨 QUAN TRỌNG: Log toàn bộ lỗi chi tiết ra Terminal Server để Debug
    console.error("🔴 LỖI CHI TIẾT KHI CREATE SPENDING:", error);
    
    return res.status(500).json({ 
      message: "Lỗi hệ thống khi tạo giao dịch!", 
      errorDetail: error.message 
    });
  }
};

// 3. UPDATE SPENDING
export const updateSpending = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, amount, tag } = req.body;
    const errors = [];

    if (title !== undefined && (!title || title.trim() === "")) {
      errors.push("Tên giao dịch không được trống!");
    }

    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        errors.push("Amount phải là số dương hợp lệ");
      }
    }

    if (tag !== undefined && !Array.isArray(tag)) {
      errors.push("Tag phải là mảng");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    // Đổi sang findOneAndUpdate để đúng cú pháp lọc theo _id và userId
    const updated = await Spending.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch!" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Loi khi update:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 4. DELETE SPENDING
export const deleteSpending = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const userId = req.userId;

    const deletedSpending = await Spending.findOneAndDelete({ _id: id, userId });

    if (!deletedSpending) {
      return res.status(404).json({ message: "Spending not found" });
    }

    return res.status(200).json({ message: "Spending deleted successfully" });
  } catch (error) {
    console.error("Loi khi xoa:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};