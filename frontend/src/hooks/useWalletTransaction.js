
import { updateUserWallet } from "@/utils/WalletUtils/walletUtils";
import { useMemo, useState } from "react";

export const useWalletTransactions = (userWallet,setUserWallet, selectedWallet,totalExpense,totalIncome) => {
    const [userChoice, setUserChoice] = useState("expense");
    const [userAmount, setUserAmount] = useState(0);
    const currUserWallet = useMemo(()=>{
      const userWalletOrg = userWallet.get(selectedWallet)?.balance ?? 0;
   
      const currValue = userWalletOrg - totalExpense + totalIncome;
   
      return {
          currValue,
          userWalletOrg
      }
    },[userWallet,totalExpense,selectedWallet,totalIncome])
    const handleInsertTransaction = () => {
        if (userChoice === "expense") {
          if (userAmount > currUserWallet.currValue) {
            alert("Số dư không đủ để thực hiện giao dịch này.");
            return;
          }
          updateUserWallet(setUserWallet, selectedWallet, currUserWallet.userWalletOrg - userAmount);
        } else if (userChoice === "insert") {
          updateUserWallet(setUserWallet, selectedWallet, currUserWallet.userWalletOrg + userAmount);
        }
      }
    return {currUserWallet,setUserChoice,setUserAmount,handleInsertTransaction};
}