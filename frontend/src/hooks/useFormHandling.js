import { useState } from "react";
import { toast } from "sonner";
import { createSpendings } from "@/services/SpendingServices";

export const useFormHandling = (setTransactions, setIsOpenForm) => {
  const [selectedType, setSelectedType] = useState("expense");
  const [selectedCashType, setSelectedCashType] = useState("cash");
  const [spendingName, setSpendingName] = useState("");
  const [spendingAmount, setSpendingAmount] = useState("");
  const [spendingDesc, setSpendingDesc] = useState("");
  const [selectedTag, setSelectedTag] = useState([]);

  const handleTagSelect = (e) => {
    const value = e.target.value;
    setSelectedTag((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const resetForm = () => {
    setSpendingName("");
    setSpendingAmount("");
    setSpendingDesc("");
    setSelectedTag([]);
    setSelectedType("expense");
    setSelectedCashType("cash");
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      // 1. Validate Tên
      if (!spendingName || spendingName.trim() === "") {
        toast.error("Tên giao dịch không được để trống!");
        return;
      }

      // 2. Validate & Ép kiểu Số tiền
      const numericAmount = Number(spendingAmount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        toast.error("Số tiền phải lớn hơn 0!");
        return;
      }

      // 3. Validate Tags
      if (selectedTag !== undefined && !Array.isArray(selectedTag)) {
        toast.error("Tags không hợp lệ!");
        return;
      }

      const spendingData = {
        title: spendingName.trim(),
        description: spendingDesc,
        amount: numericAmount, // Gửi kiểu Number đã ép
        type: selectedType,
        walletType: selectedCashType,
        tag: selectedTag,
      };

      const res = await createSpendings(spendingData);

      // Cập nhật State danh sách giao dịch ở UI (Mới nhất lên đầu)
      const createdItem = res.data?.data || res.data;
      setTransactions((prevTransactions) => [createdItem, ...prevTransactions]);

      toast.success("Lưu giao dịch thành công!");
      resetForm();
      setIsOpenForm(false);
    } catch (error) {
      console.error("Lỗi khi post chi tiêu:", error);
      const errorMsg = error.response?.data?.message || "Lưu giao dịch thất bại!";
      toast.error(errorMsg);
    }
  };

  return {
    selectedType,
    setSelectedType,
    selectedCashType,
    setSelectedCashType,
    spendingName,
    setSpendingName,
    spendingAmount,
    setSpendingAmount,
    spendingDesc,
    setSpendingDesc,
    selectedTag,
    handleTagSelect,
    handleSubmit,
  };
};