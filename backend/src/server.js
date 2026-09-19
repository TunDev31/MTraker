import express from "express";
import dotenv from "dotenv";
import spendingRoutes from "./Routes/spendingRoutes.js";
import dns from "dns";
import { connectDB } from "./Lib/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
    origin: [
      "http://localhost:5173",
      "https://wildness-alfalfa-boggle.ngrok-free.dev",
    ],
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

app.use("/api/spending", spendingRoutes);

// Phục vụ frontend tĩnh khi ở môi trường production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDistPath));

  // Express 5 wildcard route
  app.get("{*path}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});