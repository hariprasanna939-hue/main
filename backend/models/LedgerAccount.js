import mongoose from "mongoose";

const ledgerAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"],
    required: true,
  },
  balance: {
    type: Number,
    default: 0, // In standard decimal currency (e.g. 100.50)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Compound index to ensure uniqueness of code per tenant
ledgerAccountSchema.index({ userId: 1, code: 1 }, { unique: true });
ledgerAccountSchema.index({ userId: 1, name: 1 });

const LedgerAccount = mongoose.model("LedgerAccount", ledgerAccountSchema);

export default LedgerAccount;
