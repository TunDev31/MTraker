import express from "express";
import dotenv from "dotenv";
import transactionsRoute from "./Routes/transactionsRoute.js";
import authRoutes from "./Routes/authRoutes.js";
import dns from "dns";
import { connectDB } from "./Lib/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser'
import { protectedRoute } from "./middlewares/authMiddleware.js";
import userRoutes from './Routes/userRoutes.js'
import walletRoute from './Routes/walletRoute.js'
dns.setServers(["8.8.8.8"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Xác định thư mục chuẩn theo vị trí file hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // backend/src
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist"); // Trỏ đúng về frontend/dist

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép tất cả request từ localhost (bất kỳ port nào) hoặc ngrok
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("ngrok-free.dev")) {
        callback(null, true);
      } 
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use(protectedRoute);
app.use("/api/users",userRoutes);
app.use("/api/wallet", walletRoute);
app.use("/api/transactions", transactionsRoute);

// Phục vụ frontend tĩnh khi ở môi trường production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDistPath));

  // Express 5 wildcard route
  app.get("{*path}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0",() => {
    console.log(`Server is running on port ${PORT}`);
  });
});