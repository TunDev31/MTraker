# 🔍 Code Review Cập Nhật - MoneyM (MTracker)

**Lần review trước**: 09/09/2026 | **Lần review này**: 16/09/2026

---

## ✅ NHỮNG GÌ BẠN ĐÃ FIX (Tốt lắm! 👏)

| # cũ | Vấn đề | Trạng thái | Ghi chú |
|------|--------|:----------:|---------|
| #2 | Backend không validate input | ✅ Fixed | [spendingController.js#L15-L24](file:///d:/MoneyM/backend/src/Controller/spendingController.js#L15-L24) — Đã thêm validation cho `title`, `amount`, `tag` |
| #3 | `updateSpending` rỗng gây request hang | ✅ Fixed | [spendingController.js#L42-L51](file:///d:/MoneyM/backend/src/Controller/spendingController.js#L42-L51) — Đã implement đầy đủ |
| #4 | `handleSubmit(req, res)` sai tham số | ✅ Fixed | [TransactionForm.jsx#L36](file:///d:/MoneyM/frontend/src/components/TransactionForm.jsx#L36) — Đổi thành `async (e)` |
| #5 | `spendingAmount` lưu string | ✅ Fixed | [TransactionForm.jsx#L27](file:///d:/MoneyM/frontend/src/components/TransactionForm.jsx#L27) — `Number(event.target.value)` |
| #6 | Tags cộng dồn vô hạn | ✅ Fixed | [TransactionForm.jsx#L32-L34](file:///d:/MoneyM/frontend/src/components/TransactionForm.jsx#L32-L34) — Dùng checkbox + toggle logic |
| #7 | Dead code `selectedTags`, `selectedValue` | ✅ Partially | Đã xóa `selectedTags`. **Nhưng `handleChange`/`setSelectedValue` ở L14-16 vẫn là dead code** (xem bên dưới) |
| #11 | prevTransaction gồm cả income | ✅ Fixed | [CalculateUtils.js#L1-L5](file:///d:/MoneyM/frontend/src/utils/SpendingUtils/CalculateUtils.js#L1-L5) — Đã filter `.type==='expense'` |
| #16 | API URL hardcode | ✅ Fixed | [SpendingServices.js](file:///d:/MoneyM/frontend/src/services/SpendingServices.js) — Dùng `import.meta.env.VITE_API_BASE_URL` |
| #17 | CORS chỉ cho phép localhost | ✅ Fixed | [server.js#L14-L19](file:///d:/MoneyM/backend/src/server.js#L14-L19) — Đã cho `origin: '*'` |
| #18 | `import moose from "mongoose"` | ✅ Fixed | [Spending.js#L1](file:///d:/MoneyM/backend/src/Model/Spending.js#L1) — Đổi thành `mongoose` |
| #19 | `tag: { type: [] }` Mixed type | ✅ Fixed | [Spending.js#L26](file:///d:/MoneyM/backend/src/Model/Spending.js#L26) — Đổi thành `[String]` |
| #20 | `createSpending` trả status 200 | ✅ Fixed | [spendingController.js#L36](file:///d:/MoneyM/backend/src/Controller/spendingController.js#L36) — Đổi thành `201` |
| #21 | Không dùng `useMemo` | ✅ Fixed | [App.jsx#L27-L50](file:///d:/MoneyM/frontend/src/App.jsx#L27-L50) — `expenseStat` wrapped bằng `useMemo` |
| #22 | `isSameDay` dùng `toLocaleDateString` | ✅ Fixed | [dateChecker.js#L10-L12](file:///d:/MoneyM/frontend/src/utils/DateUtils/dateChecker.js#L10-L12) — Dùng `getDate/getMonth/getFullYear` |
| #24 | `ICON_MAP` tạo lại mỗi render | ✅ Fixed | [SpendingIcon.js](file:///d:/MoneyM/frontend/src/utils/SpendingUtils/SpendingIcon.js) — Tách ra module riêng |

---

## 🏗️ CẢI TIẾN KIẾN TRÚC — Rất tốt!

Bạn đã refactor đáng kể cấu trúc code:

```
src/
├── services/SpendingServices.js      ← NEW: API layer tách riêng
├── utils/
│   ├── DateUtils/
│   │   ├── DateFilterUtils.js        ← NEW: Filter logic tách từ App.jsx
│   │   └── dateChecker.js            ← NEW: isSameDay/Month/Year tách ra
│   ├── SpendingUtils/
│   │   ├── CalculateUtils.js         ← NEW: Tính toán expense tách ra
│   │   └── SpendingIcon.js           ← NEW: ICON_MAP constant
│   └── WalletUtils/
│       └── walletUtils.js            ← NEW: updateUserWallet tách ra
└── lib/mockData.js                   ← NEW: Initial wallet data
```

> [!TIP]
> Đây là hướng refactor rất đúng — tách business logic ra khỏi component. `App.jsx` giảm từ **200 dòng → 142 dòng**, dễ đọc hơn nhiều.

---

## 🔴 VẤN ĐỀ CÒN TỒN TẠI

### 1. 🚨 `.ENV` vẫn chứa credentials và chưa có `.gitignore` backend

> [!CAUTION]
> [.ENV](file:///d:/MoneyM/backend/.ENV) vẫn chứa password MongoDB Atlas plaintext. Vẫn chưa thấy `.gitignore` ở `backend/`. Đây vẫn là rủi ro bảo mật **#1** từ review trước.

---

### 2. 🚨 `origin: '*'` + `credentials: true` — cấu hình CORS **xung đột**

[server.js#L14-L19](file:///d:/MoneyM/backend/src/server.js#L14-L19):

```javascript
app.use(cors({
  origin: '*',           // Cho phép mọi nguồn
  credentials: true      // Cho phép gửi cookie/credentials
}));
```

> [!WARNING]
> Theo chuẩn CORS, **không thể dùng `origin: '*'` kết hợp `credentials: true`**. Trình duyệt sẽ block request có `withCredentials`. Nếu chưa dùng cookie/auth → bỏ `credentials: true`. Nếu cần credentials → đặt origin cụ thể.

---

### 3. `handleChange` trong TransactionForm là dead code

[TransactionForm.jsx#L14-L16](file:///d:/MoneyM/frontend/src/components/TransactionForm.jsx#L14-L16):

```javascript
const handleChange = (value) => {
  setSelectedValue(value);   // ← setSelectedValue KHÔNG TỒN TẠI!
};
```

`setSelectedValue` không được khai báo trong component. Gọi hàm này sẽ crash. May là nó chưa được gọi ở đâu → **dead code, nên xóa**.

---

### 4. `updateSpending` nhận thẳng `req.body` — thiếu validate

[spendingController.js#L42-L51](file:///d:/MoneyM/backend/src/Controller/spendingController.js#L42-L51):

```javascript
const updated = await Spending.findByIdAndUpdate(id, req.body, { new: true });
```

`createSpending` đã có validation nhưng `updateSpending` thì **không**. Client có thể gửi field bất kỳ (kể cả `_id`, `__v`, `createdAt`) để ghi đè. Nên whitelist fields được phép update.

---

### 5. `totalExpense` vẫn tính TOÀN BỘ, không theo date filter

[CalculateUtils.js#L40-L47](file:///d:/MoneyM/frontend/src/utils/SpendingUtils/CalculateUtils.js#L40-L47) — `getTotalExpense` filter theo `selectedWallet` nhưng **không filter theo ngày/tháng/năm**:

```javascript
export const getTotalExpense = (transactions, selectedWallet) => transactions
    .filter(trans => trans.type === "expense" && trans.walletType === selectedWallet)
    .reduce((total, trans) => total + trans.amount, 0);
```

Kết quả: `currentWallet = userWallet - totalExpense` trừ **tổng chi tiêu mọi thời đại**, không phải period đang xem. Đây có thể là chủ đích (hiển thị "số dư thực tế"), nhưng nếu vậy thì tên biến `totalExpense` nên rõ ràng hơn (ví dụ: `lifetimeTotalExpense`).

---

### 6. `getExpensePercentage` vẫn có logic fallback gây nhầm lẫn

[CalculateUtils.js#L32-L39](file:///d:/MoneyM/frontend/src/utils/SpendingUtils/CalculateUtils.js#L32-L39):

```javascript
export const getExpensePercentage = (prev, curr) =>
  ((curr - (prev || curr)) / (prev || 1)) * 100;
```

Khi `prev = 0`, `curr = 50000`:
- Tử: `50000 - 50000 = 0` → Kết quả `0%`
- UI hiển thị `"Chưa có dữ liệu"` (đã xử lý ở [TotalBalance.jsx#L118-L120](file:///d:/MoneyM/frontend/src/components/TotalBalance.jsx#L118-L120))

**Tuy nhiên** khi `prev = 0`, `curr = 0` → kết quả cũng là `0%` → UI cũng hiển thị `"Chưa có dữ liệu"` ✅ OK.

Nhưng khi `prev = 30000`, `curr = 50000` → `((50000 - 30000) / 30000) * 100 = 66.7%` → hiển thị `+66.7%` ✅ OK.

Logic hoạt động nhưng **khó đọc**. Đề xuất viết rõ ràng hơn:

```javascript
export const getExpensePercentage = (prev, curr) => {
  if (prev === 0) return 0; // Không có dữ liệu kỳ trước
  return ((curr - prev) / prev) * 100;
};
```

---

### 7. `getMostExpensiveType` gồm cả income

[CalculateUtils.js#L12-L31](file:///d:/MoneyM/frontend/src/utils/SpendingUtils/CalculateUtils.js#L12-L31) — Hàm này tính "Danh mục chi nhiều" nhưng **không filter `trans.type === 'expense'`**. Thu nhập cũng bị tính vào.

---

### 8. `getPrevTotalExpense` và `getCurrTotalExpense` là hàm trùng nhau

[CalculateUtils.js#L1-L10](file:///d:/MoneyM/frontend/src/utils/SpendingUtils/CalculateUtils.js#L1-L10):

```javascript
export const getPrevTotalExpense = (prevTransaction) =>
  prevTransaction.filter(trans => trans.type === 'expense')
    .reduce((total, trans) => total + (trans.amount || 0), 0);

export const getCurrTotalExpense = (currTransaction) =>
  currTransaction.filter(trans => trans.type === 'expense')
    .reduce((total, trans) => total + (trans.amount || 0), 0);
```

Hai hàm **hoàn toàn giống nhau**, chỉ khác tên tham số. Nên gộp thành 1:

```javascript
export const sumExpenses = (transactions) =>
  transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
```

---

### 9. `getDateFilter` thiếu `return` cho default case

[DateFilterUtils.js#L16-L24](file:///d:/MoneyM/frontend/src/utils/DateUtils/DateFilterUtils.js#L16-L24):

```javascript
export const getDateFilter = (selectedDateFilter) => {
  if (selectedDateFilter === "day") return "Ngày";
  else if (selectedDateFilter === "month") return "Tháng";
  else if (selectedDateFilter === "year") return "Năm";
  // ← Nếu truyền giá trị khác → return undefined
};
```

Thêm `return ""` hoặc `return "Ngày"` ở cuối để tránh `undefined`.

---

### 10. File thừa chưa xóa

- [InsertNdrawForm.jsx](file:///d:/MoneyM/frontend/src/components/InsertNdrawForm.jsx) — vẫn là snippet HTML, không phải component
- [test.jsx](file:///d:/MoneyM/frontend/src/components/ui/test.jsx) đã bị xóa ✅ *(Không còn trong danh sách file)*

> Thực ra `test.jsx` vẫn còn — nhưng không ảnh hưởng runtime vì không import.

---

## 📊 TỔNG KẾT SO SÁNH

| Tiêu chí | Trước (09/09) | Sau (16/09) |
|----------|:------------:|:-----------:|
| Vấn đề nghiêm trọng | 3 | 1 (`.ENV`) |
| Bug logic | 8 | 3 |
| Code quality | Trung bình | **Tốt** |
| Kiến trúc | Monolith App.jsx | **Modular** (utils/services) |
| `useMemo` optimization | ❌ | ✅ |
| Input validation (FE) | ❌ | ✅ |
| Input validation (BE) | ❌ | ✅ (create) |
| API layer | Hardcode | ✅ Service layer |

> [!NOTE]
> Tiến bộ rất rõ rệt! Bạn đã fix hầu hết các vấn đề quan trọng và refactor code sạch hơn nhiều. Ưu tiên tiếp theo:
> 1. **Tạo `.gitignore`** cho backend
> 2. **Fix CORS** (`origin: '*'` + `credentials: true`)
> 3. **Gộp** `getPrevTotalExpense`/`getCurrTotalExpense` thành 1 hàm
> 4. **Xóa dead code** (`handleChange` trong TransactionForm)
