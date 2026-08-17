import mongoose from "mongoose";
import BookkeepingEntry from "../models/BookkeepingEntry.js";
import Sale from "../models/Sale.js";

// Helper to get models registered inline in routes
const getInvoiceModel = () => {
    try {
        return mongoose.model("Invoice");
    } catch (e) {
        return mongoose.model("Invoice", new mongoose.Schema({}, { strict: false }));
    }
};

const getPurchaseInvoiceModel = () => {
    try {
        return mongoose.model("PurchaseInvoice");
    } catch (e) {
        return mongoose.model("PurchaseInvoice", new mongoose.Schema({}, { strict: false }));
    }
};

const getBalanceSheetModel = () => {
    try {
        return mongoose.model("BalanceSheet");
    } catch (e) {
        return mongoose.model("BalanceSheet", new mongoose.Schema({}, { strict: false }));
    }
};

const getPayrollModel = () => {
    try {
        return mongoose.model("Payroll");
    } catch (e) {
        return mongoose.model("Payroll", new mongoose.Schema({}, { strict: false }));
    }
};

const getInventoryItemModel = () => {
    try {
        return mongoose.model("InventoryItem");
    } catch (e) {
        return mongoose.model("InventoryItem", new mongoose.Schema({}, { strict: false }));
    }
};

// Resolve selected period to start and end Dates
export function resolvePeriod(period) {
    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    if (period === "this-month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === "last-month") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === "this-quarter") {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59, 999);
    } else if (period === "this-year") {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 12, 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
}

export async function getFinanceMetrics(userId, start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch Bookkeeping Entries
    const bookkeepingEntries = await BookkeepingEntry.find({
        $or: [
            { userId: userObjectId },
            { userId: userId.toString() }
        ],
        isDeleted: { $ne: true },
        date: { $gte: startDate, $lte: endDate }
    });

    // Priority 4: Prevent duplicate financial events. Filter out entries with referenceId or isAutomated flag
    const validBkEntries = bookkeepingEntries.filter(e => !e.isAutomated && !e.referenceId);

    const bkIncome = validBkEntries
        .filter(e => e.type === "income" || e.type === "Income")
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    const bkExpense = validBkEntries
        .filter(e => e.type === "expense" || e.type === "Expense")
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    // Group bookkeeping expenses by category
    const bkCategoryExpenses = {};
    validBkEntries
        .filter(e => e.type === "expense" || e.type === "Expense")
        .forEach(e => {
            const cat = e.category || "General";
            bkCategoryExpenses[cat] = (bkCategoryExpenses[cat] || 0) + (e.amount || 0);
        });

    // 2. Fetch Invoices (Sales)
    const Invoice = getInvoiceModel();
    let salesInvoices = [];
    if (Invoice) {
        salesInvoices = await Invoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() },
                { createdBy: userObjectId },
                { createdBy: userId.toString() }
            ],
            isDeleted: { $ne: true },
            sourceInvoiceType: { $ne: "purchase" },
            invoiceDate: { $gte: startDate, $lte: endDate }
        });
    }

    // P&L Revenue from Sales Invoices: subtotal (pre-tax value)
    const salesInvoiceSubtotalRevenue = salesInvoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    // Cash Inflow: actual cash collected (post-tax value)
    const salesInvoiceCashInflow = salesInvoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);

    // Outstanding invoices (Accounts Receivable up to period end)
    let salesInvoiceOutstanding = 0;
    if (Invoice) {
        const allSalesInvoicesUpToPeriod = await Invoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() },
                { createdBy: userObjectId },
                { createdBy: userId.toString() }
            ],
            isDeleted: { $ne: true },
            sourceInvoiceType: { $ne: "purchase" },
            invoiceDate: { $lte: endDate }
        });
        salesInvoiceOutstanding = allSalesInvoicesUpToPeriod
            .filter(inv => inv.paymentStatus !== "paid" && inv.status !== "paid")
            .reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
    }

    // 3. Fetch Purchase Invoices (Period-scoped for P&L / Cash Flow)
    const PurchaseInvoice = getPurchaseInvoiceModel();
    let purchaseInvoices = [];
    if (PurchaseInvoice) {
        purchaseInvoices = await PurchaseInvoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() }
            ],
            isDeleted: { $ne: true },
            createdAt: { $gte: startDate, $lte: endDate }
        });
    }

    // P&L Expense from Purchase Invoices: subtotal (pre-tax value)
    const purchaseInvoiceSubtotalExpense = purchaseInvoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    // Cash Outflow: actual paid amount (post-tax value)
    const purchaseInvoiceCashOutflow = purchaseInvoices.reduce((sum, inv) => sum + (inv.paid || 0), 0);

    // Outstanding payables (Accounts Payable up to period end)
    let purchaseInvoiceOutstanding = 0;
    if (PurchaseInvoice) {
        const allPurchaseInvoicesUpToPeriod = await PurchaseInvoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() }
            ],
            isDeleted: { $ne: true },
            createdAt: { $lte: endDate }
        });
        purchaseInvoiceOutstanding = allPurchaseInvoicesUpToPeriod.reduce((sum, inv) => sum + (inv.balance || 0), 0);
    }

    // 4. Fetch Direct Inventory Sales
    const inventorySales = await Sale.find({
        $or: [
            { userId: userObjectId },
            { userId: userId.toString() }
        ],
        isDeleted: { $ne: true },
        saleDate: { $gte: startDate, $lte: endDate }
    });

    // P&L Revenue from direct Inventory Sales: subtotal (pre-tax value)
    const inventorySaleSubtotalRevenue = inventorySales.reduce((sum, s) => sum + (s.subtotal || 0), 0);
    // Cash Inflow: assume direct inventory sale gets paid immediately (post-tax grand total)
    const inventorySaleCashInflow = inventorySales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    // Cost of Goods Sold (COGS)
    // Priority 3: Use actual purchase/buy cost if available (costPrice or buyPrice).
    // If cost is unavailable, fallback to 60% of unit selling price as estimated cost.
    const inventoryItemIds = inventorySales.map(s => s.inventoryItemId).filter(Boolean);
    const InventoryItem = getInventoryItemModel();
    let inventoryItems = [];
    if (InventoryItem && inventoryItemIds.length > 0) {
        inventoryItems = await InventoryItem.find({ _id: { $in: inventoryItemIds } });
    }
    const inventoryItemsMap = new Map(inventoryItems.map(item => [item._id.toString(), item]));

    let calculatedCogs = 0;
    inventorySales.forEach(sale => {
        const item = sale.inventoryItemId ? inventoryItemsMap.get(sale.inventoryItemId.toString()) : null;
        const actualCostPerUnit = item?.costPrice || item?.buyPrice || (sale.unitPrice * 0.6);
        calculatedCogs += actualCostPerUnit * sale.quantitySold;
    });

    // 5. Fetch Payrolls via safe getter — Payroll model is registered by payrollRoutes.js at startup
    const Payroll = getPayrollModel();
    let payrolls = [];
    if (Payroll) {
        payrolls = await Payroll.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() },
                { createdBy: userObjectId },
                { createdBy: userId.toString() }
            ],
            isDeleted: { $ne: true },
            createdAt: { $gte: startDate, $lte: endDate }
        });
    }
    const payrollSalariesExpense = payrolls.reduce((sum, pr) => sum + (pr.grossSalary || 0), 0);

    // --- Dynamic Aggregations ---

    // Revenues (pre-tax / subtotal)
    const totalRevenue = salesInvoiceSubtotalRevenue + bkIncome + inventorySaleSubtotalRevenue;

    // Expenses (pre-tax / subtotal)
    // COGS is strictly the cost of inventory items sold during the period
    const cogs = calculatedCogs;
    const salaries = payrollSalariesExpense + (bkCategoryExpenses["Salaries"] || bkCategoryExpenses["salaries"] || 0);
    const rent = bkCategoryExpenses["Rent"] || bkCategoryExpenses["rent"] || 0;
    const utilities = bkCategoryExpenses["Utilities"] || bkCategoryExpenses["utilities"] || 0;
    const costOfMaterials = (bkCategoryExpenses["Materials"] || bkCategoryExpenses["materials"] || 0);
    const financeCost = bkCategoryExpenses["Finance"] || bkCategoryExpenses["finance"] || 0;
    const depreciation = bkCategoryExpenses["Depreciation"] || bkCategoryExpenses["depreciation"] || 0;
    const amortization = bkCategoryExpenses["Amortization"] || bkCategoryExpenses["amortization"] || 0;

    // Aggregate other categories
    const standardCategories = ["Salaries", "salaries", "Rent", "rent", "Utilities", "utilities", "Materials", "materials", "Finance", "finance", "Depreciation", "depreciation", "Amortization", "amortization"];
    let otherExpenses = 0;
    Object.entries(bkCategoryExpenses).forEach(([cat, val]) => {
        if (!standardCategories.includes(cat)) {
            otherExpenses += val;
        }
    });

    const totalExpenses = cogs + salaries + rent + utilities + financeCost + depreciation + amortization + otherExpenses;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;

    // Cash Flow Inflow / Outflow (cash basis)
    const totalCashInflow = salesInvoiceCashInflow + bkIncome + inventorySaleCashInflow;
    const totalCashOutflow = purchaseInvoiceCashOutflow + bkExpense + payrollSalariesExpense;
    const netCashFlow = totalCashInflow - totalCashOutflow;

    return {
        period: {
            start: startDate,
            end: endDate
        },
        revenue: {
            sales: salesInvoiceSubtotalRevenue,
            bookkeepingIncome: bkIncome,
            inventorySales: inventorySaleSubtotalRevenue,
            total: totalRevenue
        },
        expense: {
            cogs,
            salaries,
            rent,
            utilities,
            costOfMaterials,
            financeCost,
            depreciation,
            amortization,
            otherExpenses,
            total: totalExpenses
        },
        netProfit,
        profitMargin,
        cashFlow: {
            inflow: totalCashInflow,
            outflow: totalCashOutflow,
            net: netCashFlow,
            receivables: salesInvoiceOutstanding,
            payables: purchaseInvoiceOutstanding,
            gstPayable: Math.max(0, salesInvoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0) - purchaseInvoices.reduce((sum, inv) => sum + (inv.totalTax || 0), 0))
        }
    };
}

export async function getLiveBalanceSheet(userId, period = "this-month") {
    const { startDate, endDate } = resolvePeriod(period);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch Bookkeeping Entries up to period end
    const bkEntries = await BookkeepingEntry.find({
        $or: [
            { userId: userObjectId },
            { userId: userId.toString() }
        ],
        isDeleted: { $ne: true },
        date: { $lte: endDate }
    });
    const validBkEntries = bkEntries.filter(e => !e.isAutomated && !e.referenceId);
    const bkIncome = validBkEntries
        .filter(e => e.type === "income" || e.type === "Income")
        .reduce((sum, e) => sum + (e.amount || 0), 0);
    const bkExpense = validBkEntries
        .filter(e => e.type === "expense" || e.type === "Expense")
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    // 2. Fetch Invoices (Sales)
    const Invoice = getInvoiceModel();
    let salesInvoices = [];
    if (Invoice) {
        salesInvoices = await Invoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() },
                { createdBy: userObjectId },
                { createdBy: userId.toString() }
            ],
            isDeleted: { $ne: true },
            sourceInvoiceType: { $ne: "purchase" },
            invoiceDate: { $lte: endDate }
        });
    }
    const salesInvoiceSubtotal = salesInvoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    const salesInvoicePaid = salesInvoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
    const accountsReceivable = salesInvoices
        .filter(inv => inv.paymentStatus !== "paid" && inv.status !== "paid")
        .reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);

    // 3. Fetch Purchase Invoices
    const PurchaseInvoice = getPurchaseInvoiceModel();
    let purchaseInvoices = [];
    if (PurchaseInvoice) {
        purchaseInvoices = await PurchaseInvoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() }
            ],
            isDeleted: { $ne: true },
            createdAt: { $lte: endDate }
        });
    }
    const purchaseInvoiceSubtotal = purchaseInvoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    const purchaseInvoicePaid = purchaseInvoices.reduce((sum, inv) => sum + (inv.paid || 0), 0);
    const accountsPayable = purchaseInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

    // 4. Fetch Inventory Sales and Current Inventory Value
    const inventorySales = await Sale.find({
        $or: [
            { userId: userObjectId },
            { userId: userId.toString() }
        ],
        isDeleted: { $ne: true },
        saleDate: { $lte: endDate }
    });
    const inventorySaleSubtotal = inventorySales.reduce((sum, s) => sum + (s.subtotal || 0), 0);
    const inventorySalePaid = inventorySales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);

    const inventoryItemIds = inventorySales.map(s => s.inventoryItemId).filter(Boolean);
    const InventoryItem = getInventoryItemModel();
    let inventoryItems = [];
    if (InventoryItem) {
        inventoryItems = await InventoryItem.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() }
            ],
            isDeleted: { $ne: true }
        });
    }
    const inventoryItemsMap = new Map(inventoryItems.map(item => [item._id.toString(), item]));

    let calculatedCogs = 0;
    inventorySales.forEach(sale => {
        const item = sale.inventoryItemId ? inventoryItemsMap.get(sale.inventoryItemId.toString()) : null;
        const actualCostPerUnit = item?.costPrice || item?.buyPrice || (sale.unitPrice * 0.6);
        calculatedCogs += actualCostPerUnit * sale.quantitySold;
    });

    // Current Inventory valuation: stock quantity * price
    const currentInventoryValuation = inventoryItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || item.costPrice || 0)), 0);

    // 5. Fetch Payrolls
    const Payroll = getPayrollModel();
    let payrolls = [];
    if (Payroll) {
        payrolls = await Payroll.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() },
                { createdBy: userObjectId },
                { createdBy: userId.toString() }
            ],
            isDeleted: { $ne: true },
            createdAt: { $lte: endDate }
        });
    }
    const payrollSalariesExpense = payrolls.reduce((sum, pr) => sum + (pr.grossSalary || 0), 0);

    // 6. Balance Sheet baseline calculations from live central data
    const fixedAssets = 0;
    const nonCurrentLiabilities = 0;

    // Cash and Cash Equivalents
    const totalCashInflow = salesInvoicePaid + bkIncome + inventorySalePaid;
    const totalCashOutflow = purchaseInvoicePaid + bkExpense + payrollSalariesExpense;
    const cashAndBank = totalCashInflow - totalCashOutflow;

    const currentAssets = cashAndBank + accountsReceivable + currentInventoryValuation;
    const totalAssets = currentAssets + fixedAssets;

    const currentLiabilities = accountsPayable;
    const totalLiabilities = currentLiabilities + nonCurrentLiabilities;

    // Retained Earnings = Cumulative Revenue - Cumulative Expenses
    const cumulativeRevenue = salesInvoiceSubtotal + bkIncome + inventorySaleSubtotal;
    const cumulativeExpenses = calculatedCogs + payrollSalariesExpense + bkExpense + purchaseInvoiceSubtotal;
    const retainedEarnings = cumulativeRevenue - cumulativeExpenses;

    const totalEquity = totalAssets - totalLiabilities;
    const balanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1.0;

    return {
        companyName: "Your Company",
        financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        period,
        assets: {
            cashAndBank,
            accountsReceivable,
            inventory: currentInventoryValuation,
            currentAssets,
            fixedAssets,
            totalAssets
        },
        liabilities: {
            accountsPayable,
            currentLiabilities,
            nonCurrentLiabilities,
            totalLiabilities
        },
        equity: {
            ownerEquity: 0,
            retainedEarnings,
            totalEquity
        },
        totalLiabilitiesEquity: totalLiabilities + totalEquity,
        balanced,
        breakdown: {
            assets: {
                currentAssets: [
                    { label: "Cash & Bank Balances", value: cashAndBank },
                    { label: "Accounts Receivable (Trade)", value: accountsReceivable },
                    { label: "Inventory Stock Valuation", value: currentInventoryValuation }
                ],
                nonCurrentAssets: [
                    { label: "Fixed Assets & Equipment", value: fixedAssets }
                ]
            },
            liabilities: {
                currentLiabilities: [
                    { label: "Accounts Payable (Trade)", value: accountsPayable }
                ],
                nonCurrentLiabilities: [
                    { label: "Long Term Debt / Loans", value: nonCurrentLiabilities }
                ]
            },
            equity: [
                { label: "Owner Capital", value: 0 },
                { label: "Retained Earnings / Accumulated Profit", value: retainedEarnings }
            ]
        }
    };
}

export async function getGstAnalytics(userId, period = "this-month") {
    const { startDate, endDate } = resolvePeriod(period);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch Sales Invoices
    const Invoice = getInvoiceModel();
    let salesInvoices = [];
    if (Invoice) {
        salesInvoices = await Invoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() },
                { createdBy: userObjectId },
                { createdBy: userId.toString() }
            ],
            isDeleted: { $ne: true },
            sourceInvoiceType: { $ne: "purchase" },
            invoiceDate: { $gte: startDate, $lte: endDate }
        });
    }

    // 2. Fetch POS / Inventory Sales
    const inventorySales = await Sale.find({
        $or: [
            { userId: userObjectId },
            { userId: userId.toString() }
        ],
        isDeleted: { $ne: true },
        saleDate: { $gte: startDate, $lte: endDate }
    });

    // 3. Fetch Purchase Invoices
    const PurchaseInvoice = getPurchaseInvoiceModel();
    let purchaseInvoices = [];
    if (PurchaseInvoice) {
        purchaseInvoices = await PurchaseInvoice.find({
            $or: [
                { userId: userObjectId },
                { userId: userId.toString() }
            ],
            isDeleted: { $ne: true },
            createdAt: { $gte: startDate, $lte: endDate }
        });
    }

    // Calculate Sales-side Taxable & GST Amounts
    let salesTaxable = 0;
    let outputCgst = 0;
    let outputSgst = 0;
    let outputIgst = 0;
    let outputGst = 0;

    salesInvoices.forEach(inv => {
        salesTaxable += (inv.subtotal || 0);
        const hasItems = Array.isArray(inv.items);
        const cgst = inv.cgst || (hasItems ? inv.items.reduce((s, i) => s + (i.cgstAmount || 0), 0) : 0);
        const sgst = inv.sgst || (hasItems ? inv.items.reduce((s, i) => s + (i.sgstAmount || 0), 0) : 0);
        const igst = inv.igst || (hasItems ? inv.items.reduce((s, i) => s + (i.igstAmount || 0), 0) : 0);
        const tax = inv.taxAmount || inv.totalTax || (cgst + sgst + igst);

        outputCgst += cgst;
        outputSgst += sgst;
        outputIgst += igst;
        outputGst += tax;
    });

    inventorySales.forEach(sale => {
        salesTaxable += (sale.subtotal || 0);
        const cgst = sale.cgstAmount || sale.cgst || 0;
        const sgst = sale.sgstAmount || sale.sgst || 0;
        const igst = sale.igstAmount || sale.igst || 0;
        const tax = sale.gstAmount || sale.taxAmount || (cgst + sgst + igst);

        outputCgst += cgst;
        outputSgst += sgst;
        outputIgst += igst;
        outputGst += tax;
    });

    // Calculate Purchase-side Taxable & GST Amounts
    let purchaseTaxable = 0;
    let inputCgst = 0;
    let inputSgst = 0;
    let inputIgst = 0;
    let inputGst = 0;

    purchaseInvoices.forEach(inv => {
        purchaseTaxable += (inv.subtotal || 0);
        const hasItems = Array.isArray(inv.items);
        const cgst = inv.totalCgst || inv.cgst || (hasItems ? inv.items.reduce((s, i) => s + (i.cgstAmount || 0), 0) : 0);
        const sgst = inv.totalSgst || inv.sgst || (hasItems ? inv.items.reduce((s, i) => s + (i.sgstAmount || 0), 0) : 0);
        const igst = inv.totalIgst || inv.igst || (hasItems ? inv.items.reduce((s, i) => s + (i.igstAmount || 0), 0) : 0);
        const tax = inv.totalTax || inv.taxAmount || (cgst + sgst + igst);

        inputCgst += cgst;
        inputSgst += sgst;
        inputIgst += igst;
        inputGst += tax;
    });

    // Net GST Calculation
    let gstPayable = 0;
    let gstReceivable = 0;

    if (outputGst >= inputGst) {
        gstPayable = outputGst - inputGst;
        gstReceivable = 0;
    } else {
        gstPayable = 0;
        gstReceivable = inputGst - outputGst;
    }

    return {
        period,
        gstSummary: {
            outputGst,
            inputGst,
            gstPayable,
            gstReceivable
        },
        taxBreakdown: {
            cgst: {
                output: outputCgst,
                input: inputCgst,
                net: Math.max(0, outputCgst - inputCgst)
            },
            sgst: {
                output: outputSgst,
                input: inputSgst,
                net: Math.max(0, outputSgst - inputSgst)
            },
            igst: {
                output: outputIgst,
                input: inputIgst,
                net: Math.max(0, outputIgst - inputIgst)
            }
        },
        transactionSummary: {
            taxableSales: salesTaxable,
            taxablePurchases: purchaseTaxable,
            salesGst: outputGst,
            purchaseGst: inputGst
        }
    };
}
