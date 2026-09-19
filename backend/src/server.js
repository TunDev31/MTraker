import express from "express";
import dotenv from "dotenv";
import spendingRoutes from "./Routes/spendingRoutes.js";
import dns from "dns";
import {connectDB} from "./Lib/db.js";
import cors from "cors";
dns.setServers(["8.8.8.8"]);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;


// app.use(cors({origin: 'http://localhost:5173'})); // Allow

app.use(cors({
  origin: ['http://localhost:5173', 'https://wildness-alfalfa-boggle.ngrok-free.dev'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true
}));
app.use(express.json());
connectDB();
app.use("/api/spending", spendingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});