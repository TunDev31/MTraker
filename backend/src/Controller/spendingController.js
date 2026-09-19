import Spending from "../Model/Spending.js";

export const getAllSpending = async (req, res) => {
  try {
    const spendings = await Spending.find();
    res.status(200).json(spendings);
  } catch (error) {
    console.error("Loi khi get", error);
    res.status(500).json({ message: "Loi he thong!" });
  }
};
export const createSpending = async (req, res) => {
  try {
    const { title, description, amount, type, tag, walletType } = req.body;
    const errors = [];
    if (!title || title.trim() === "") errors.push("Title không được để trống");
    if (typeof amount !== "number" || amount <= 0)
      errors.push("Amount phải là số dương");
    if (tag !== undefined && !Array.isArray(tag))
      errors.push("Tag phải là mảng");

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }
    
    const tagsArray = Array.isArray(tag) ? tag : [];
    const spending = new Spending({
      title,
      description,
      amount,
      type,
      tag: tagsArray,
      walletType,
    });
    const newSpending = await spending.save();
    res.status(201).json(newSpending);
  } catch (error) {
    console.error("Loi khi post", error);
    res.status(500).json({ message: "Loi he thong!" });
  }
};
export const updateSpending = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Spending.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteSpending = async (req, res) => {
  try {
    const deleteSpending = await Spending.findByIdAndDelete(req.params.id);
    if (!deleteSpending) {
      return res.status(404).json({ message: "Spending not found" });
    }
    res.status(200).json({ message: "Spending deleted successfully" });
  } catch (error) {
    console.error("Loi khi xoa", error);
    res.status(500).json({ message: "Loi he thong!" });
  }
};
