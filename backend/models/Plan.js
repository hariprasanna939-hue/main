import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Sandbox", "Express", "Professional", "Enterprise"
  allowedModules: [{ type: String, required: true }], // e.g. ["dashboard", "invoice", "inventory", ...]
  invoiceLimit: { type: Number, default: 0 },
  transactionLimit: { type: Number, default: 0 },
  seatLimit: { type: Number, default: 1 },
  aiLimit: { type: Number, default: 0 },
  ocrLimit: { type: Number, default: 0 },
  exportPermissions: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
