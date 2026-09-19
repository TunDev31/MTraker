import { cn } from "@/lib/utils";
import {
  Film,
  HelpCircle,
  Minimize2,
  PenLine,
  SquarePen,
  Trash,
  Utensils,
  Van,
} from "lucide-react";
import React, { useState } from "react";
import MyCombobox from "./ui/MyCombobox";
import { useUpdateTrans } from "@/hooks/useUpdateTrans";

const TransactionsDetails = ({ item, onClose, deleteTransaction,handleUpdateTransaction }) => {
  const ICON_MAP = {
    food: Utensils,
    travel: Van,
    entertainment: Film,
  };
  const [selectedValue, setSelectedValue] = React.useState(item?.walletType);
  const iconKey = item?.tag?.[0]?.toLowerCase();
  const IconComponent = ICON_MAP[iconKey] || HelpCircle;
  const itemDate = new Date(item.createdAt);
  const hour = itemDate.getHours();
  const minute = itemDate.getMinutes();
  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");
  const hourString = formattedHour + ":" + formattedMinute;
  const [isRewriteEnable, setRewriteEnable] = useState(false);
  const DateString = itemDate.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const {
    spendingName,
    spendingAmount,
    spendingDesc,
    selectedType,
    selectedTag,
    selectedCashType,
      setSelectedType,
      setSelectedCashType,
      setSpendingName,
      setSpendingAmount,
      handleSubmit,
      setSpendingDesc,
      handleTagSelect,
    } = useUpdateTrans( setRewriteEnable,item,handleUpdateTransaction);
  return (
    <div className="w-full bg-white border rounded-2xl p-4 shadow-lg gap-2">
      <div className="flex gap-2 justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div className="flex rounded-full p-2 items-center shrink-0 bg-red-100">
            <IconComponent className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Chi tiết giao dịch</p>
            <p className="text-xs text-gray-500">
              {hourString + " " + DateString}
            </p>
          </div>
        </div>

        {/* Chuyển onClick lên thẻ button và gọi onClose() */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center shrink-0 w-8 h-8 text-red-700 border border-red-700 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
          title="Thu nhỏ"
        >
          <Minimize2 size={15} />
        </button>
      </div>

      {/* Nội dung chi tiết giao dịch thêm ở đây */}
      <div className="flex flex-col mt-4 pt-3 border-t text-sm text-gray-600 gap-2">
        <div className="flex justify-between gap-1 bg-red-100 rounded-2xl items-center p-2">
          <p className="font-bold">
            {" "}
            Số tiền {item?.type === "expense" ? " đã chi" : " đã nhận"}
          </p>
          <div className="flex justify-between sufont-medium text-black px-2 py-0.5 rounded-xl gap-1">
            <p className={cn("text-2xl text-red-700", isRewriteEnable ? "hidden": "")}>{spendingAmount}</p>
            <input type="text" placeholder="Nhap so tien ..."  className={cn("outline-none focus:outline-none focus:ring-0", isRewriteEnable ? "": "hidden") } onChange={(e)=> setSpendingAmount(Number(e.target.value))}/>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold text-black">Tên giao dịch:</p>
          <div className="flex justify-between font-medium text-black bg-[#EBF0F5] px-2 py-1 rounded-xl gap-2">
            <p className={cn("text-xl ", isRewriteEnable ? "hidden": "")}>{item?.title}</p>
             <input type="text" placeholder="Nhap ten giao dich moi ..."  className={cn(" outline-none focus:outline-none focus:ring-0 flex-1", isRewriteEnable ? "": "hidden") } onChange={(e)=> setSpendingName((e.target.value))}/>
           
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          <div className="flex flex-col gap-1 ">
            <p className="font-bold text-black">Danh mục:</p>
            <div className="flex justify-between sufont-medium text-black bg-[#EBF0F5] px-2 py-0.5 rounded-xl">
              {selectedTag?.map((tag, index) => {
                return (
                  <div key={index} className="flex gap-1">
                    <div className=" text-black rounded-xl px-1.5">#{tag}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className=" text-black">Phương thức giao dịch:</p>
            <div className="flex justify-center items-center font-medium text-black bg-[#EBF0F5] px-2 py-0.5 rounded-xl">
              <p className={cn("flex items-center justify-center", isRewriteEnable ? 'hidden': "")}>{selectedCashType}</p>
              <MyCombobox
                            className={cn("w-full z-40 bg-black/60 hover:bg-black/80 border-slate-800 text-white", isRewriteEnable ? "" : "hidden")}
                            placeholder="Loại Thẻ"
                            searchPlaceholder="Tìm loại thẻ"
                            emptyMessage="Loại Thẻ"
                            value={selectedValue}
                            onChange={handleChange}
                            data={[
                              { value: "momo", label: "MoMo" },
                              { value: "sacombank", label: "Sacombank" },
                              { value: "cash", label: "Cash" },
                              { value: "bidv", label: "BIDV" },
                            ]}
                          />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 ">
          <p className="font-bold text-black">Mo ta:</p>
          <div className="flex justify-between sufont-medium text-black bg-[#EBF0F5] px-2 py-0.5 rounded-xl">
            <p className={cn("text-xl ", isRewriteEnable ? "hidden": "")}>{spendingDesc ? spendingDesc : "Khong"}</p>
             <input type="text" placeholder="Nhap mo ta ..."  className={cn(" outline-none focus:outline-none focus:ring-0 flex-1", isRewriteEnable ? "": "hidden") } onChange={(e)=> setSpendingName((e.target.value))}/>
          </div>
          
        </div>
      </div>

      <div className="flex gap-2 items-center justify-between">
          <div className="mt-4 bg-red-100 p-3 inline-block rounded-2xl">
            <button
              onClick={() => {
                deleteTransaction(item._id);
                onClose();
              }}
              className="flex gap-2"
            >
              <Trash />
              Xoa
            </button>
          </div>
          <div className="mt-4 bg-green-100 p-3 inline-block rounded-2xl">
            <button
              onClick={() => 
                setRewriteEnable(true)
              
               }
              className={cn("flex gap-2 ", isRewriteEnable ? 'hidden' : "")}
            >
           <SquarePen />
             Chinh sua
            </button>

            <button
              onClick={(e) => {
                setRewriteEnable(false);
               handleSubmit(e);
              }
               }
              className={cn("flex gap-2 ", isRewriteEnable ? '' : "hidden")}
            >
           <SquarePen  />
             Luu thay doi
            </button>
          </div>
      </div>
    </div>
  );
};

export default TransactionsDetails;
