import mongoose from "mongoose";

const cashTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["inflow", "outflow"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: "cash",
  },
  referenceType: {
    type: String,
    enum: ["PAYMENT", "PURCHASE", "EXPENSE", "MANUAL"],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

cashTransactionSchema.index({ userId: 1, date: -1 });

const CashTransaction = mongoose.model("CashTransaction", cashTransactionSchema);

export default CashTransaction;
