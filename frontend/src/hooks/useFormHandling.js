import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { createSpendings } from "@/services/SpendingServices";
export const useFormHandling = (setTransactions, setIsOpenForm) => {
  const [selectedType, setSelectedType] = useState("expense");
  const [selectedCashType, setSelectedCashType] = useState("cash");
  const [spendingName, setSpendingName] = useState("");
  const [spendingAmount, setSpendingAmount] = useState(0);
  const [spendingDesc, setSpendingDesc] = useState("");
  const [selectedTag, setSelectedTag] = useState([]);
  const handleTagSelect = (e) => {
    const value = e.target.value;
    setSelectedTag((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };
  const handleSubmit = async (e) => {
    // 1. Chống reload trang trên di động nếu nút nằm trong <form>
    if (e && e.preventDefault) e.preventDefault();

    const API_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

    try {
      // 2. Dùng API_URL và thêm Template String
      if (!spendingName || spendingName.trim() === "") {
        toast("Ten khong duoc de trong!");
        return;
      }
      if (selectedTag !== undefined && !Array.isArray(selectedTag)) {
        toast("Tags khong hop le!");
        return;
      }
      if (spendingAmount < 0) {
        toast("So tien khong hop le!");
        return;
      }
      const spendingData = {
        title: spendingName,
        description: spendingDesc,
        amount: spendingAmount,
        type: selectedType,
        walletType: selectedCashType,
        tag: selectedTag,
      }
      const res = await createSpendings(spendingData);

      setTransactions((prevTransactions) => [...prevTransactions, res.data]);
      setIsOpenForm(false); // Đóng modal sau khi tạo thành công
      toast.success("Luu giao dich thanh cong!");
    } catch (error) {
      console.error("Loi khi post", error);
    }
  };
  return {
    setSelectedType,
    setSelectedCashType,
    setSpendingName,
    setSpendingAmount,
    handleSubmit,
    setSpendingDesc,
    handleTagSelect,
  };
};
