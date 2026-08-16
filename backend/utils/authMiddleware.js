import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";

// Helper to map plan keys from user document to plan names in db
const planKeyToName = {
  trial: "Sandbox",
  monthly: "Express",
  annual: "Professional",
  lifetime: "Enterprise"
};

// 1. Authenticate user from JWT token
export const authenticateUser = async (req, res, next) => {
  // Public paths bypass auth
  if (req.path.startsWith("/public/")) {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = mongoose.model("User");
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found or account deleted." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid authorization token." });
  }
};

// 2. Validate user subscription status and date validity
export const checkSubscription = async (req, res, next) => {
  // Public paths bypass subscription check
  if (req.path.startsWith("/public/")) {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    // Find active subscription
    let subscription = await Subscription.findOne({ 
      userId: req.user._id, 
      status: "active" 
    }).populate("planId");

    // If no active subscription is found, check if user has a legacy plan key to migrate
    if (!subscription && req.user.subscriptionPlan) {
      console.log(`🔄 Migrating legacy user ${req.user.email} with plan key: ${req.user.subscriptionPlan}`);
      
      const planName = planKeyToName[req.user.subscriptionPlan] || "Express";
      const plan = await Plan.findOne({ name: planName });
      
      if (plan) {
        // Calculate end date based on user trial/subscription end date
        const endDate = req.user.subscriptionEndDate || req.user.trialEndDate;
        
        subscription = new Subscription({
          userId: req.user._id,
          planId: plan._id,
          status: "active",
          startDate: req.user.subscriptionStartDate || new Date(),
          endDate: endDate
        });
        
        await subscription.save();
        subscription = await subscription.populate("planId");
        
        // Update user status
        const User = mongoose.model("User");
        await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "active" });
      }
    }

    if (!subscription) {
      return res.status(403).json({ message: "No active subscription found. Please purchase a plan." });
    }

    // Check if subscription has expired
    if (subscription.endDate && new Date(subscription.endDate).getTime() < Date.now()) {
      // Update subscription to expired
      subscription.status = "expired";
      await subscription.save();

      // Update user status
      const User = mongoose.model("User");
      await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "pending" }); // Reset status to pending

      return res.status(403).json({ message: "Subscription has expired. Please upgrade or renew." });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    return res.status(500).json({ message: "Internal server error during subscription check." });
  }
};

// 3. Factory middleware to check permissions for a specific module
export const checkModuleAccess = (moduleName) => {
  return (req, res, next) => {
    // Public paths bypass module check
    if (req.path.startsWith("/public/")) {
      return next();
    }

    if (!req.subscription || !req.subscription.planId) {
      return res.status(403).json({ message: "Subscription validation failed." });
    }

    // Dashboard is always accessible if authenticated and subscription check passes
    if (moduleName === "dashboard") {
      return next();
    }

    // In-store POS accounts are hard-restricted to invoice, inventory, and dashboard
    if (req.user?.role === "instore") {
      if (!["invoice", "inventory"].includes(moduleName)) {
        return res.status(403).json({ message: "In-Store accounts only have access to Invoice and Inventory modules." });
      }
    }

    const allowedModules = req.subscription.planId.allowedModules || [];
    if (!allowedModules.includes(moduleName)) {
      return res.status(403).json({ 
        message: "Module not included in current subscription", 
        requiredModule: moduleName 
      });
    }

    next();
  };
};
