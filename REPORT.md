# Báo Cáo Kỹ Thuật – Dự Án MTracker

> **Thời điểm tạo báo cáo:** 08/10/2026  
> **Mục đích:** Giúp người đọc hiểu toàn bộ codebase mà không cần mở từng file.

---

## 1. TỔNG QUAN

### 1.1 Dự án làm gì

**MTracker** là ứng dụng quản lý tài chính cá nhân. Người dùng có thể:

- Đăng ký / đăng nhập / đăng xuất tài khoản.
- Tạo và quản lý nhiều **ví** (ví tiền mặt, ngân hàng, MoMo, …).
- **Nạp tiền / rút tiền** vào từng ví.
- Ghi nhận **giao dịch thu nhập hoặc chi tiêu**, gán tag danh mục (ăn uống, đi lại, giải trí, mua sắm, khác).
- Xem, chỉnh sửa, xóa giao dịch.
- Lọc giao dịch theo **ngày / tháng / năm**, điều hướng về quá khứ bằng nút mũi tên.
- Xem **thống kê chi tiêu theo danh mục** (CardLayout) và tổng số dư ví.
- Xem **trang cá nhân**: tên, ngày tham gia, số ví, tổng giao dịch.

### 1.2 Cấu trúc thư mục (2–3 cấp)

```
MoneyM/                          ← thư mục gốc monorepo
├── package.json                 ← script build & start toàn bộ dự án
├── README.md
├── .gitignore
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js            ← entry point backend
│       ├── Lib/
│       │   └── db.js            ← kết nối MongoDB
│       ├── middlewares/
│       │   └── authMiddleware.js
│       ├── Model/
│       │   ├── Users.js
│       │   ├── Transaction.js
│       │   ├── Wallet.js
│       │   └── Session.js
│       ├── Routes/
│       │   ├── authRoutes.js
│       │   ├── transactionsRoute.js
│       │   ├── userRoutes.js
│       │   └── walletRoute.js
│       └── Controller/
│           ├── authController.js
│           ├── transactionsController.js
│           ├── userController.js
│           └── walletController.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx              ← router gốc
│       ├── main.jsx
│       ├── index.css
│       ├── pages/               ← 4 trang (route)
│       ├── components/          ← ~25 component
│       │   ├── layouts/
│       │   └── ui/
│       ├── stores/              ← Zustand stores
│       ├── services/            ← hàm gọi API
│       ├── hooks/               ← custom hooks
│       ├── utils/               ← hàm tính toán, lọc ngày, icon
│       └── lib/                 ← axios instance, utils
└── docs/                        ← không rõ nội dung (thư mục tồn tại nhưng không thấy file)
```

### 1.3 Thư viện chính

#### Backend (`backend/package.json`)

| Thư viện | Mục đích |
|---|---|
| `express` (v5) | Web framework |
| `mongoose` | ODM kết nối MongoDB |
| `bcrypt` | Hash mật khẩu |
| `jsonwebtoken` | Tạo và xác thực JWT (access token) |
| `cookie-parser` | Đọc cookie HTTP (dùng cho refresh token) |
| `cors` | Cấu hình CORS |
| `dotenv` | Đọc biến môi trường từ `.env` |
| `axios` | Được cài nhưng **không thấy dùng** trong code backend |
| `nodemon` (dev) | Tự khởi động lại server khi có thay đổi |

#### Frontend (`frontend/package.json`)

| Thư viện | Mục đích |
|---|---|
| `react` + `react-dom` | UI framework |
| `react-router` (v7) | Điều hướng trang |
| `zustand` | Quản lý state toàn cục |
| `axios` | HTTP client gọi API |
| `react-hook-form` | Quản lý form |
| `zod` | Validate dữ liệu form (schema) |
| `@hookform/resolvers` | Kết nối zod với react-hook-form |
| `tailwindcss` + `@tailwindcss/vite` | Styling utility-first |
| `lucide-react` | Icon |
| `sonner` | Toast notification |
| `shadcn` / `@base-ui/react` | Một số component UI (dialog, popover, …) |
| `cmdk` | Command menu (dùng trong Combobox) |
| `clsx` + `tailwind-merge` + `cva` | Kết hợp class Tailwind |
| `@fontsource-variable/geist` | Font chữ |
| `gh-pages` | Deploy lên GitHub Pages |
| `vite` (dev) | Build tool |

---

## 2. BACKEND

### 2.1 Khởi động server

**File entry:** `backend/src/server.js`

Thứ tự khởi động:
1. `dotenv.config()` – load biến môi trường.
2. Đặt DNS server thành `8.8.8.8` (tránh vấn đề DNS trên một số môi trường cloud).
3. `app.set("trust proxy", 1)` – cần thiết để cookie `secure` hoạt động trên Render.
4. Đăng ký middleware toàn cục:
   - `cors(...)` với cấu hình origin động (xem chi tiết bên dưới).
   - `express.json()` – parse JSON body.
   - `cookie-parser` – parse cookie.
5. Mount routes:
   - `/api/auth` → authRoutes *(không cần auth)*
   - `/api/users` → userRoutes *(cần `protectedRoute`)*
   - `/api/transactions` → transactionsRoute *(cần `protectedRoute`)*
   - `/api/wallets` → walletRoute *(cần `protectedRoute`)*
6. Ở chế độ `production`: phục vụ static file từ `frontend/dist` và fallback về `index.html` cho SPA.
7. `connectDB()` → sau khi kết nối MongoDB thành công mới `app.listen`.

**CORS:** Cho phép origin chứa `localhost`, `127.0.0.1`, `ngrok-free.dev`, hoặc `onrender.com`. Cấu hình `credentials: true`.

### 2.2 Biến môi trường (chỉ tên)

Các biến được đọc trong code backend:

- `PORT`
- `MONGODB_URI`
- `ACCESS_TOKEN_SECRET`
- `NODE_ENV`

### 2.3 Mongoose Models

#### Model `User` (`backend/src/Model/Users.js`)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `userName` | String | required, unique, trim, lowercase |
| `hashedPassword` | String | required |
| `email` | String | required, unique, lowercase, trim |
| `displayedName` | String | required, trim |
| `avatarURL` | String | không bắt buộc |
| `avatarId` | String | không bắt buộc |
| `bio` | String | maxlength 500 |
| `phone` | String | sparse (không unique nhưng có index thưa) |
| `createdAt`, `updatedAt` | Date | tự động (timestamps) |

#### Model `Transaction` (`backend/src/Model/Transaction.js`)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `userId` | ObjectId | required, index, ref → `User` |
| `title` | String | required, trim |
| `description` | String | trim, default `""` |
| `amount` | Number | required |
| `type` | String | required, enum: `["income", "expense"]` |
| `tag` | String | required |
| `completedAt` | Date | default null |
| `walletType` | String | required |
| `createdAt`, `updatedAt` | Date | tự động (timestamps) |

> **Lưu ý:** `tag` không có enum ràng buộc ở tầng model, chỉ validate ở controller và frontend. `walletType` lưu **tên ví** (string), không phải ObjectId.

#### Model `Wallet` (`backend/src/Model/Wallet.js`)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `userId` | ObjectId | required, index, ref → `User` |
| `walletName` | String | required, unique (toàn bộ collection!), trim |
| `remainAmount` | Number | required |

> **Vấn đề nghiêm trọng:** `walletName` có ràng buộc `unique` ở cấp **collection** toàn cục, không phải unique theo từng user. Điều này có nghĩa là hai user khác nhau **không thể** đặt tên ví trùng nhau.

#### Model `Session` (`backend/src/Model/Session.js`)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `userId` | ObjectId | required, index, ref → `User` |
| `refreshToken` | String | required, unique |
| `expiredAt` | Date | required |
| `createdAt`, `updatedAt` | Date | tự động (timestamps) |

> **TTL Index:** `{expiredAt: 1}` với `expireAfterSeconds: 0` – MongoDB tự xóa session khi quá hạn.

### 2.4 Bảng API Endpoint

| Method | Đường dẫn | Auth | Request Body / Params | Response | File xử lý |
|---|---|---|---|---|---|
| POST | `/api/auth/signup` | Không | `{userName, password, email, firstName, lastName}` | `200` hoặc `400`/`500` | `authController.js → signUp` |
| POST | `/api/auth/signin` | Không | `{userName, password}` | `200 {message, accessToken}` + set cookie `refreshToken` | `authController.js → signIn` |
| POST | `/api/auth/signout` | Không | — | `204` + clear cookie | `authController.js → signOut` |
| POST | `/api/auth/refreshtoken` | Không | — (cookie) | `200 {accessToken, user}` | `authController.js → refreshToken` |
| GET | `/api/users/me` | ✅ | — | `200` user object (không có `hashedPassword`) | `userController.js → authme` |
| GET | `/api/transactions` | ✅ | — | `200` mảng transaction của user, sort `createdAt` DESC | `transactionsController.js → getAllTransactions` |
| GET | `/api/transactions/analyze` | ✅ | — | `200 {count, totalIncome, totalExpense}` | `transactionsController.js → getTransReport` |
| POST | `/api/transactions` | ✅ | `{title, description, amount, type, tag, walletType}` | `201` transaction mới | `transactionsController.js → createTransaction` |
| PUT | `/api/transactions/:id` | ✅ | `{title?, amount?, type?, tag?, walletType?, description?}` | `200` transaction đã cập nhật | `transactionsController.js → updateTransaction` |
| DELETE | `/api/transactions/:id` | ✅ | params: `id` | `200 {message}` | `transactionsController.js → deleteTransaction` |
| GET | `/api/wallets` | ✅ | — | `200` mảng ví của user | `walletController.js → getUserWallet` |
| GET | `/api/wallets/analyze` | ✅ | — | `200 {totalWalletNums}` | `walletController.js → getAnalyzeReport` |
| POST | `/api/wallets` | ✅ | `{walletName, remainAmount}` | `200` ví mới | `walletController.js → createNewWallet` |
| PUT | `/api/wallets/:walletName` | ✅ | `{amount}` (số dương hoặc âm) | `200` ví đã cập nhật | `walletController.js → updateWallet` |

### 2.5 Xác thực và phân quyền

**Tạo JWT:**
- Khi đăng nhập thành công (`signIn`), server tạo:
  - **Access token** (JWT): `jwt.sign({userId}, ACCESS_TOKEN_SECRET, {expiresIn: '30m'})` – hết hạn sau 30 phút.
  - **Refresh token**: `crypto.randomBytes(64).toString('hex')` – chuỗi ngẫu nhiên, **không phải JWT**, lưu vào DB (`Session`), gửi qua `httpOnly` cookie. Hết hạn sau 14 ngày.
- Refresh token: `httpOnly: true`, `secure` chỉ ở production, `sameSite: 'none'` ở production và `'lax'` ở dev.

**Middleware `protectedRoute`** (`backend/src/middlewares/authMiddleware.js`):
1. Đọc header `Authorization: Bearer <token>`.
2. Nếu không có token → `401`.
3. `jwt.verify(token, ACCESS_TOKEN_SECRET, callback)` – xác thực JWT.
4. Lấy user từ DB bằng `userId` trong payload, bỏ `hashedPassword`.
5. Gán `req.user = user` và gọi `next()`.

**Kiểm tra quyền sở hữu dữ liệu:**
- `getAllTransactions`, `createTransaction`: lấy `userId = req.user._id` từ middleware → đúng.
- `updateTransaction`, `deleteTransaction`: dùng `{_id: id, userId}` trong query → đúng, user chỉ sửa/xóa được giao dịch của mình.
- `getUserWallet`, `createNewWallet`, `updateWallet`, `getAnalyzeReport`: lấy `userId = req.user._id` → đúng.

### 2.6 Validate dữ liệu và xử lý lỗi

**Validate có thực hiện**, nhưng **không nhất quán**:

- `signUp` (`authController.js`, dòng 14): kiểm tra thủ công `!userName || !password || !email || !firstName || !lastName`.
- `createTransaction` (`transactionsController.js`, dòng 30–44): validate bằng mảng `errors[]` tự viết, kiểm tra title, amount, type, tag. Trả `400` với message join bằng dấu phẩy.
- `updateTransaction` (`transactionsController.js`, dòng 80–97): validate tương tự, kiểm tra từng trường nếu có.
- `createNewWallet` (`walletController.js`): **không validate** `walletName` hay `remainAmount`. Nếu thiếu, Mongoose sẽ throw lỗi và bị bắt ở `catch`.
- `updateWallet` (`walletController.js`, dòng 41): cộng trực tiếp `wallet.remainAmount += amount` mà **không kiểm tra** `amount` có phải số không, có thể dẫn tới `NaN`.

**Định dạng response lỗi:** Hầu hết dùng `{message: "..."}`, nhưng **không nhất quán** hoàn toàn (một số trả `sendStatus(200/204)` không có body).

**HTTP status code lỗi server:** `walletController.js` dùng `501` (Not Implemented) thay vì `500` (Internal Server Error) – có thể là nhầm.

### 2.7 Aggregation

Dùng MongoDB aggregation trong `getTransReport` (`transactionsController.js`, dòng 150–165):

```js
Transaction.aggregate([
  { $match: { userId } },
  { $group: {
    _id: null,
    count: { $sum: 1 },
    totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
    totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
  }},
  { $project: { _id: 0 } },
])
```

Không có upload file / xử lý multipart trong codebase.

### 2.8 Phần làm dở, code chết, TODO

- `backend/package.json` phụ thuộc `axios` (v1.20) nhưng không có đoạn code nào trong backend dùng đến nó.
- `frontend/src/lib/mockData.js`: một Map cũ `INITIAL_WALLETS` với data hardcode (tiền mặt, BIDV, MoMo, Sacombank). **Không được dùng ở bất kỳ đâu** trong code hiện tại – đây là dữ liệu thời chưa có backend.
- `frontend/src/utils/WalletUtils/walletUtils.js`: hàm `updateUserWallet` dùng `Map` – kiểu quản lý ví cũ, không còn được dùng ở bất kỳ đâu.
- `frontend/src/utils/TagIcon/` – thư mục tồn tại nhưng không có file bên trong (dựa theo cấu trúc thư mục).
- `frontend/src/utils/SpendingUtils/CalculateUtils.js`: hàm `filterByWalletAndPeriod` được định nghĩa nhưng **không thấy import ở đâu** trong codebase.
- `PersonalPage.jsx` (dòng 56): có một `<div></div>` trống trong grid 3 cột – placeholder chưa điền nội dung.
- Nút "Quên mật khẩu?" (`signin-form.jsx`, dòng 89): không có action.
- Nút "Chi tiết" trong `CardLayout.jsx` (dòng 52): không có action.
- Nút "Cài đặt ví" (Settings icon) trong `MoneyManager.jsx` (dòng 72–78): không có action.
- Nút ArrowLeft và Settings trong `PersonalPage.jsx` (dòng 24–26): không có action.
- `completedAt` trong `Transaction` model: trường này tồn tại nhưng **không bao giờ được gán giá trị** trong controller.

---

## 3. FRONTEND

### 3.1 Cấu trúc thư mục src

```
src/
├── App.jsx                  ← định nghĩa router, gọi initAuth khi mount
├── main.jsx                 ← React.render entry
├── pages/
│   ├── SignInPage.jsx        ← trang đăng nhập
│   ├── SignUpPage.jsx        ← trang đăng ký
│   ├── HomePage.jsx          ← trang chính (dashboard)
│   └── PersonalPage.jsx      ← trang cá nhân
├── components/
│   ├── layouts/
│   │   └── AppLayout.jsx     ← layout bọc các trang cần auth: fetch data, render NavBar/Footer/TransactionForm
│   ├── ui/                   ← primitive UI (Button, Input, Card, Dialog, Combobox, …)
│   ├── ProtectedRoute.jsx    ← kiểm tra accessToken, redirect /signin nếu chưa đăng nhập
│   ├── Header.jsx            ← thanh tiêu đề + bộ lọc ngày/tháng/năm
│   ├── NavBar.jsx            ← thanh điều hướng dưới (Home / + / Profile)
│   ├── Footer.jsx            ← footer (không rõ nội dung chi tiết)
│   ├── MoneyManager.jsx      ← card ví lớn, hiển thị số dư, nút thêm ví / nạp-rút
│   ├── CardLayout.jsx        ← thống kê chi tiêu theo tag (scroll ngang)
│   ├── CardItem.jsx          ← một ô thống kê (tag + tổng + phần trăm)
│   ├── TransactionTable.jsx  ← bảng giao dịch + phân trang + điều hướng thời gian
│   ├── TransactionItem.jsx   ← một dòng giao dịch trong bảng
│   ├── TransactionsDetails.jsx ← popup chi tiết giao dịch (xem, xóa, chỉnh sửa)
│   ├── TransactionForm.jsx   ← form thêm giao dịch mới (modal)
│   ├── UpdatingTransForm.jsx ← form chỉnh sửa giao dịch (nhúng trong TransactionsDetails)
│   ├── WalletTransferForm.jsx← form nạp/rút tiền vào ví
│   ├── TransactionsIcon.jsx  ← icon tương ứng với tag giao dịch
│   ├── SearchBar.jsx         ← thanh tìm kiếm (chức năng tìm kiếm chưa rõ đã kết nối hay chưa)
│   ├── DateFilterComboBox.jsx← combobox chọn bộ lọc ngày
│   ├── TablePagination.jsx   ← phân trang cho bảng giao dịch
│   └── *Skeleton.jsx         ← các component skeleton loading
├── stores/
│   ├── useAuthStore.js       ← Zustand: user, accessToken, loading
│   ├── useTransactionsStore.js ← Zustand: danh sách giao dịch, report
│   └── useWalletStore.js     ← Zustand: danh sách ví, ví đang chọn, report
├── services/
│   ├── authServices.js       ← gọi API auth
│   ├── transactionsServices.js ← gọi API transactions
│   └── walletService.js      ← gọi API wallets
├── hooks/
│   ├── useTransactions.js    ← custom hook lọc và tính toán giao dịch (useMemo)
│   └── usePagination.js      ← custom hook phân trang
├── utils/
│   ├── DateUtils/
│   │   ├── dateChecker.js    ← hàm so sánh ngày (isSameDay, isSameMonth, isSameYear)
│   │   └── DateFilterUtils.js← hàm lọc giao dịch theo khoảng thời gian
│   ├── SpendingUtils/
│   │   ├── CalculateUtils.js ← tính tổng chi/thu, phần trăm, nhóm theo tag
│   │   └── TransactionsIconUtils.js ← map tag → icon/màu
│   ├── WalletUtils/
│   │   └── walletUtils.js    ← hàm cũ (không còn dùng)
│   └── TagIcon/              ← thư mục rỗng
└── lib/
    ├── axios.js              ← axios instance + interceptors
    ├── mockData.js           ← dữ liệu cũ (không còn dùng)
    └── utils.js              ← hàm `cn()` kết hợp class Tailwind
```

### 3.2 Quản lý state

Dùng **Zustand** (không dùng Context API hay Redux).

| Store | State chính | Hành động chính |
|---|---|---|
| `useAuthStore` (`userStore`) | `user`, `accessToken`, `loading` | `initAuth`, `signIn`, `signUp`, `signOut`, `fetchMe` |
| `useTransactionsStore` | `transactions[]`, `loading`, `report` | `fetchTransactions`, `createTransaction`, `updateTransactions`, `deleteTransaction`, `fetchTransAnalyze` |
| `useWalletStore` | `wallets[]`, `selectedWallet`, `loading`, `walletReport` | `fetchWallets`, `updateWallet`, `changeWallet`, `getBalanceById`, `getTotalBalance`, `getWalletOptions`, `fetchReport` |

Tất cả state toàn cục đều nằm trong 3 store Zustand. Không có Context API. `useState` chỉ dùng cho state cục bộ trong component (toggle form, loading tạm thời).

### 3.3 Cách gọi API

**Tập trung tại:**
- `frontend/src/lib/axios.js` – cấu hình axios instance (`api`), có interceptors.
- `frontend/src/services/` – mỗi file tương ứng với một domain (auth, transactions, wallets).

**Base URL:**
- `MODE === "production"`: `"/api"` (relative, vì backend serve cả frontend).
- Còn lại: `"http://localhost:5001/api"`.

**Interceptors:**
1. **Request interceptor:** Tự động đính kèm `Authorization: Bearer <accessToken>` (lấy từ `useAuthStore` qua getter lazy để tránh circular dependency).
2. **Response interceptor:** Nếu nhận `401` và chưa retry → tự động gọi `POST /api/auth/refreshtoken` (cookie tự đính kèm) → lưu access token mới → retry request cũ. Nếu refresh cũng thất bại → set token về `null`.

### 3.4 Lưu và gửi token đăng nhập

| Token | Lưu ở đâu | Gửi như thế nào |
|---|---|---|
| **Access Token** | Zustand store (`useAuthStore.accessToken`) – **bộ nhớ RAM**, không localStorage | Header `Authorization: Bearer <token>` (do interceptor tự thêm) |
| **Refresh Token** | `httpOnly` cookie (do server set) | Cookie tự động đính kèm nhờ `withCredentials: true` |

Khi tải lại trang (`initAuth`): gọi `POST /api/auth/refreshtoken` ngay lập tức để lấy lại access token mới (từ cookie refresh token còn hạn). Nếu thành công → lấy user info → hiển thị app. Nếu thất bại → redirect đăng nhập.

### 3.5 Luồng dữ liệu của 3 màn hình chính

#### Màn hình Home (`HomePage.jsx`)

1. **AppLayout** mount → `useEffect` gọi `fetchWallets()` và `fetchTransactions()` → cập nhật `useWalletStore.wallets` và `useTransactionsStore.transactions`.
2. Trong khi loading → hiển thị skeleton components.
3. Sau khi load xong:
   - **MoneyManager** đọc `wallets`, `selectedWallet` từ `useWalletStore`. Dùng `useTransactions` hook tính `totalExpenseAllTime` và `totalIncomeAllTime` cho ví đang chọn để tính số dư hiển thị (`remainAmount - totalExpense + totalIncome`).
   - **Header** hiển thị ngày hôm nay và 3 nút lọc (Ngày/Tháng/Năm). Khi bấm → cập nhật `selectedDateFilter` ở `HomePage` state.
   - **CardLayout** dùng `useTransactions` hook lọc giao dịch theo thời gian, gom nhóm theo tag → hiển thị các ô thống kê.
   - **TransactionTable** lọc giao dịch theo thời gian + offset (điều hướng quá khứ), phân trang 4 item/trang. Bấm vào item → mở `TransactionsDetails` modal.

#### Màn hình Thêm Giao Dịch (`TransactionForm.jsx`)

1. User bấm nút `+` ở `NavBar` → `AppLayout` set `isOpenForm = true` → render `<TransactionForm>`.
2. Form dùng `react-hook-form` + `zodResolver` validate client-side (tên, số tiền, type, tag, walletType).
3. User submit → `onSubmit` gọi `useTransactionsStore.createTransaction(data)`.
4. Store gọi `createTransactionApi(data)` → `POST /api/transactions` (axios tự gắn Bearer token).
5. Backend validate → tạo document → trả `201` transaction mới.
6. Store cập nhật: `set({ transactions: [res.data, ...get().transactions] })` (optimistic – thêm vào đầu mảng ngay).
7. Nếu thành công → toast "Thêm giao dịch thành công!" → đóng form.

#### Màn hình Cá Nhân (`PersonalPage.jsx`)

1. Trang đọc `user` từ `useAuthStore` (đã có sau `initAuth`).
2. `useEffect` gọi `fetchReport()` (số lượng ví) và `fetchTransAnalyze()` (tổng giao dịch, tổng thu, tổng chi) – chạy lại mỗi khi `wallets` hoặc `transactions` thay đổi.
3. Hiển thị: avatar cố định (hardcoded từ asset `avatarImg.png`), tên hiển thị, username, ngày tham gia, số ví, tổng giao dịch.
4. Nhiều chức năng chưa có: nút ArrowLeft và Settings không có hành động, không có chỉnh sửa thông tin cá nhân, không hiển thị tổng thu/chi.

---

## 4. LUỒNG HOẠT ĐỘNG

### 4.1 Luồng đăng nhập

```
[User] Nhập userName + password → submit form
  → SignInForm.onSubmit()
  → userStore.signIn(userName, password)
  → authService.signIn() → POST /api/auth/signin
  → [Backend] Tìm user theo userName
  → bcrypt.compare(password, hashedPassword)
  → Tạo accessToken (JWT, 30m) + refreshToken (random 64 bytes)
  → Lưu Session {userId, refreshToken, expiredAt} vào MongoDB
  → Set cookie httpOnly "refreshToken"
  → Trả {message, accessToken}
  → [Frontend] userStore.set({accessToken})
  → userStore.fetchMe() → GET /api/users/me
  → [Backend] protectedRoute kiểm tra JWT → trả user object
  → [Frontend] userStore.set({user})
  → toast "Chào mừng bạn quay trở lại!"
  → navigate("/")
```

### 4.2 Luồng thêm một giao dịch

```
[User] Bấm nút "+" ở NavBar
  → AppLayout.setIsOpenForm(true)
  → Render <TransactionForm>

[User] Điền form (tên, loại, ví, số tiền, tag, mô tả) → Submit
  → react-hook-form validate với zodResolver
  → Nếu có lỗi → hiển thị lỗi inline, dừng lại
  → Nếu OK → TransactionForm.onSubmit(data)
  → useTransactionsStore.createTransaction(data)
  → createTransactionApi(data) → POST /api/transactions
    [axios interceptor tự gắn Authorization: Bearer <accessToken>]

  → [Backend] protectedRoute kiểm tra JWT → gán req.user
  → createTransaction controller:
      - Validate: title, amount, type, tag
      - new Transaction({userId, title, description, amount, type, tag, walletType})
      - transaction.save() → lưu vào MongoDB
      - return res.status(201).json(newTransaction)

  → [Frontend] axios nhận response 201
  → useTransactionsStore: set({transactions: [newTransaction, ...oldTransactions]})
  → UI tự re-render (Zustand reactive) → giao dịch mới xuất hiện đầu bảng
  → toast "Thêm giao dịch thành công!"
  → setIsOpenForm(false) → đóng form
```

---

## 5. DEPLOY

### 5.1 Cách build và deploy hiện tại

**Script tại `package.json` gốc** (`d:\MoneyM\package.json`):

```json
"build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend"
"start": "npm run start --prefix backend"
```

Quy trình:
1. `npm run build` → cài dependencies cả 2 phía, build frontend Vite (`npm run build` trong `/frontend`) → output ra `frontend/dist`.
2. `npm start` → chạy `node backend/src/server.js`. Backend ở chế độ production sẽ serve `frontend/dist` như static file và fallback về `index.html`.

**Deploy lên Render** (suy đoán dựa theo comment và CORS config): Toàn bộ monorepo được deploy như một web service duy nhất. Backend phục vụ cả API lẫn frontend static.

**Deploy lên GitHub Pages (tùy chọn)**: `frontend/package.json` có script:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```
Chỉ deploy frontend riêng lẻ. Khi đó cần backend deploy riêng (Render hoặc nơi khác) và cấu hình `VITE_API_URL` – nhưng **hiện tại không có biến môi trường VITE_** nào trong code frontend, base URL được hardcode trong `axios.js`.

**Biến môi trường cần có khi deploy:**

| Biến | Nơi | Mô tả |
|---|---|---|
| `PORT` | Backend | Port server lắng nghe |
| `MONGODB_URI` | Backend | Chuỗi kết nối MongoDB |
| `ACCESS_TOKEN_SECRET` | Backend | Secret key ký JWT |
| `NODE_ENV` | Backend | Đặt `"production"` để bật serve static |

---

## 6. NHẬN XÉT KỸ THUẬT

### 6.1 Lỗi tiềm ẩn và vấn đề bảo mật

**[BẢO MẬT - NGHIÊM TRỌNG]** `Wallet.walletName` có unique constraint ở cấp collection toàn cục (`backend/src/Model/Wallet.js`, dòng 14). Hai user không thể tạo ví trùng tên nhau. Đây là lỗi thiết kế dữ liệu, nên dùng unique compound index `{userId, walletName}`.

**[BẢO MẬT - TRUNG BÌNH]** `updateWallet` không validate input `amount` (`walletController.js`, dòng 35–47). Nếu client gửi `amount: "abc"`, `wallet.remainAmount` sẽ thành `NaN` và lưu vào DB. Cần validate phía server trước khi cộng.

**[BẢO MẬT - TRUNG BÌNH]** `createNewWallet` không validate `walletName` và `remainAmount` (`walletController.js`, dòng 13–28). Có thể tạo ví với tên rỗng hoặc số dư âm/NaN nếu Mongoose không enforce.

**[BẢO MẬT - NHỎ]** `refreshToken` endpoint (`authController.js`, dòng 82–94) không có `try-catch` bao quanh toàn bộ hàm. Nếu `Session.findOne` hay `User.findById` throw, server sẽ crash (Express 5 tự bắt unhandled promise rejection, nhưng vẫn là thói quen xấu).

**[BẢO MẬT - NHỎ]** CORS origin check dùng `includes` (`server.js`, dòng 30–37): `origin.includes("onrender.com")` có thể bị exploit bởi domain dạng `evil.com?onrender.com`. Nên dùng whitelist chính xác.

**[LỖI LOGIC]** `MoneyManager.jsx` tính số dư hiển thị bằng cách lấy `remainAmount` từ Wallet (số dư gốc khi tạo ví) rồi cộng/trừ tổng thu/chi từ giao dịch (`dòng 35–38`). Điều này có thể bị lệch nếu user đã nạp/rút tiền vào ví (vì nạp/rút cũng tạo giao dịch với tag "transfer"). Giao dịch "transfer" bị exclude khỏi phép tính bởi `t.tag !== "transfer"`, nhưng `remainAmount` trong DB đã được cộng/trừ khi nạp/rút. Kết quả số dư hiển thị và số dư thực tế trong DB có thể không khớp.

**[HTTP STATUS]** `walletController.js` dùng status `501` (Not Implemented) cho lỗi server thay vì `500` (dòng 10, 27, 46, 64). Đây là lỗi nhầm status code.

### 6.2 Code lặp, logic rối, đặt sai chỗ

- **Logic lọc ngày bị nhân đôi:** `CalculateUtils.js` có hàm `isInPeriod` và `filterByWalletAndPeriod` (dòng 111–145) với logic gần giống hệt `DateFilterUtils.js`. `filterByWalletAndPeriod` không được dùng ở đâu – code chết.
- **Hai cách filter giao dịch song song:** `useTransactions` hook dùng `filterTransactionsByDate` (từ DateFilterUtils), trong khi `CalculateUtils` có `filterByWalletAndPeriod` riêng – dẫn đến khó maintain.
- **TransactionTable truyền `selectedWallet: ""` rỗng** (`TransactionTable.jsx`, dòng 23): table hiển thị giao dịch của **tất cả ví**, không lọc theo ví đang chọn như MoneyManager và CardLayout. Điều này có thể là ý định, nhưng không rõ ràng và không nhất quán với MoneyManager.
- **`useEffect` trong `PersonalPage.jsx`** (dòng 15–18) phụ thuộc vào `[wallet, trans]` – mỗi khi mảng thay đổi reference (fetch xong) sẽ trigger lại. Có thể gây gọi API thừa nếu không cẩn thận.

### 6.3 Những thứ còn thiếu

- **Không có test nào** (unit, integration, e2e). Script `test` chỉ là `echo "Error: no test specified"`.
- **Không có phân trang phía server:** `getAllTransactions` trả toàn bộ giao dịch của user, phân trang chỉ ở client. Khi dữ liệu lớn, hiệu năng sẽ kém.
- **Không có tài liệu API** (Swagger/OpenAPI).
- **Không có rate limiting** trên các route nhạy cảm (login, signup).
- **Không có helmet.js** hay các header bảo mật HTTP.
- **Không có logging** có cấu trúc (chỉ dùng `console.log/error`).
- **Không có refresh token rotation:** Khi dùng refresh token để lấy access token mới, refresh token cũ vẫn còn hiệu lực trong DB cho đến khi hết hạn.
- **Không có tính năng:** quên mật khẩu, đổi mật khẩu, đổi thông tin cá nhân, upload avatar, xóa ví, báo cáo chi tiết hơn.
- **Frontend không có tìm kiếm:** `SearchBar.jsx` tồn tại nhưng không rõ có kết nối logic tìm kiếm không.

### 6.4 Top 5 vấn đề đáng sửa nhất (theo ưu tiên)

**#1 – `walletName` unique toàn cục** *(nghiêm trọng nhất)*
- **File:** `backend/src/Model/Wallet.js`, dòng 14
- **Vấn đề:** `unique: true` trên `walletName` khiến 2 user không thể cùng đặt tên ví giống nhau.
- **Sửa:** Xóa `unique: true`, thêm compound index `walletSchema.index({userId: 1, walletName: 1}, {unique: true})`.

**#2 – `updateWallet` không validate `amount`**
- **File:** `backend/src/Controller/walletController.js`, dòng 35–47
- **Vấn đề:** Không kiểm tra `amount` là số, có thể khiến `remainAmount` thành `NaN`.
- **Sửa:** Thêm validate: `const n = Number(amount); if (!isFinite(n)) return res.status(400).json({message: "amount không hợp lệ"})`.

**#3 – `createNewWallet` không validate**
- **File:** `backend/src/Controller/walletController.js`, dòng 13–28
- **Vấn đề:** Không kiểm tra `walletName` (có thể rỗng) và `remainAmount` (có thể âm hoặc NaN).
- **Sửa:** Thêm validate tương tự `createTransaction`.

**#4 – Logic số dư ví hiển thị không đáng tin cậy**
- **File:** `frontend/src/components/MoneyManager.jsx`, dòng 34–38; `frontend/src/utils/SpendingUtils/CalculateUtils.js`, dòng 64–83
- **Vấn đề:** Số dư hiển thị tính từ `remainAmount` gốc ± tổng giao dịch. Khi nạp/rút, `remainAmount` đã thay đổi trong DB nhưng cách tính có thể đếm trùng.
- **Sửa:** Quyết định một nguồn sự thật duy nhất: hoặc luôn dùng `remainAmount` từ DB (cập nhật sau mỗi giao dịch), hoặc luôn tính từ giao dịch. Hiện tại đang dùng kết hợp thiếu nhất quán.

**#5 – Không có phân trang server + toàn bộ data tải về client**
- **File:** `backend/src/Controller/transactionsController.js`, dòng 4–15; `backend/src/Routes/transactionsRoute.js`, dòng 6
- **Vấn đề:** `GET /api/transactions` trả toàn bộ giao dịch của user. Khi user có hàng nghìn giao dịch, request này sẽ rất chậm và tốn bộ nhớ.
- **Sửa:** Thêm `?page=&limit=` query param, dùng `.skip().limit()` ở backend.

---

## 7. CÁC FILE QUAN TRỌNG CẦN XEM LẠI

| File | Lý do quan trọng |
|---|---|
| `backend/src/server.js` | Entry point backend; định nghĩa toàn bộ middleware chain, CORS, mount route, và logic phục vụ frontend production. Bất kỳ thay đổi kiến trúc nào đều bắt đầu từ đây. |
| `backend/src/Controller/authController.js` | Chứa toàn bộ logic xác thực: hash password, tạo JWT/refresh token, quản lý session. Đây là điểm quan trọng nhất về bảo mật. |
| `backend/src/Controller/walletController.js` | Chứa nhiều vấn đề nhất: status code sai (501), thiếu validate, logic cộng trừ số dư nguyên thủy. Cần refactor. |
| `backend/src/Model/Wallet.js` | Model có lỗi thiết kế `unique: true` trên `walletName` ở cấp collection toàn cục – sẽ gây lỗi khi nhiều user dùng cùng tên ví. |
| `frontend/src/lib/axios.js` | Cấu hình trung tâm cho toàn bộ HTTP request: base URL, interceptor auto-attach token, auto-refresh khi 401. Đây là "dây thần kinh" kết nối frontend-backend. |
| `frontend/src/stores/useAuthStore.js` | Quản lý toàn bộ trạng thái xác thực, luồng `initAuth` khi reload trang, kết nối getter/setter cho axios interceptor. |
| `frontend/src/hooks/useTransactions.js` | Custom hook trung tâm xử lý tất cả logic lọc và tính toán thống kê. Nhiều component phụ thuộc vào đây; có dấu hiệu logic phức tạp và dữ liệu tính nhiều lần. |
| `frontend/src/components/MoneyManager.jsx` | Hiển thị thẻ ví chính với số dư – có logic tính số dư không đáng tin cậy (xem mục 6). |
| `frontend/src/components/TransactionForm.jsx` | Form thêm giao dịch là tính năng cốt lõi; cấu trúc tốt (react-hook-form + zod), nhưng tag list hardcode trực tiếp trong component. |
| `backend/src/Controller/transactionsController.js` | Controller lớn nhất, chứa validate thủ công và aggregation. Cần thêm phân trang server-side để tránh load toàn bộ data. |
