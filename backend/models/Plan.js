import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Sandbox", "Express", "Professional", "Enterprise"
  allowedModules: [{ type: String, required: true }] // e.g. ["dashboard", "invoice", "inventory", ...]
}, {
  timestamps: true
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
