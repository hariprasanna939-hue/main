import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  status: { type: String, enum: ["active", "expired", "pending"], default: "pending" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }, // Note: null/undefined for lifetime
  pendingDowngradePlanId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String }
}, {
  timestamps: true
});

// Index to quickly find user subscriptions
subscriptionSchema.index({ userId: 1, status: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
