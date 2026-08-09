import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BanknoteIcon,
  BarChart3,
  Building2,
  Calculator,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  LogOut,
  Package,
  Search,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Home,
  BookOpen,
  Receipt,
  RefreshCw,
  BarChart2,
  Bell,
  Menu,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
  Send,
  Bot
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, API_BASE_URL, apiRequest } from "@/lib/api";
import { isTrialExpired } from "@/lib/trial";
import { callGemini } from "@/lib/gemini";

// --- Types & Data ---

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  subscriptionStatus?: "pending" | "active";
  subscriptionPlan?: "trial" | "monthly" | "annual" | "lifetime";
  subscriptionAmount?: number;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  trialEndDate?: string;
};

type DashboardModule = {
  title: string;
  description: string;
  output: string;
  icon: typeof Users;
  path: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
};

const dashboardModules: DashboardModule[] = [
  { title: "Dashboard", description: "Main overview", output: "", icon: Home, path: "/" },
  { title: "Payroll Automation", description: "Manage employee salaries, deductions, and salary slips.", output: "", icon: Users, path: "/payroll" },
  { title: "Tax & GST Management", description: "Calculate and manage GST, CGST, SGST, and IGST.", output: "", icon: FileText, path: "/tax-gst" },
  { title: "Balance Sheet", description: "Generate balance sheets with assets, liabilities, and equity.", output: "", icon: BarChart3, path: "/balance-sheet" },
  { title: "Profit & Loss Statement", description: "Create P&L statements with income and expense analysis.", output: "", icon: TrendingUp, path: "/profit-loss" },
  { title: "Cash Flow Prediction", description: "AI-powered forecasting for next 6 months.", output: "", icon: FileSpreadsheet, path: "/cashflow" },
  { title: "Cash Flow Statement", description: "Trace inflows, outflows, and net movement.", output: "", icon: BarChart3, path: "/cashflow-statement" },
  { title: "Financial Ratios", description: "Calculate liquidity, profitability, and solvency metrics.", output: "", icon: Calculator, path: "/financial-ratios" },
  { title: "Bookkeeping", description: "Record income, expenses, and categorized entries.", output: "", icon: BookOpen, path: "/bookkeeping" },
  { title: "Inventory Management", description: "Track inventory with automated reorder alerts.", output: "", icon: Package, path: "/inventory" },
  { title: "Bank Reconciliation", description: "Match ledger entries with bank statements.", output: "", icon: BanknoteIcon, path: "/bank-reconciliation" },
  { title: "Fraud Detection", description: "Detect and prevent fraudulent transactions.", output: "", icon: Shield, path: "/fraud-detection" },
  { title: "Civil Engineering", description: "Plan schedules, structures, and project delivery.", output: "", icon: Building2, path: "/civil-engineering" },
  { title: "Invoice Automation", description: "OCR scanning, voice input, and smart processing.", output: "", icon: FolderArchive, path: "/invoice" },
];

type Mode = "assistant" | "automation";

const emptyStats = [
  { title: "Total Revenue", amount: "", trend: "", isPositive: true, bgColor: "bg-emerald-100/80", iconColor: "text-emerald-600", icon: TrendingUp },
  { title: "Total Expenses", amount: "", trend: "", isPositive: true, bgColor: "bg-rose-100/80", iconColor: "text-rose-600", icon: Receipt },
  { title: "Net Profit", amount: "", trend: "", isPositive: true, bgColor: "bg-blue-100/80", iconColor: "text-blue-600", icon: BarChart2 },
  { title: "Net Balance", amount: "", trend: "", isPositive: true, bgColor: "bg-purple-100/80", iconColor: "text-purple-600", icon: RefreshCw },
  { title: "Outstanding Receivables", amount: "", trend: "", isPositive: false, bgColor: "bg-orange-100/80", iconColor: "text-orange-600", icon: FileText },
  { title: "GST Payable", amount: "", trend: "", isPositive: true, bgColor: "bg-indigo-100/80", iconColor: "text-indigo-600", icon: Receipt },
];

const isDateInPeriod = (dateInput: any, period: string): boolean => {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return false;
  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (period === "this-month") {
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }
  if (period === "last-month") {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return date.getMonth() === prevMonth && date.getFullYear() === prevMonthYear;
  }
  if (period === "this-quarter") {
    const currentQuarter = Math.floor(currentMonth / 3);
    const dateQuarter = Math.floor(date.getMonth() / 3);
    return dateQuarter === currentQuarter && date.getFullYear() === currentYear;
  }
  if (period === "this-year") {
    return date.getFullYear() === currentYear;
  }
  return true;
};

const toNumber = (value: unknown) => Number(value) || 0;
const formatCurrency = (value: unknown) => `₹${toNumber(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const formatPeriod = (value?: string) => value || "—";

// --- Main Component ---

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<Mode>("assistant");
  
  // Active path for sidebar highlighting
  const [activePath, setActivePath] = useState("/");

  // Period filtering & Raw Datasets States
  const [selectedPeriod, setSelectedPeriod] = useState<string>("last-month");
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [allPurchaseInvoices, setAllPurchaseInvoices] = useState<any[]>([]);
  const [allPayrolls, setAllPayrolls] = useState<any[]>([]);
  const [allBalanceSheets, setAllBalanceSheets] = useState<any[]>([]);
  const [allBookkeepingEntries, setAllBookkeepingEntries] = useState<any[]>([]);

  // Modules Dynamic Data States
  const [dashboardStats, setDashboardStats] = useState<any[]>(emptyStats);
  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  const [financialRatios, setFinancialRatios] = useState<any[]>([]);
  const [plSummaryData, setPlSummaryData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    grossProfitMargin: 0,
    netProfitMargin: 0
  });
  const [expenseBreakdown, setExpenseBreakdown] = useState({
    goods: 42,
    salaries: 25,
    rent: 12,
    utilities: 8,
    others: 13
  });
  const [cashFlowEntries, setCashFlowEntries] = useState<any[]>([]);
  const [cashFlowStatements, setCashFlowStatements] = useState<any[]>([]);
  const [moduleRecordCounts, setModuleRecordCounts] = useState<{ label: string; count: number; path: string }[]>([]);

  // AI Chat States
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", role: "ai", content: "Hi there! I am your SHREE ANDAL AI Assistant. How can I help you automate tasks today?", timestamp: new Date() }
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fetching Logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    fetch(API_ENDPOINTS.USER, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data: UserProfile) => {
        setUser(data);
        if (data.subscriptionStatus !== "active" || isTrialExpired(data)) {
          toast({
            variant: "destructive",
            title: "Free trial ended",
            description: "Your trial is over. Please choose a paid plan to continue.",
          });
          localStorage.removeItem("token");
          navigate("/auth?tab=signup&plan=monthly");
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        navigate("/auth");
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  // Trial Expiry Timer
  useEffect(() => {
    if (!user) return;

    const timer = window.setInterval(() => {
      if (isTrialExpired(user)) {
        toast({
          variant: "destructive",
          title: "Free trial ended",
          description: "Your trial session has expired. Please choose a paid plan to continue.",
        });
        localStorage.removeItem("token");
        navigate("/auth?tab=signup&plan=monthly");
      }
    }, 60000);

    return () => window.clearInterval(timer);
  }, [navigate, toast, user]);

  // Load each dashboard value from the module that owns it; no display data is seeded here.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const readJson = async (endpoint: string) => {
          const response = await apiRequest(endpoint).catch(() => null);
          return response?.ok ? response.json() : null;
        };

        // 1. Fetch Invoices (limit 100 to get full lists for graphing/filtering)
        const invoicesRes = await apiRequest(`${API_ENDPOINTS.INVOICE}/all?limit=100`).catch(() => null);
        let invoicesData = [];
        if (invoicesRes && invoicesRes.ok) {
          const parsed = await invoicesRes.json();
          if (parsed && parsed.invoices) {
            invoicesData = parsed.invoices;
            setAllInvoices(parsed.invoices);
          }
        }

        // 2. Fetch Purchase Invoices
        const purchasesRes = await apiRequest(`${API_BASE_URL}/purchase-invoice/all`).catch(() => null);
        let purchasesData = [];
        if (purchasesRes && purchasesRes.ok) {
          const parsed = await purchasesRes.json();
          if (parsed && parsed.invoices) {
            purchasesData = parsed.invoices;
            setAllPurchaseInvoices(parsed.invoices);
          }
        }

        // 3. Fetch Payrolls
        const payrollRes = await apiRequest(`${API_BASE_URL}/payroll/all`).catch(() => null);
        let payrollData = [];
        if (payrollRes && payrollRes.ok) {
          const parsed = await payrollRes.json();
          if (parsed) {
            payrollData = parsed;
            setAllPayrolls(parsed);
          }
        }

        // 4. Fetch Balance Sheets
        const balanceSheetsRes = await apiRequest(`${API_BASE_URL}/balance`).catch(() => null);
        let balanceSheetsData = [];
        if (balanceSheetsRes && balanceSheetsRes.ok) {
          const parsed = await balanceSheetsRes.json();
          if (parsed) {
            balanceSheetsData = parsed;
            setAllBalanceSheets(parsed);
          }
        }

        // 5. Fetch Financial Ratios History
        const ratiosRes = await apiRequest(`${API_BASE_URL}/financial-ratios/history`).catch(() => null);
        let ratiosHistory = null;
        if (ratiosRes && ratiosRes.ok) {
          ratiosHistory = await ratiosRes.json();
        }

        // We load other counts for the records counters
        const [invoiceStats, cashflows, statements, bookkeeping, inventory, taxRecords, balanceSummary] = await Promise.all([
          readJson(`${API_ENDPOINTS.INVOICE}/stats/overview`),
          readJson(`${API_BASE_URL}/cashflow/all`),
          readJson(`${API_BASE_URL}/cashflow-statement/all`),
          readJson(`${API_BASE_URL}/bookkeeping/all`),
          readJson(`${API_BASE_URL}/inventory/all`),
          readJson(`${API_ENDPOINTS.TAX}/all`),
          readJson(`${API_ENDPOINTS.BALANCE}/summary`),
        ]);

        const cashFlowData = Array.isArray(cashflows) ? cashflows : [];
        const cashFlowStatementData = Array.isArray(statements) ? statements : [];
        const inventoryItems = Array.isArray(inventory) ? inventory : [];
        const gstRecords = Array.isArray(taxRecords) ? taxRecords : [];
        const bookkeepingEntries = Array.isArray(bookkeeping?.entries) ? bookkeeping.entries : [];
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthCashFlowStatements = cashFlowStatementData.filter((statement: any) => {
          const createdAt = new Date(statement.createdAt);
          return !Number.isNaN(createdAt.getTime()) && createdAt >= lastMonthStart && createdAt < currentMonthStart;
        });

        setCashFlowEntries(cashFlowData);
        setCashFlowStatements(lastMonthCashFlowStatements);
        setAllBookkeepingEntries(bookkeepingEntries);
        setModuleRecordCounts([
          { label: "Invoices", count: toNumber(invoiceStats?.overall?.totalInvoices), path: "/invoice" },
          { label: "Cash flow entries", count: cashFlowData.length, path: "/cashflow" },
          { label: "Cash flow statements", count: cashFlowStatementData.length, path: "/cashflow-statement" },
          { label: "Bookkeeping entries", count: bookkeepingEntries.length, path: "/bookkeeping" },
          { label: "Inventory items", count: inventoryItems.length, path: "/inventory" },
          { label: "Payroll records", count: payrollData.length, path: "/payroll" },
          { label: "GST records", count: gstRecords.length, path: "/tax-gst" },
          { label: "Balance sheets", count: toNumber(balanceSummary?.totalRecords), path: "/balance-sheet" },
          { label: "Ratio calculations", count: Array.isArray(ratiosHistory) ? ratiosHistory.length : 0, path: "/financial-ratios" },
        ]);

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // Update calculations whenever period or raw data changes
  useEffect(() => {
    const filteredInvoices = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    const filteredPurchases = allPurchaseInvoices.filter(inv => isDateInPeriod(inv.createdAt || inv.billDate, selectedPeriod));
    const filteredPayrolls = allPayrolls.filter(pr => isDateInPeriod(pr.createdAt, selectedPeriod));

    // Group calculations
    const revenue = filteredInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const purchaseExpenses = filteredPurchases.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const payrollExpenses = filteredPayrolls.reduce((sum, pr) => sum + (pr.grossSalary || 0), 0);
    const expenses = purchaseExpenses + payrollExpenses;
    const profit = revenue - expenses;

    // Stats calculations
    // Bookkeeping period-based calculations
    const selectedPeriodBookkeeping = allBookkeepingEntries.filter(entry => isDateInPeriod(entry.date, selectedPeriod));
    const bkIncome = selectedPeriodBookkeeping.reduce((sum, entry) => entry.type === "income" ? sum + toNumber(entry.amount) : sum, 0);
    const bkExpense = selectedPeriodBookkeeping.reduce((sum, entry) => entry.type === "expense" ? sum + toNumber(entry.amount) : sum, 0);
    const bkNet = bkIncome - bkExpense;

    setDashboardStats([
      { title: "Total Revenue", amount: bkIncome > 0 ? formatCurrency(bkIncome) : "₹0", trend: "", isPositive: true, hasData: true, bgColor: "bg-emerald-100/80", iconColor: "text-emerald-600", icon: TrendingUp },
      { title: "Total Expenses", amount: bkExpense > 0 ? formatCurrency(bkExpense) : "₹0", trend: "", isPositive: true, hasData: true, bgColor: "bg-rose-100/80", iconColor: "text-rose-600", icon: Receipt },
      { title: "Net Profit", amount: "", trend: "", isPositive: true, hasData: false, bgColor: "bg-blue-100/80", iconColor: "text-blue-600", icon: BarChart2 },
      { title: "Net Balance", amount: formatCurrency(bkNet), trend: "", isPositive: bkNet >= 0, hasData: true, bgColor: "bg-purple-100/80", iconColor: "text-purple-600", icon: RefreshCw },
      { title: "Outstanding Receivables", amount: "", trend: "", isPositive: false, hasData: false, bgColor: "bg-orange-100/80", iconColor: "text-orange-600", icon: FileText },
      { title: "GST Payable", amount: "", trend: "", isPositive: true, hasData: false, bgColor: "bg-indigo-100/80", iconColor: "text-indigo-600", icon: Receipt },
    ]);

    setPlSummaryData({
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: profit,
      grossProfitMargin: revenue > 0 ? ((revenue - purchaseExpenses) / revenue) * 100 : 0,
      netProfitMargin: revenue > 0 ? (profit / revenue) * 100 : 0
    });

    // Expenses breakdown calculations
    if (expenses > 0) {
      setExpenseBreakdown({
        goods: Math.round((purchaseExpenses / expenses) * 100),
        salaries: Math.round((payrollExpenses / expenses) * 100),
        rent: 0,
        utilities: 0,
        others: 0
      });
    } else {
      setExpenseBreakdown({ goods: 0, salaries: 0, rent: 0, utilities: 0, others: 0 });
    }

    // Invoices list mapping (Filtered for the selected period as requested)
    const selectedPeriodInvoices = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    const mappedInvoices = selectedPeriodInvoices.slice(0, 5).map((inv: any) => {
      let statusColor = "bg-slate-100 text-slate-700";
      const statusStr = inv.status || "draft";
      if (statusStr === "paid") statusColor = "bg-emerald-100/80 text-emerald-700";
      else if (statusStr === "sent" || statusStr === "viewed") statusColor = "bg-blue-100/80 text-blue-700";
      else if (statusStr === "overdue") statusColor = "bg-rose-100/80 text-rose-700";
      else if (statusStr === "draft") statusColor = "bg-amber-100/80 text-amber-700";

      return {
        id: inv.invoiceNumber || "INV-UNKNOWN",
        company: inv.customerName || "Unknown Client",
        amount: `₹${inv.grandTotal ? inv.grandTotal.toLocaleString() : "0"}`,
        status: statusStr.charAt(0).toUpperCase() + statusStr.slice(1),
        statusColor
      };
    });
    setInvoicesList(mappedInvoices);

    // Calculate Financial Ratios Dynamically
    // Find matching balance sheet for the selected period
    let matchingBS = allBalanceSheets.find(bs => isDateInPeriod(bs.createdAt, selectedPeriod));
    if (!matchingBS && allBalanceSheets.length > 0) {
      // Fallback: use the latest balance sheet in the history
      matchingBS = allBalanceSheets[0];
    }

    if (matchingBS) {
      const bsCurrentAssets = matchingBS.currentAssets || 0;
      const bsCurrentLiabilities = matchingBS.currentLiabilities || 0;
      const bsTotalAssets = matchingBS.totalAssets || 0;
      const bsTotalEquity = matchingBS.equity || 0;
      const bsTotalDebt = matchingBS.totalLiabilities || 0;
      
      // Find inventory from breakdown if available
      let bsInventory = 0;
      if (matchingBS.breakdown?.assets?.currentAssets) {
        const invItem = matchingBS.breakdown.assets.currentAssets.find((item: any) => 
          item.label?.toLowerCase().includes("inventory") || item.label?.toLowerCase().includes("stock")
        );
        if (invItem) bsInventory = invItem.value || 0;
      }

      // Calculate ratios
      const currentRatio = bsCurrentLiabilities ? bsCurrentAssets / bsCurrentLiabilities : 0;
      const quickRatio = bsCurrentLiabilities ? (bsCurrentAssets - bsInventory) / bsCurrentLiabilities : 0;
      const debtToEquity = bsTotalEquity ? bsTotalDebt / bsTotalEquity : 0;
      const grossMargin = revenue ? ((revenue - purchaseExpenses) / revenue) * 100 : 0;
      const netMargin = revenue ? (profit / revenue) * 100 : 0;
      const roe = bsTotalEquity ? (profit / bsTotalEquity) * 100 : 0;

      setFinancialRatios([
        { label: "Current Ratio", value: currentRatio ? currentRatio.toFixed(2) : "0.00", status: currentRatio >= 1.5 ? "Good" : "Low" },
        { label: "Quick Ratio", value: quickRatio ? quickRatio.toFixed(2) : "0.00", status: quickRatio >= 1.0 ? "Good" : "Low" },
        { label: "Debt to Equity", value: debtToEquity ? debtToEquity.toFixed(2) : "0.00", status: debtToEquity <= 1.5 ? "Good" : "High" },
        { label: "Gross Margin", value: `${grossMargin.toFixed(2)}%`, status: "Good" },
        { label: "Net Margin", value: `${netMargin.toFixed(2)}%`, status: "Good" },
        { label: "ROE", value: `${roe.toFixed(2)}%`, status: "Good" },
      ]);
    } else {
      setFinancialRatios([
        { label: "Current Ratio", value: "0.00", status: "Low" },
        { label: "Quick Ratio", value: "0.00", status: "Low" },
        { label: "Debt to Equity", value: "0.00", status: "Good" },
        { label: "Gross Margin", value: "0.00%", status: "Good" },
        { label: "Net Margin", value: "0.00%", status: "Good" },
        { label: "ROE", value: "0.00%", status: "Good" },
      ]);
    }

  }, [allInvoices, allPurchaseInvoices, allPayrolls, allBalanceSheets, selectedPeriod]);

  // Helper to format Y-Axis labels dynamically
  const formatYAxis = (val: number) => {
    if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return Math.round(val).toString();
  };

  // Generate Chart Data for the Line Chart based on period selector
  const { revenueLinePath, revenueMax, revenueXLabels } = useMemo(() => {
    const filtered = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    if (!filtered.length) return { revenueLinePath: "", revenueMax: 0, revenueXLabels: [] };

    // Group invoices by date or month depending on selectedPeriod
    // Sort chronologically
    const sorted = [...filtered].sort((a, b) => new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime());
    
    // Determine labels and points
    const pointsCount = Math.min(10, sorted.length);
    const step = Math.max(1, Math.floor(sorted.length / pointsCount));
    const selectedPoints: any[] = [];
    for (let i = 0; i < sorted.length; i += step) {
      selectedPoints.push(sorted[i]);
      if (selectedPoints.length >= 10) break;
    }
    // ensure last is added if not already
    if (sorted.length > 1 && !selectedPoints.includes(sorted[sorted.length - 1])) {
      selectedPoints.push(sorted[sorted.length - 1]);
    }

    const maxVal = Math.max(...selectedPoints.map(p => p.grandTotal || 0), 1000);
    const xLabels = selectedPoints.map(p => {
      const d = new Date(p.invoiceDate);
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    });

    // Build SVG path
    let path = "";
    selectedPoints.forEach((p, idx) => {
      const x = (idx / (selectedPoints.length - 1)) * 100;
      const y = 100 - (((p.grandTotal || 0) / maxVal) * 80 + 10); // leave 10% padding top/bottom
      if (idx === 0) path += `M${x},${y}`;
      else path += ` L${x},${y}`;
    });

    return { revenueLinePath: path, revenueMax: maxVal, revenueXLabels: xLabels };
  }, [allInvoices, selectedPeriod]);

  // Generate Cash Flow Bars data based on period selector
  const { cashFlowBars, cashFlowMax, cashFlowXLabels } = useMemo(() => {
    const filteredInvoices = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    const filteredPurchases = allPurchaseInvoices.filter(inv => isDateInPeriod(inv.createdAt || inv.billDate, selectedPeriod));
    
    // Group into 6 buckets chronologically
    const allDates = [
      ...filteredInvoices.map(i => i.invoiceDate),
      ...filteredPurchases.map(p => p.createdAt || p.billDate)
    ].filter(Boolean).map(d => new Date(d).getTime());

    if (!allDates.length) return { cashFlowBars: null, cashFlowMax: 0, cashFlowXLabels: [] };

    const minTime = Math.min(...allDates);
    const maxTime = Math.max(...allDates);
    const diff = maxTime - minTime || 1;
    const bucketSize = diff / 6;

    const buckets = Array.from({ length: 6 }, (_, idx) => {
      const start = minTime + idx * bucketSize;
      const end = start + bucketSize;
      
      const invoicesInBucket = filteredInvoices.filter(inv => {
        const t = new Date(inv.invoiceDate).getTime();
        return t >= start && t <= end;
      });

      const purchasesInBucket = filteredPurchases.filter(p => {
        const t = new Date(p.createdAt || p.billDate).getTime();
        return t >= start && t <= end;
      });

      const inflow = invoicesInBucket.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
      const outflow = purchasesInBucket.reduce((sum, p) => sum + (p.total || 0), 0);

      const labelDate = new Date(start + bucketSize / 2);
      const label = labelDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

      return { inflow, outflow, label };
    });

    const maxVal = Math.max(...buckets.flatMap(b => [b.inflow, b.outflow]), 1000);
    const bars = buckets.map(b => ({
      inflowHeight: `${(b.inflow / maxVal) * 100}%`,
      outflowHeight: `${(b.outflow / maxVal) * 100}%`,
      inflowVal: b.inflow.toLocaleString("en-IN"),
      outflowVal: b.outflow.toLocaleString("en-IN")
    }));
    
    const xLabels = buckets.map(b => b.label);

    return { cashFlowBars: bars, cashFlowMax: maxVal, cashFlowXLabels: xLabels };
  }, [allInvoices, allPurchaseInvoices, selectedPeriod]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiChatOpen]);

  const profileName = useMemo(() => {
    if (!user?.email) return "User";
    return user.name?.trim() || user.email.split("@")[0];
  }, [user]);

  const selectedPlanLabel = user?.subscriptionPlan
    ? { trial: "Trial", monthly: "Monthly", annual: "Annual", lifetime: "Lifetime" }[user.subscriptionPlan]
    : "Pending";

  const profileInitial = profileName.charAt(0).toUpperCase();
  const cashFlowChartData = useMemo(() => cashFlowEntries.slice(-6), [cashFlowEntries]);
  const cashFlowChartMaximum = useMemo(
    () => Math.max(1, ...cashFlowChartData.flatMap((entry) => [toNumber(entry.cashInflow), toNumber(entry.cashOutflow)])),
    [cashFlowChartData]
  );
  const latestCashFlowStatement = useMemo(() => {
    if (cashFlowStatements && cashFlowStatements.length > 0) {
      return cashFlowStatements[0];
    }
    // Fallback: build dynamically from bookkeeping last month
    const lastMonthBookkeeping = allBookkeepingEntries.filter(entry => isDateInPeriod(entry.date, "last-month"));
    const bkIncome = lastMonthBookkeeping.reduce((sum, entry) => entry.type === "income" ? sum + toNumber(entry.amount) : sum, 0);
    const bkExpense = lastMonthBookkeeping.reduce((sum, entry) => entry.type === "expense" ? sum + toNumber(entry.amount) : sum, 0);
    const bkNet = bkIncome - bkExpense;

    return {
      period: "July 2026",
      totalInflow: bkIncome,
      totalOutflow: bkExpense,
      netCashFlow: bkNet
    };
  }, [cashFlowStatements, allBookkeepingEntries]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const handleMainSearchSubmit = () => {
    if (!inputValue.trim()) return;
    toast({
      title: mode === "assistant" ? "AI Assistant ready" : "Automation ready",
      description: inputValue.trim(),
    });
    setInputValue("");
  };

  const handleChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    
    // Add User Message
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date()
    };
    
    // Add a placeholder message for AI
    const aiPlaceholderId = (Date.now() + 1).toString();
    const newAiMsgPlaceholder: ChatMessage = {
      id: aiPlaceholderId,
      role: "ai",
      content: "Thinking...",
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, newUserMsg, newAiMsgPlaceholder]);
    setChatInput("");

    try {
      const currentHistory = [...chatMessages, newUserMsg];
      const replyText = await callGemini(currentHistory);

      setChatMessages((prev) => 
        prev.map(msg => 
          msg.id === aiPlaceholderId 
            ? { ...msg, content: replyText, timestamp: new Date() } 
            : msg
        )
      );
    } catch (error: any) {
      console.error("Gemini Error:", error);
      setChatMessages((prev) => 
        prev.map(msg => 
          msg.id === aiPlaceholderId 
            ? { ...msg, content: "Error: Failed to get response from AI. Please try again.", timestamp: new Date() } 
            : msg
        )
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[45] bg-white border-r border-slate-200/60 flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } ${sidebarOpen ? 'w-[280px]' : 'w-20'}`}
      >
        {/* Sidebar Header with Interactive 'S' Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200/60 shrink-0">
          <button 
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setSidebarOpen(!sidebarOpen);
              } else {
                setMobileSidebarOpen(false);
              }
            }}
            className="group w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3 shrink-0 shadow-sm transition-colors hover:bg-slate-800 focus:outline-none"
            title="Toggle Sidebar"
          >
            <span className="group-hover:hidden">S</span>
            <Menu className="hidden group-hover:block w-5 h-5 text-white" />
          </button>
          
          {sidebarOpen && (
            <div className="flex flex-col justify-center overflow-hidden whitespace-nowrap min-w-0">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none mb-1 truncate">SHREE ANDAL AI</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold leading-none truncate">Software Solutions</span>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1.5 px-3">
            {dashboardModules.map((module) => {
              const Icon = module.icon;
              const isActive = activePath === module.path;
              return (
                <button
                  key={module.path}
                  onClick={() => {
                    setActivePath(module.path);
                    navigate(module.path);
                    if(window.innerWidth < 1024) setMobileSidebarOpen(false);
                  }}
                  title={!sidebarOpen ? module.title : undefined}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`} />
                  {sidebarOpen && (
                    <>
                      <span className="ml-3.5 text-[14px] font-medium truncate">{module.title}</span>
                      {!isActive && <ChevronDown className="w-4 h-4 ml-auto text-slate-400 opacity-0 group-hover:opacity-100 -rotate-90 transition-all shrink-0" />}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0 sticky top-0">
          
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button - Only visible on small screens */}
            <button onClick={() => {
               setMobileSidebarOpen(true); 
            }} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden flex-shrink-0 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative w-full max-w-xl flex items-center gap-2 ml-1 sm:ml-0">
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  id="main-search-input"
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleMainSearchSubmit();
                    }
                  }}
                  placeholder={mode === "assistant" ? "Ask AI anything..." : "Describe automation..."}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-xl text-[13px] font-medium focus:outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400 truncate"
                />
              </div>
              <button 
                onClick={handleMainSearchSubmit}
                className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-900 text-white items-center justify-center hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-4 shrink-0">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200/60 cursor-pointer group relative shrink-0">
               <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                  {loading ? "-" : profileInitial}
               </div>
               <div className="hidden md:block text-left min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 leading-none truncate max-w-[120px]">{loading ? "Loading..." : profileName}</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 mt-1 truncate">{selectedPlanLabel}</p>
               </div>
               <ChevronDown className="hidden md:block w-4 h-4 text-slate-400 shrink-0" />
               
               <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right transform scale-95 group-hover:scale-100">
                  <div className="p-4 border-b border-slate-100 md:hidden bg-slate-50/50 rounded-t-2xl">
                     <p className="text-sm font-bold text-slate-900 truncate">{profileName}</p>
                     <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button onClick={() => navigate("/profile")} className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors">
                      <Settings className="w-4 h-4 shrink-0" /> Profile Settings
                    </button>
                    <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors mt-1">
                      <LogOut className="w-4 h-4 shrink-0" /> Sign Out
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Analytics Area */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            
            {/* Page Title & Single Period selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">Dashboard Overview</h1>
                <p className="text-[13px] text-slate-500 mt-1.5 font-medium truncate">Monitor your business metrics and financial health.</p>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <span className="text-[13px] font-bold text-slate-500 whitespace-nowrap">Filter Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full sm:w-[160px] text-[13px] font-bold uppercase tracking-wide flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-650 bg-white hover:bg-slate-50 transition-colors shrink-0 outline-none cursor-pointer shadow-sm"
                >
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-quarter">This Quarter</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
            </div>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 mb-8">
              {dashboardStats.map((stat, i) => (
                <div key={i} className="bg-white p-4 xl:p-3 2xl:p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-w-0">
                  <div className="flex items-center justify-between mb-3 xl:mb-2 2xl:mb-4">
                    <div className={`w-10 h-10 xl:w-9 xl:h-9 2xl:w-11 2xl:h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${stat.bgColor} shrink-0`}>
                      <stat.icon className={`w-[18px] h-[18px] 2xl:w-[20px] 2xl:h-[20px] ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[11px] xl:text-[10px] 2xl:text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1 line-clamp-2 min-h-[32px] xl:min-h-[28px] 2xl:min-h-[36px] flex items-center">
                      {stat.title}
                    </h3>
                    <h2 className="text-xl xl:text-lg 2xl:text-[22px] font-black text-slate-900 tracking-tight mb-2 tabular-nums truncate">
                      {stat.hasData ? stat.amount : " "}
                    </h2>
                    {stat.hasData && <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] xl:text-[10px] 2xl:text-[12px] font-semibold mt-auto">
                      {stat.trend ? (stat.isPositive ? (
                        <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap">
                          <ArrowUpRight className="w-3 h-3 shrink-0" /> {stat.trend}
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap">
                          <ArrowDownRight className="w-3 h-3 shrink-0" /> {stat.trend}
                        </span>
                      )) : null}
                      <span className="text-slate-400 font-medium whitespace-nowrap">{stat.trend ? "vs last month" : "last month's bookkeeping"}</span>
                    </div>}
                  </div>
                </div>
              ))}
            </div>

            {/* --- Charts Row 1 --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              
              {/* Revenue Line Chart - FIXED ALIGNMENT */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col min-w-0">
                <div className="flex justify-between items-center mb-6 gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">Revenue Overview</h3>
                </div>
                <div className="flex-1 w-full flex flex-col justify-center">
                  {!revenueLinePath ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold py-12">
                      No revenue data for this period
                    </div>
                  ) : (
                    <>
                      {/* Chart Body */}
                      <div className="relative flex-1 flex min-h-[160px]">
                        {/* Y-Axis: Dynamic Width */}
                        <div className="flex flex-col justify-between text-[11px] text-slate-400 font-medium py-1 w-8 shrink-0">
                          <span>{formatYAxis(revenueMax)}</span>
                          <span>{formatYAxis(revenueMax * 0.75)}</span>
                          <span>{formatYAxis(revenueMax * 0.5)}</span>
                          <span>{formatYAxis(revenueMax * 0.25)}</span>
                          <span>0</span>
                        </div>
                        {/* Grid Lines & SVG */}
                        <div className="flex-1 relative border-b border-slate-200">
                          <div className="absolute inset-0 flex flex-col justify-between py-1">
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-transparent"></div>
                          </div>
                          <svg className="absolute inset-0 w-full h-full pb-1" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d={revenueLinePath} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      {/* X-Axis */}
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-8 pt-3">
                        {revenueXLabels.map((lbl, idx) => (
                          <span key={idx} className={idx >= 3 ? "hidden sm:inline" : ""}>{lbl}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Cash Flow Overview */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col min-w-0">
                <div className="flex justify-between items-center mb-6 gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">Cash Flow Overview</h3>
                </div>
                <div className="flex-1 w-full flex flex-col justify-center">
                  {!cashFlowBars ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold py-12">
                      No cash flow data for this period
                    </div>
                  ) : (
                    <>
                      {/* Chart Body */}
                      <div className="relative flex-1 flex min-h-[160px]">
                        {/* Y-Axis */}
                        <div className="flex flex-col justify-between text-[11px] text-slate-400 font-medium py-1 w-8 shrink-0">
                          <span>{formatYAxis(cashFlowMax)}</span>
                          <span>{formatYAxis(cashFlowMax * 0.75)}</span>
                          <span>{formatYAxis(cashFlowMax * 0.5)}</span>
                          <span>{formatYAxis(cashFlowMax * 0.25)}</span>
                          <span>0</span>
                        </div>
                        {/* Bars & Grid Lines */}
                        <div className="flex-1 relative border-b border-slate-200">
                          <div className="absolute inset-0 flex flex-col justify-between py-1">
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="h-px w-full bg-transparent"></div>
                          </div>
                          <div className="absolute inset-0 flex items-end justify-between px-2 pt-1">
                            {cashFlowBars.map((bar, i) => (
                              <div key={i} className="flex gap-1 w-[6%] h-full items-end pb-[1px] relative z-10">
                                <div className="bg-emerald-400 w-full rounded-t-[3px] transition-all hover:opacity-80" style={{ height: bar.inflowHeight }} title={`Inflow: ₹${bar.inflowVal}`}></div>
                                <div className="bg-indigo-400 w-full rounded-t-[3px] transition-all hover:opacity-80" style={{ height: bar.outflowHeight }} title={`Outflow: ₹${bar.outflowVal}`}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* X-Axis */}
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-8 pt-3 mb-4">
                        {cashFlowXLabels.map((lbl, idx) => (
                          <span key={idx} className={idx >= 3 ? "hidden sm:inline" : ""}>{lbl}</span>
                        ))}
                      </div>
                      {/* Legend */}
                      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-auto">
                        <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded bg-emerald-400 shrink-0"></span> Cash Inflow</div>
                        <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded bg-indigo-400 shrink-0"></span> Cash Outflow</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Profit & Loss Summary */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:col-span-2 xl:col-span-1 min-w-0">
                <div className="flex justify-between items-center mb-4 gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">Profit &amp; Loss Summary</h3>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 gap-3">
                    <span className="text-[13px] text-slate-500 font-semibold truncate">Total Revenue</span>
                    <span className="text-[14px] font-bold text-slate-900 tabular-nums shrink-0">
                      {plSummaryData.totalRevenue > 0 ? `₹${plSummaryData.totalRevenue.toLocaleString()}` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 gap-3">
                    <span className="text-[13px] text-slate-500 font-semibold truncate">Total Expenses</span>
                    <span className="text-[14px] font-bold text-slate-900 tabular-nums shrink-0">
                      {plSummaryData.totalExpenses > 0 ? `₹${plSummaryData.totalExpenses.toLocaleString()}` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-200 bg-emerald-50/60 -mx-5 px-5 sm:-mx-6 sm:px-6 my-1 gap-3">
                    <span className="text-[14px] font-bold text-slate-900 truncate">Net Profit</span>
                    <span className={`text-xl font-black tabular-nums shrink-0 ${plSummaryData.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {plSummaryData.totalRevenue > 0 || plSummaryData.totalExpenses > 0 ? (
                        `${plSummaryData.netProfit < 0 ? "-" : ""}₹${Math.abs(plSummaryData.netProfit).toLocaleString()}`
                      ) : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 gap-3">
                    <span className="text-[13px] text-slate-500 font-semibold truncate">Gross Profit Margin</span>
                    <span className="text-[14px] font-bold text-slate-900 tabular-nums shrink-0">
                      {plSummaryData.totalRevenue > 0 ? `${plSummaryData.grossProfitMargin.toFixed(2)}%` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 gap-3">
                    <span className="text-[13px] text-slate-500 font-semibold truncate">Net Profit Margin</span>
                    <span className="text-[14px] font-bold text-slate-900 tabular-nums shrink-0">
                      {plSummaryData.totalRevenue > 0 ? `${plSummaryData.netProfitMargin.toFixed(2)}%` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Charts Row 2 --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              
              {/* Recent Invoices Table */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col overflow-hidden lg:col-span-2 xl:col-span-2 min-w-0">
                <div className="flex justify-between items-center mb-5 gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">Recent Invoices</h3>
                  <button className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors shrink-0 whitespace-nowrap">View All</button>
                </div>
                <div className="flex-1 overflow-x-auto -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
                  <table className="w-full text-[13px] text-left border-collapse min-w-[450px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400">
                        <th className="pb-3 pr-3 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Invoice ID</th>
                        <th className="pb-3 pr-3 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Client</th>
                        <th className="pb-3 pr-4 font-bold uppercase tracking-wider text-[10px] text-right whitespace-nowrap">Amount</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicesList.length > 0 ? (
                        invoicesList.map((inv, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors group">
                            <td className="py-3.5 font-bold text-slate-800 pr-3 whitespace-nowrap">{inv.id}</td>
                            <td className="py-3.5 font-medium text-slate-500 pr-3 truncate max-w-[150px]">{inv.company}</td>
                            <td className="py-3.5 font-bold text-slate-900 text-right pr-4 tabular-nums whitespace-nowrap">{inv.amount}</td>
                            <td className="py-3.5 text-right whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase inline-block ${inv.statusColor}`}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                            No recent invoices found. Go to Invoice Automation to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Expenses Donut Chart */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">Top Expenses</h3>
                </div>
                <div className="flex-1" />
              </div>

              {/* Latest cash-flow statement */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col min-w-0">
                <h3 className="mb-6 text-[15px] font-bold text-slate-900 truncate">Latest Cash Flow Statement (Last Month)</h3>
                {latestCashFlowStatement ? (
                  <div className="flex flex-1 flex-col justify-center gap-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{formatPeriod(latestCashFlowStatement.period)}</p>
                    <div className="flex items-center justify-between gap-3"><span className="text-[13px] font-semibold text-slate-500">Cash inflow</span><span className="font-bold tabular-nums text-emerald-600">{formatCurrency(latestCashFlowStatement.totalInflow)}</span></div>
                    <div className="flex items-center justify-between gap-3"><span className="text-[13px] font-semibold text-slate-500">Cash outflow</span><span className="font-bold tabular-nums text-rose-600">{formatCurrency(latestCashFlowStatement.totalOutflow)}</span></div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4"><span className="text-[13px] font-bold text-slate-900">Net cash flow</span><span className={`font-black tabular-nums ${toNumber(latestCashFlowStatement.netCashFlow) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatCurrency(latestCashFlowStatement.netCashFlow)}</span></div>
                  </div>
                ) : <div className="flex-1" />}
              </div>
            </div>

            {/* --- Bottom Row --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
              
              {/* Financial Ratios */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-3 min-w-0">
                 <h3 className="text-[15px] font-bold text-slate-900 mb-5 truncate">Financial Ratios</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                    {financialRatios.length > 0 ? (
                      financialRatios.map((ratio, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-4 border border-slate-100 bg-slate-50/50 rounded-xl text-center hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-pointer group min-w-0">
                          <span className="text-[12px] font-semibold text-slate-500 mb-2 truncate w-full">{ratio.label}</span>
                          <span className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tabular-nums truncate w-full">{ratio.value}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap ${
                            ratio.status === "Good" ? "text-emerald-700 bg-emerald-100/60" : "text-rose-700 bg-rose-100/60"
                          }`}>
                            {ratio.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-6 py-6 text-center text-slate-400 font-medium">
                        No financial ratios calculated yet. Go to Financial Ratios to calculate.
                      </div>
                    )}
                 </div>
              </div>

              {/* Module records */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-1 flex flex-col min-w-0">
                 <h3 className="text-[15px] font-bold text-slate-900 mb-5 truncate">Module Records</h3>
                 <div className="flex-1 overflow-y-auto border border-slate-100 bg-slate-50/50 rounded-xl divide-y divide-slate-200/60">
                    {moduleRecordCounts.map((module) => (
                      <button key={module.label} onClick={() => navigate(module.path)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white transition-colors">
                        <p className="truncate text-[12px] font-semibold text-slate-600">{module.label}</p>
                        <span className="rounded-md bg-indigo-100/70 px-2 py-0.5 text-[11px] font-bold tabular-nums text-indigo-700">{module.count}</span>
                      </button>
                    ))}
                    {!moduleRecordCounts.length && <p className="p-4 text-center text-sm text-slate-400">Loading module data…</p>}
                 </div>
              </div>

            </div>

            {/* Footer */}
            <footer className="flex flex-col md:flex-row items-center justify-between py-6 mt-4 border-t border-slate-200/60 text-[13px] text-slate-500 font-medium">
              <p className="text-center md:text-left truncate w-full">© 2026 SHREE ANDAL AI Software Solutions. All rights reserved.</p>
              <p className="mt-2 md:mt-0 whitespace-nowrap shrink-0">Powered by <span className="font-bold text-slate-900">SHREE ANDAL AI</span></p>
            </footer>

          </div>
        </ScrollArea>

        {/* --- Floating AI Chat Button --- */}
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setIsAiChatOpen(true)}
            className="group relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 border border-slate-100 p-1 cursor-pointer"
            title="Open AI Assistant"
          >
            {/* The img tag using your uploaded image name */}
            <img 
              src="/image_f9d773.png" 
              alt="AI Bot" 
              className="w-full h-full object-cover rounded-full z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }} 
            />
            {/* Fallback Icon */}
            <Bot className="hidden text-indigo-500 w-8 h-8 z-10" />
            
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white rounded-full z-20 shadow-sm animate-pulse"></span>
          </button>
        </div>

      </main>

      {/* --- AI Chat Right-Side Panel --- */}
      
      {/* Background Overlay for mobile */}
      {isAiChatOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[55] sm:hidden transition-opacity"
          onClick={() => setIsAiChatOpen(false)} 
        />
      )}

      {/* The Chat Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-[60] transform transition-transform duration-300 ease-in-out flex flex-col ${isAiChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm p-0.5">
               <img src="/image_f9d773.png" alt="AI" className="w-full h-full object-cover rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
               <Bot className="hidden w-6 h-6 text-indigo-600" />
             </div>
             <div>
                <h3 className="font-bold text-[15px] text-slate-900 leading-tight">SHREE ANDAL AI</h3>
                <p className="text-[10px] text-emerald-600 font-bold tracking-widest flex items-center gap-1.5 mt-0.5 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                </p>
             </div>
          </div>
          <button 
            onClick={() => setIsAiChatOpen(false)} 
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
             <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>

        {/* Chat Input Area */}
        <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-100 bg-white shrink-0">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full pl-4 pr-12 py-3.5 bg-slate-100/80 border border-transparent rounded-2xl text-[13px] font-medium focus:outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-1.5 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-medium mt-3">
            AI Assistant can make mistakes. Consider verifying.
          </p>
        </form>

      </div>
    </div>
  );
};

export default Dashboard;
