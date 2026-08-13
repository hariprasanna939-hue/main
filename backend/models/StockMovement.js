import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InventoryItem",
    required: true,
  },
  referenceType: {
    type: String,
    enum: ["INVOICE", "PURCHASE", "SALE", "REVERSAL", "MANUAL"],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movementType: {
    type: String,
    enum: ["IN", "OUT"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  warehouseId: {
    type: String,
    default: "Main Warehouse",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

stockMovementSchema.index({ userId: 1, productId: 1 });
stockMovementSchema.index({ userId: 1, referenceType: 1, referenceId: 1 });

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);

export default StockMovement;
