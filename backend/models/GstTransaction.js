import mongoose from "mongoose";

const gstTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  customerGSTIN: {
    type: String,
    default: "",
  },
  placeOfSupply: {
    type: String,
    required: true,
  },
  taxableAmount: {
    type: Number,
    required: true,
  },
  gstRate: {
    type: Number,
    required: true,
  },
  cgst: {
    type: Number,
    default: 0,
  },
  sgst: {
    type: Number,
    default: 0,
  },
  igst: {
    type: Number,
    default: 0,
  },
  totalGst: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

gstTransactionSchema.index({ userId: 1, invoiceDate: -1 });

const GstTransaction = mongoose.model("GstTransaction", gstTransactionSchema);

export default GstTransaction;
