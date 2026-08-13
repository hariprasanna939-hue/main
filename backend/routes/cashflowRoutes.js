import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ CashFlow Entry Schema
const cashflowEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: String, required: true },
  month: { type: String, required: true },
  cashInflow: { type: Number, required: true },
  cashOutflow: { type: Number, required: true },
  netCashFlow: { type: Number, required: true },
  time: { type: Number, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ Add index for better query performance
cashflowEntrySchema.index({ userId: 1, year: 1, month: 1 });

const CashFlowEntry = mongoose.model("CashFlowEntry", cashflowEntrySchema);

// ✅ Middleware to verify JWT token (same as server.js)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret_2024_finance_app";
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ POST route to store cash flow entry (Protected) - Updated for multiple entries
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { year, month, cashInflow, cashOutflow, description, category } = req.body;
    
    // Validation
    if (!year || !month || cashInflow === undefined || cashOutflow === undefined) {
      return res.status(400).json({ message: "Year, month, cash inflow, and cash outflow are required" });
    }

    // Parse arrays for multiple entries
    const monthArray = Array.isArray(month) ? month : month.split(',').map(m => m.trim());
    const inflowArray = Array.isArray(cashInflow) ? cashInflow : cashInflow.split(',').map(val => parseFloat(val.trim()) || 0);
    const outflowArray = Array.isArray(cashOutflow) ? cashOutflow : cashOutflow.split(',').map(val => parseFloat(val.trim()) || 0);
    const descriptionArray = Array.isArray(description) ? description : [description || ""];
    const categoryArray = Array.isArray(category) ? category : [category || "General"];

    // Validate array lengths
    if (monthArray.length !== inflowArray.length || monthArray.length !== outflowArray.length) {
      return res.status(400).json({ message: "Number of months, cash inflows, and cash outflows must match" });
    }

    // Get the last time index for this user
    const lastEntry = await CashFlowEntry.findOne({ userId: req.user.id }).sort({ time: -1 });
    let nextTime = lastEntry ? lastEntry.time + 1 : 0;

    // Create multiple entries
    const newEntries = [];
    for (let i = 0; i < monthArray.length; i++) {
      const netCashFlow = parseFloat(inflowArray[i]) - parseFloat(outflowArray[i]);
      
      const newCashFlow = new CashFlowEntry({
        userId: req.user.id,
        year,
        month: monthArray[i],
        cashInflow: parseFloat(inflowArray[i]),
        cashOutflow: parseFloat(outflowArray[i]),
        netCashFlow,
        time: nextTime + i,
        description: descriptionArray[i] || "",
        category: categoryArray[i] || "General"
      });
      
      newEntries.push(newCashFlow);
    }

    // Save all entries
    await CashFlowEntry.insertMany(newEntries);

    res.status(201).json({ 
      message: `${newEntries.length} cash flow entries saved successfully!`,
      data: newEntries 
    });
  } catch (error) {
    console.error("Error saving cash flow entry:", error);
    res.status(500).json({ 
      message: "Error saving cash flow entry", 
      error: error.message 
    });
  }
});

// ✅ POST route to add multiple cash flow entries at once (Protected)
router.post("/add-bulk", verifyToken, async (req, res) => {
  try {
    const { entries } = req.body; // Array of entry objects
    
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: "Entries array is required" });
    }

    // Get the last time index for this user
    const lastEntry = await CashFlowEntry.findOne({ userId: req.user.id }).sort({ time: -1 });
    let nextTime = lastEntry ? lastEntry.time + 1 : 0;

    // Prepare entries with calculated fields
    const newEntries = entries.map((entry, index) => {
      const netCashFlow = parseFloat(entry.cashInflow) - parseFloat(entry.cashOutflow);
      
      return {
        userId: req.user.id,
        year: entry.year,
        month: entry.month,
        cashInflow: parseFloat(entry.cashInflow),
        cashOutflow: parseFloat(entry.cashOutflow),
        netCashFlow,
        time: nextTime + index,
        description: entry.description || "",
        category: entry.category || "General",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Save all entries
    await CashFlowEntry.insertMany(newEntries);

    res.status(201).json({ 
      message: `${newEntries.length} cash flow entries saved successfully!`,
      data: newEntries 
    });
  } catch (error) {
    console.error("Error saving bulk cash flow entries:", error);
    res.status(500).json({ 
      message: "Error saving bulk cash flow entries", 
      error: error.message 
    });
  }
});

// ✅ GET route to fetch all cash flow entries for logged-in user (Protected)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const cashflows = await CashFlowEntry.find({ userId: req.user.id }).sort({ time: 1 });
    res.json(cashflows);
  } catch (error) {
    console.error("Error fetching cash flow data:", error);
    res.status(500).json({ 
      message: "Error fetching cash flow data",
      error: error.message 
    });
  }
});

// ✅ GET route to fetch entries for a specific year (Protected)
router.get("/year/:year", verifyToken, async (req, res) => {
  try {
    const { year } = req.params;
    const cashflows = await CashFlowEntry.find({ 
      userId: req.user.id, 
      year 
    }).sort({ time: 1 });
    
    res.json(cashflows);
  } catch (error) {
    console.error("Error fetching cash flow data for year:", error);
    res.status(500).json({ 
      message: "Error fetching cash flow data",
      error: error.message 
    });
  }
});

// ✅ GET route to fetch cash flow summary (Protected)
router.get("/summary", verifyToken, async (req, res) => {
  try {
    const summary = await CashFlowEntry.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$year",
          totalInflow: { $sum: "$cashInflow" },
          totalOutflow: { $sum: "$cashOutflow" },
          totalNetFlow: { $sum: "$netCashFlow" },
          entryCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(summary);
  } catch (error) {
    console.error("Error fetching cash flow summary:", error);
    res.status(500).json({ 
      message: "Error fetching cash flow summary",
      error: error.message 
    });
  }
});

// ✅ PUT route to update a cash flow entry (Protected)
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, cashInflow, cashOutflow, description, category } = req.body;

    // Find the entry and verify ownership
    const existingEntry = await CashFlowEntry.findOne({ _id: id, userId: req.user.id });
    if (!existingEntry) {
      return res.status(404).json({ message: "Cash flow entry not found" });
    }

    // Calculate new net cash flow
    const netCashFlow = parseFloat(cashInflow) - parseFloat(cashOutflow);

    // Update the entry
    const updatedEntry = await CashFlowEntry.findByIdAndUpdate(
      id,
      {
        year,
        month,
        cashInflow: parseFloat(cashInflow),
        cashOutflow: parseFloat(cashOutflow),
        netCashFlow,
        description: description || existingEntry.description,
        category: category || existingEntry.category,
        updatedAt: new Date()
      },
      { new: true } // Return updated document
    );

    res.json({ 
      message: "Cash flow entry updated successfully!", 
      data: updatedEntry 
    });
  } catch (error) {
    console.error("Error updating cash flow entry:", error);
    res.status(500).json({ 
      message: "Error updating cash flow entry",
      error: error.message 
    });
  }
});

// ✅ DELETE route to remove a cash flow entry (Protected)
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership before deleting
    const deletedEntry = await CashFlowEntry.findOneAndDelete({ 
      _id: id, 
      userId: req.user.id 
    });
    
    if (!deletedEntry) {
      return res.status(404).json({ message: "Cash flow entry not found" });
    }

    res.json({ message: "Cash flow entry deleted successfully!" });
  } catch (error) {
    console.error("Error deleting cash flow entry:", error);
    res.status(500).json({ 
      message: "Error deleting cash flow entry",
      error: error.message 
    });
  }
});

// ✅ GET route for dynamic Cash Flow Prediction based on real historical transactions & manual entries
router.get("/predict", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch manual entries
    const manualEntries = await CashFlowEntry.find({ userId: userObjectId }).sort({ time: 1 });

    // 2. Fetch live data metrics across historical months (past 6 months)
    const now = new Date();
    const monthlyPoints = [];

    // Combine manual entries if available
    if (manualEntries.length >= 2) {
      manualEntries.forEach(entry => {
        monthlyPoints.push({
          label: `${entry.month} ${entry.year}`,
          inflow: entry.cashInflow,
          outflow: entry.cashOutflow,
          net: entry.netCashFlow,
          time: entry.time
        });
      });
    } else {
      // Build monthly points from live Bookkeeping, Invoices, PurchaseInvoices, and Sales collections
      const BookkeepingEntry = mongoose.model("BookkeepingEntry");
      const Sale = mongoose.model("Sale");
      let Invoice = null, PurchaseInvoice = null;
      try { Invoice = mongoose.model("Invoice"); } catch(e) {}
      try { PurchaseInvoice = mongoose.model("PurchaseInvoice"); } catch(e) {}

      for (let i = 5; i >= 0; i--) {
        const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const monthLabel = mStart.toLocaleDateString("en-US", { month: "short", year: "numeric" });

        let monthInflow = 0;
        let monthOutflow = 0;

        // Bookkeeping
        if (BookkeepingEntry) {
          const bkEntries = await BookkeepingEntry.find({
            userId: userObjectId,
            date: { $gte: mStart, $lte: mEnd },
            isAutomated: { $ne: true }
          });
          monthInflow += bkEntries.filter(e => e.type === "income" || e.type === "Income").reduce((sum, e) => sum + (e.amount || 0), 0);
          monthOutflow += bkEntries.filter(e => e.type === "expense" || e.type === "Expense").reduce((sum, e) => sum + (e.amount || 0), 0);
        }

        // Invoices (paid)
        if (Invoice) {
          const invs = await Invoice.find({
            $or: [{ userId: userObjectId }, { createdBy: userId }],
            isDeleted: false,
            invoiceDate: { $gte: mStart, $lte: mEnd }
          });
          monthInflow += invs.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
        }

        // Purchase Invoices (paid)
        if (PurchaseInvoice) {
          const pinvs = await PurchaseInvoice.find({
            userId: userObjectId,
            createdAt: { $gte: mStart, $lte: mEnd }
          });
          monthOutflow += pinvs.reduce((sum, inv) => sum + (inv.paid || 0), 0);
        }

        // Sales
        if (Sale) {
          const sales = await Sale.find({
            userId: userObjectId,
            saleDate: { $gte: mStart, $lte: mEnd }
          });
          monthInflow += sales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
        }

        if (monthInflow > 0 || monthOutflow > 0) {
          monthlyPoints.push({
            label: monthLabel,
            inflow: monthInflow,
            outflow: monthOutflow,
            net: monthInflow - monthOutflow,
            time: 5 - i
          });
        }
      }
    }

    if (monthlyPoints.length < 1) {
      return res.json({
        hasEnoughData: false,
        message: "Not enough historical data for reliable prediction",
        predictions: []
      });
    }

    const n = monthlyPoints.length;
    let slopeInflow = 0, interceptInflow = 0;
    let slopeOutflow = 0, interceptOutflow = 0;

    if (n === 1) {
      // Single month baseline: use current month's inflow and outflow as baseline forecast
      interceptInflow = monthlyPoints[0].inflow;
      interceptOutflow = monthlyPoints[0].outflow;
    } else {
      // Multi-month trend: Perform Linear Regression over historical monthly points
      const sumX = monthlyPoints.reduce((sum, p) => sum + p.time, 0);
      const sumYInflow = monthlyPoints.reduce((sum, p) => sum + p.inflow, 0);
      const sumYOutflow = monthlyPoints.reduce((sum, p) => sum + p.outflow, 0);
      const sumXYInflow = monthlyPoints.reduce((sum, p) => sum + p.time * p.inflow, 0);
      const sumXYOutflow = monthlyPoints.reduce((sum, p) => sum + p.time * p.outflow, 0);
      const sumXX = monthlyPoints.reduce((sum, p) => sum + p.time * p.time, 0);

      const denom = (n * sumXX - sumX * sumX) || 1;

      slopeInflow = (n * sumXYInflow - sumX * sumYInflow) / denom;
      interceptInflow = (sumYInflow - slopeInflow * sumX) / n;

      slopeOutflow = (n * sumXYOutflow - sumX * sumYOutflow) / denom;
      interceptOutflow = (sumYOutflow - slopeOutflow * sumX) / n;
    }

    const futurePredictions = [];
    const lastTime = monthlyPoints[monthlyPoints.length - 1].time;

    for (let i = 1; i <= 6; i++) {
      const futureTime = lastTime + i;
      const predictedInflow = Math.max(0, Math.round(slopeInflow * futureTime + interceptInflow));
      const predictedOutflow = Math.max(0, Math.round(slopeOutflow * futureTime + interceptOutflow));
      const predictedNet = predictedInflow - predictedOutflow;

      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = futureDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      futurePredictions.push({
        month: `Month +${i} (${monthName})`,
        predictedInflow,
        predictedOutflow,
        predictedNet,
        time: futureTime
      });
    }

    res.json({
      hasEnoughData: true,
      method: "Linear Regression over historical transaction data",
      historicalPoints: monthlyPoints,
      predictions: futurePredictions,
      nextMonth: futurePredictions[0],
      next3Months: futurePredictions.slice(0, 3),
      next6Months: futurePredictions
    });
  } catch (error) {
    console.error("Error in cashflow prediction:", error);
    res.status(500).json({ message: "Error generating cashflow prediction", error: error.message });
  }
});

export default router;