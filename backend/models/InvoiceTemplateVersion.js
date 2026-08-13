import mongoose from "mongoose";

const invoiceTemplateVersionSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InvoiceTemplate",
    required: true,
    index: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for fast lookup of specific versions
invoiceTemplateVersionSchema.index({ templateId: 1, versionNumber: 1 }, { unique: true });

const InvoiceTemplateVersion = mongoose.model("InvoiceTemplateVersion", invoiceTemplateVersionSchema);
export default InvoiceTemplateVersion;
