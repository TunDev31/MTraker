export const updateUserWallet = (setUserWallet,walletId, newBalance) => {
    setUserWallet((prevMap) => {
      // 1. Tạo một bản sao Map mới từ Map cũ
      const nextMap = new Map(prevMap);

      // 2. Lấy object ví cũ và cập nhật balance mới
      const currentWallet = nextMap.get(walletId);
      if (currentWallet) {
        nextMap.set(walletId, { ...currentWallet, balance: newBalance });
      }

      // 3. Trả về Map mới để React kích hoạt re-render
      return nextMap;
    });
  };