import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import Plan from "./models/Plan.js";
import Subscription from "./models/Subscription.js";
import { authenticateUser, checkSubscription, checkModuleAccess } from "./utils/authMiddleware.js";
import { sendResetEmail } from "./utils/emailService.js";
import crypto from "crypto";

const planKeyToName = {
  trial: "Sandbox",
  monthly: "Express",
  annual: "Professional",
  lifetime: "Enterprise"
};

import payrollRoutes from "./routes/payrollRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";
import balanceSheetRoutes from "./routes/balanceSheetRoutes.js";
import profitLossRoutes from "./routes/profitLossRoutes.js";
import cashflowRoutes from "./routes/cashflowRoutes.js";
import financialRatiosRoutes from "./routes/financialRatiosRoutes.js";
import cashFlowStatementRoutes from "./routes/cashFlowStatementRoutes.js";
import civilRoutes from "./routes/civilRoutes.js";
import bookkeepingRoutes from "./routes/bookkeepingRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import bankReconciliationRoutes from "./routes/bankReconciliationRoutes.js";
import fraudDetectionRoutes from "./routes/fraudDetectionRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import invoiceSummaryRoutes from "./routes/invoiceSummaryRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import purchaseInvoiceRoutes from "./routes/purchaseInvoiceRoutes.js";
import scannedDocRoutes from "./routes/scannedDocRoutes.js";
import civilEngineeringRoutes from "./routes/civilEngineeringRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import invoiceTemplateRoutes from "./routes/invoiceTemplateRoutes.js";

dotenv.config();
const app = express();

// ✅ Razorpay Configuration
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️  Razorpay keys not configured. Payment features will not work.");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Middleware
// Increase payload limit for image/PDF uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration allowing local development and production origins
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'https://software.saaiss.in',
      'https://www.software.saaiss.in'
    ];
    const isLocalhost = origin.startsWith('http://localhost:') || 
                        origin.startsWith('http://127.0.0.1:') || 
                        origin === 'http://localhost' || 
                        origin === 'http://127.0.0.1';
    if (isLocalhost || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Security headers for production
if (process.env.DEV_MODE !== 'true') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}

// ✅ MongoDB Connection - Dynamic based on DEV_MODE with fallback
const isDevelopment = process.env.DEV_MODE === 'true';
let mongoUri = isDevelopment ? process.env.DEV_MONGO_URI : process.env.PRO_MONGO_URI;

console.log(`🔧 Environment: ${isDevelopment ? 'Development' : 'Production'}`);
console.log(`🔧 Primary MongoDB: ${isDevelopment ? 'Local Database' : 'Cloud Database'}`);

// Connect to MongoDB with fallback mechanism
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📍 Database: ${isDevelopment ? 'localhost:27017' : 'Cloud Atlas'}`);
  } catch (err) {
    console.error("❌ Primary MongoDB Connection Failed:", err.message);

    if (isDevelopment) {
      console.log("🔄 Falling back to Cloud Database...");
      try {
        await mongoose.connect(process.env.PRO_MONGO_URI);
        console.log("✅ MongoDB Connected Successfully (Fallback to Cloud)");
        console.log("📍 Database: Cloud Atlas (Fallback)");
      } catch (fallbackErr) {
        console.error("❌ Fallback MongoDB Connection Failed:", fallbackErr.message);
        console.error("💡 Please ensure MongoDB is running locally or check your internet connection");
        throw fallbackErr; // Throw error to prevent server from starting without DB
      }
    } else {
      console.error("❌ Production MongoDB Connection Failed");
      console.error("💡 Please check your cloud database configuration");
      throw err; // Throw error to prevent server from starting without DB
    }
  }
};

// Don't call it here - we'll call it before starting the server
// connectToMongoDB();

// ✅ User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ["admin", "instore"], default: "admin" },
  subscriptionStatus: { type: String, enum: ["pending", "active"], default: "pending" },
  subscriptionPlan: { type: String, enum: ["trial", "monthly", "annual", "lifetime"], default: "monthly" },
  subscriptionAmount: { type: Number },
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },
  trialEndDate: { type: Date },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String },
  createdAt: { type: Date, default: Date.now },
  sellerName: { type: String },
  sellerPhone: { type: String },
  sellerEmail: { type: String },
  sellerGSTIN: { type: String },
  sellerState: { type: String },
  sellerAddress: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const User = mongoose.model("User", userSchema);

// ✅ REGISTER (Sign Up)
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password, role = "admin" } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "User registered successfully", token, user: { role: newUser.role } });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists" });

    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ START FREE TRIAL
app.post("/api/signup-trial", async (req, res) => {
  try {
    const { email, password, name, role = "admin" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const subscriptionStartDate = new Date();
    const trialEndDate = new Date(subscriptionStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name: name || email.split("@")[0],
      password: hashedPassword,
      subscriptionStatus: "active",
      subscriptionPlan: "trial",
      subscriptionAmount: 0,
      subscriptionStartDate,
      subscriptionEndDate: trialEndDate,
      trialEndDate,
      role
    });

    await newUser.save();

    // Create Subscription record in database
    const sandboxPlan = await Plan.findOne({ name: "Sandbox" });
    if (sandboxPlan) {
      const subscription = new Subscription({
        userId: newUser._id,
        planId: sandboxPlan._id,
        status: "active",
        startDate: subscriptionStartDate,
        endDate: trialEndDate
      });
      await subscription.save();
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Free trial started successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        subscriptionStatus: newUser.subscriptionStatus,
        subscriptionPlan: newUser.subscriptionPlan,
        subscriptionAmount: newUser.subscriptionAmount,
        subscriptionStartDate: newUser.subscriptionStartDate,
        subscriptionEndDate: newUser.subscriptionEndDate,
        trialEndDate: newUser.trialEndDate,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.error("Trial Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ LOGIN (Sign In)
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password, role = "admin" } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role && user.role !== role) {
      return res.status(400).json({ message: `Access denied. Account is configured as ${user.role.toUpperCase()} role.` });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionAmount: user.subscriptionAmount,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        trialEndDate: user.trialEndDate,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ FORGOT PASSWORD
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });

    // Enforce generic response for security to avoid account enumeration
    const genericResponse = {
      success: true,
      message: "If an account exists for this email, a password reset link has been sent."
    };

    if (!user) {
      return res.json(genericResponse);
    }

    // Generate cryptographically secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token for storage
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token and expiry (30 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    // Use APP_URL from env or fallback to client localhost port
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    // Send email
    await sendResetEmail(user.email, resetUrl);

    res.json(genericResponse);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ RESET PASSWORD
app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }

    // Hash the incoming raw token to match the database hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired password reset token." });
    }

    // Hash new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ GET USER INFO (Protected Route)
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      email: user.email,
      name: user.name,
      id: user._id,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionAmount: user.subscriptionAmount,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      trialEndDate: user.trialEndDate,
      sellerName: user.sellerName || "",
      sellerPhone: user.sellerPhone || "",
      sellerEmail: user.sellerEmail || "",
      sellerGSTIN: user.sellerGSTIN || "",
      sellerState: user.sellerState || "",
      sellerAddress: user.sellerAddress || "",
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ UPDATE USER PROFILE (Protected Route)
app.put("/api/user", verifyToken, async (req, res) => {
  try {
    const { name, email, sellerName, sellerPhone, sellerEmail, sellerGSTIN, sellerState, sellerAddress } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const duplicateUser = await User.findOne({
      email: trimmedEmail,
      _id: { $ne: req.user.id },
    });

    if (duplicateUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name?.trim() || trimmedEmail.split("@")[0],
        email: trimmedEmail,
        sellerName,
        sellerPhone,
        sellerEmail,
        sellerGSTIN,
        sellerState,
        sellerAddress,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionAmount: user.subscriptionAmount,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        trialEndDate: user.trialEndDate,
        sellerName: user.sellerName || "",
        sellerPhone: user.sellerPhone || "",
        sellerEmail: user.sellerEmail || "",
        sellerGSTIN: user.sellerGSTIN || "",
        sellerState: user.sellerState || "",
        sellerAddress: user.sellerAddress || "",
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Subscription Plans Configuration (matching frontend)
const subscriptionPlans = {
  monthly: {
    id: "monthly",
    name: "Monthly Subscription",
    price: 1500,
    gst: 270,
    totalAmount: 1770,
    duration: "month"
  },
  annual: {
    id: "annual",
    name: "Annual Subscription",
    price: 16200,
    gst: 2916,
    totalAmount: 19116,
    duration: "year"
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime Access",
    price: 45000,
    gst: 8100,
    totalAmount: 53100,
    duration: "lifetime"
  }
};

// ✅ CREATE RAZORPAY ORDER
app.post("/api/create-order", async (req, res) => {
  try {
    const { email, plan = "monthly" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate plan
    if (!subscriptionPlans[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const selectedPlan = subscriptionPlans[plan];

    if (process.env.DEV_MODE === "true") {
      return res.json({
        orderId: `dev_order_${Date.now()}`,
        amount: selectedPlan.totalAmount * 100, // Convert to paise for consistency
        currency: "INR",
        key: "rzp_test_dev_mode",
        devMode: true,
        plan: plan,
        planDetails: selectedPlan
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_ID === "rzp_test_1234567890") {
      return res.status(500).json({
        message: "Payment system not configured. Please contact administrator."
      });
    }

    // Allow existing user if they are logged in and upgrading (checking authorization header)
    const token = req.headers.authorization?.split(" ")[1];
    let isUpgrade = false;
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        isUpgrade = true;
      } catch (err) {
        // Ignore token error and proceed with standard check
      }
    }

    if (!isUpgrade) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    // Razorpay expects amount in paise (smallest currency unit)
    const amountInPaise = selectedPlan.totalAmount * 100;

    console.log(`💰 Creating Razorpay order for ${plan} plan:`);
    console.log(`   Base Price: ₹${selectedPlan.price}`);
    console.log(`   GST: ₹${selectedPlan.gst}`);
    console.log(`   Total: ₹${selectedPlan.totalAmount}`);
    console.log(`   Amount in Paise: ${amountInPaise}`);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${plan}_${Date.now()}`,
      notes: {
        email: email,
        purpose: "subscription",
        plan: plan,
        planName: selectedPlan.name,
        basePrice: selectedPlan.price,
        gst: selectedPlan.gst,
        totalAmount: selectedPlan.totalAmount
      }
    };

    const order = await razorpay.orders.create(options);

    console.log(`✅ Razorpay order created: ${order.id} for ₹${order.amount / 100}`);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      plan: plan,
      planDetails: selectedPlan
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    if (error.statusCode === 401) {
      res.status(500).json({
        message: "Payment system authentication failed. Please contact administrator."
      });
    } else {
      res.status(500).json({
        message: "Failed to create payment order. Please try again."
      });
    }
  }
});

// ✅ VERIFY PAYMENT AND COMPLETE SIGNUP
app.post("/api/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      password,
      plan = "monthly",
      name,
      role = "admin"
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate plan
    if (!subscriptionPlans[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const selectedPlan = subscriptionPlans[plan];

    // Calculate subscription dates
    const subscriptionStartDate = new Date();
    let subscriptionEndDate = null;

    if (plan === "monthly") {
      subscriptionEndDate = new Date(subscriptionStartDate);
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    } else if (plan === "annual") {
      subscriptionEndDate = new Date(subscriptionStartDate);
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    }
    // Lifetime plan has no end date (null)

    if (process.env.DEV_MODE === "true" || razorpay_order_id?.startsWith("dev_order_")) {
      console.log("🔧 Development mode: Bypassing payment verification");

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionAmount: selectedPlan.totalAmount,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        razorpayPaymentId: "dev_payment_" + Date.now(),
        razorpayOrderId: razorpay_order_id || "dev_order_" + Date.now(),
        role
      });

      await newUser.save();

      // Create Subscription record in database
      const planName = planKeyToName[plan] || "Express";
      const planDoc = await Plan.findOne({ name: planName });
      if (planDoc) {
        const subscription = new Subscription({
          userId: newUser._id,
          planId: planDoc._id,
          status: "active",
          startDate: subscriptionStartDate,
          endDate: subscriptionEndDate
        });
        await subscription.save();
      }

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      return res.status(201).json({
        message: "Development mode: User registered successfully",
        token,
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionEndDate: subscriptionEndDate,
        role: newUser.role
      });
    }

    if (!razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({ message: "Payment details are required" });
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      subscriptionStatus: "active",
      subscriptionPlan: plan,
      subscriptionAmount: selectedPlan.totalAmount,
      subscriptionStartDate: subscriptionStartDate,
      subscriptionEndDate: subscriptionEndDate,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      role
    });

    await newUser.save();

    // Create Subscription record in database
    const planName = planKeyToName[plan] || "Express";
    const planDoc = await Plan.findOne({ name: planName });
    if (planDoc) {
      const subscription = new Subscription({
        userId: newUser._id,
        planId: planDoc._id,
        status: "active",
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate
      });
      await subscription.save();
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Payment verified and user registered successfully",
      token,
      subscriptionStatus: "active",
      subscriptionPlan: plan,
      subscriptionEndDate: subscriptionEndDate,
      role: newUser.role
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// ✅ UPGRADE SUBSCRIPTION FOR LOGGED-IN USERS
app.post("/api/upgrade-subscription", authenticateUser, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = "monthly"
    } = req.body;

    // Validate plan
    if (!subscriptionPlans[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const selectedPlan = subscriptionPlans[plan];

    // Calculate subscription dates
    const subscriptionStartDate = new Date();
    let subscriptionEndDate = null;

    if (plan === "monthly") {
      subscriptionEndDate = new Date(subscriptionStartDate);
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    } else if (plan === "annual") {
      subscriptionEndDate = new Date(subscriptionStartDate);
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    }
    // Lifetime plan has no end date (null)

    // Verify payment
    if (process.env.DEV_MODE === "true" || razorpay_order_id?.startsWith("dev_order_")) {
      console.log("🔧 Development mode: Bypassing payment verification for upgrade");
    } else {
      if (!razorpay_payment_id || !razorpay_order_id) {
        return res.status(400).json({ message: "Payment details are required" });
      }

      const crypto = await import('crypto');
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    }

    // Find database Plan
    const planName = planKeyToName[plan] || "Express";
    const planDoc = await Plan.findOne({ name: planName });
    if (!planDoc) {
      return res.status(500).json({ message: "Subscription plan not found in database configuration." });
    }

    // Update user subscription plan details
    const User = mongoose.model("User");
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionAmount: selectedPlan.totalAmount,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        razorpayPaymentId: razorpay_payment_id || "dev_payment_" + Date.now(),
        razorpayOrderId: razorpay_order_id || "dev_order_" + Date.now()
      },
      { new: true }
    ).select("-password");

    // Set any currently active subscriptions to expired
    await Subscription.updateMany(
      { userId: req.user._id, status: "active" },
      { status: "expired" }
    );

    // Create new active subscription
    const newSubscription = new Subscription({
      userId: req.user._id,
      planId: planDoc._id,
      status: "active",
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate
    });
    await newSubscription.save();

    res.json({
      message: "Subscription upgraded successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionPlan: updatedUser.subscriptionPlan,
        subscriptionAmount: updatedUser.subscriptionAmount,
        subscriptionStartDate: updatedUser.subscriptionStartDate,
        subscriptionEndDate: updatedUser.subscriptionEndDate,
        trialEndDate: updatedUser.trialEndDate
      }
    });

  } catch (error) {
    console.error("Upgrade Subscription Error:", error);
    res.status(500).json({ message: "Subscription upgrade failed" });
  }
});

// ✅ Use Routes
app.use("/api/payroll", authenticateUser, checkSubscription, checkModuleAccess("payroll"), payrollRoutes);
app.use("/api/tax", authenticateUser, checkSubscription, checkModuleAccess("tax-gst"), taxRoutes);
app.use("/api/balance", authenticateUser, checkSubscription, checkModuleAccess("balance-sheet"), balanceSheetRoutes);
app.use("/api/profitloss", authenticateUser, checkSubscription, checkModuleAccess("profit-loss"), profitLossRoutes);
app.use("/api/cashflow", authenticateUser, checkSubscription, checkModuleAccess("cashflow"), cashflowRoutes);
app.use("/api/financial-ratios", authenticateUser, checkSubscription, checkModuleAccess("financial-ratios"), financialRatiosRoutes);
app.use("/api/cashflow-statement", authenticateUser, checkSubscription, checkModuleAccess("cashflow-statement"), cashFlowStatementRoutes);
app.use("/api/civil", authenticateUser, checkSubscription, checkModuleAccess("civil-engineering"), civilRoutes);
app.use("/api/bookkeeping", authenticateUser, checkSubscription, checkModuleAccess("bookkeeping"), bookkeepingRoutes);
app.use("/api/inventory", authenticateUser, checkSubscription, checkModuleAccess("inventory"), inventoryRoutes);
app.use("/api/bank-reconciliation", authenticateUser, checkSubscription, checkModuleAccess("bank-reconciliation"), bankReconciliationRoutes);
app.use("/api/fraud-detection", authenticateUser, checkSubscription, checkModuleAccess("fraud-detection"), fraudDetectionRoutes);
app.use("/api/invoice", authenticateUser, checkSubscription, checkModuleAccess("invoice"), invoiceRoutes);
app.use("/api/invoice-summary", authenticateUser, checkSubscription, checkModuleAccess("invoice"), invoiceSummaryRoutes);
app.use("/api/ai", authenticateUser, checkSubscription, aiRoutes);
app.use("/api/purchase-invoice", authenticateUser, checkSubscription, checkModuleAccess("invoice"), purchaseInvoiceRoutes);
app.use("/api/scanned-docs", authenticateUser, checkSubscription, checkModuleAccess("invoice"), scannedDocRoutes);
app.use("/api/civil-engineering", authenticateUser, checkSubscription, checkModuleAccess("civil-engineering"), civilEngineeringRoutes);
app.use("/api/customers", authenticateUser, checkSubscription, checkModuleAccess("invoice"), customerRoutes);
app.use("/api/invoice-templates", authenticateUser, checkSubscription, checkModuleAccess("invoice"), invoiceTemplateRoutes);

const seedPlans = async () => {
  const plans = [
    { name: "Sandbox", allowedModules: ["dashboard", "invoice", "inventory", "bookkeeping"] },
    { name: "Express", allowedModules: ["dashboard", "invoice", "inventory"] },
    { name: "Professional", allowedModules: ["dashboard", "invoice", "inventory", "bookkeeping", "tax-gst", "balance-sheet", "profit-loss", "cashflow", "cashflow-statement", "financial-ratios"] },
    { name: "Enterprise", allowedModules: ["dashboard", "invoice", "inventory", "bookkeeping", "tax-gst", "balance-sheet", "profit-loss", "cashflow", "cashflow-statement", "financial-ratios", "payroll", "bank-reconciliation", "fraud-detection", "civil-engineering"] }
  ];

  try {
    for (const p of plans) {
      await Plan.findOneAndUpdate(
        { name: p.name },
        { allowedModules: p.allowedModules },
        { upsert: true, new: true }
      );
    }
    console.log("✅ Subscription Plans Seeded Successfully");
  } catch (err) {
    console.error("❌ Failed to seed subscription plans:", err.message);
  }
};

// ✅ Start Server (after MongoDB connection)
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectToMongoDB();

    // Seed subscription plans
    await seedPlans();

    // Then start the server
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`🌐 Local access: http://localhost:${PORT}`);
      console.log(`📡 Network access: http://192.168.29.49:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
