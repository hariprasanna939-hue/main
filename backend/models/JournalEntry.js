import mongoose from "mongoose";

const journalLineSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LedgerAccount",
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  debit: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  }
});

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  entryNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
  referenceType: {
    type: String,
    enum: ["INVOICE", "PAYMENT", "REVERSAL", "PURCHASE", "PAYROLL"],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  lines: {
    type: [journalLineSchema],
    validate: {
      validator: function(lines) {
        if (!lines || lines.length < 2) return false;
        // Verify double entry balances: sum of debits === sum of credits (with decimal safety)
        const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
        const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
        return Math.abs(totalDebit - totalCredit) < 0.01;
      },
      message: "Journal entry debits and credits must balance to 0."
    }
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

journalEntrySchema.index({ userId: 1, date: -1 });
journalEntrySchema.index({ userId: 1, referenceType: 1, referenceId: 1 });

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

export default JournalEntry;
