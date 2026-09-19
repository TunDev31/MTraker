import express from "express";
import dotenv from "dotenv";
import spendingRoutes from "./Routes/spendingRoutes.js";
import dns from "dns";
import { connectDB } from "./Lib/db.js";
import cors from "cors";
dns.setServers(["8.8.8.8"]);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
import path from "path";
// app.use(cors({origin: 'http://localhost:5173'})); // Allow
const __dirname = path.resolve();
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
if (process.env.NODE_ENV==='production') {
  const frontendDistPath = path.join(__dirname, "frontend", "dist");

  app.use(express.static(frontendDistPath));
app.get("/*path", (req,res)=> {
  res.sendFile(path.join(frontendDistPath, "index.html"));
})
}
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
