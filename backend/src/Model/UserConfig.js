// Model/UserConfig.js
import mongoose from "mongoose";

const spendingLimitSchema = new mongoose.Schema(
  {
    period: { type: String, enum: ["day", "month", "year"], required: true },
    amount: { type: Number, required: true, min: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true },
);

const userConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // đảm bảo 1 user chỉ có 1 config
      index: true,
    },
    spendingLimits: { type: [spendingLimitSchema], default: [] },

    // ví dụ mở rộng sau
    currency: { type: String, default: "VND" },
   
  },
  { timestamps: true },
);

export default mongoose.model("UserConfig", userConfigSchema);
