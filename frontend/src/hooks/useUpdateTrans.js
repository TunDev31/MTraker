import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import {  updateSpendings } from "@/services/SpendingServices";
export const useUpdateTrans = (setIsOpenForm,item,handleUpdateTransaction) => {
  const [selectedType, setSelectedType] = useState("expense");
  const [selectedCashType, setSelectedCashType] = useState("cash");
  const [spendingName, setSpendingName] = useState("");
  const [spendingAmount, setSpendingAmount] = useState(0);
  const [spendingDesc, setSpendingDesc] = useState("");
  const [selectedTag, setSelectedTag] = useState([]);
  useEffect(() => {
    if (item) {
      setSelectedType(item.type || "expense");
      setSelectedCashType(item.walletType || "cash");
      setSpendingName(item.title || "");
      setSpendingAmount(item.amount || 0);
      setSpendingDesc(item.description || "");
      setSelectedTag(item.tag || []);
    }
  }, [item]);
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
      const res = await updateSpendings(item._id, spendingData);
      const updatedItem = res?.data?._id 
        ? res.data 
        : { ...item, ...spendingData };

      // 3. Cập nhật state ở App
      if (handleUpdateTransaction) {
        handleUpdateTransaction(updatedItem);
      }
      setIsOpenForm(false); // Đóng modal sau khi tạo thành công
      
      toast.success("Cap nhat giao dich thanh cong!");
    } catch (error) {
      console.error("Loi khi put", error);
    }
  };
  return {
    
    spendingName,
    spendingAmount,
    spendingDesc,
    selectedType,
    selectedTag,
    setSelectedType,
    setSelectedCashType,
    setSpendingName,
    setSpendingAmount,
    handleSubmit,
    setSpendingDesc,
    handleTagSelect,
  };
};
