import mongoose from "mongoose";
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  walletName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  remainAmount: {
    type: Number,
    required: true,
  },
});
const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
