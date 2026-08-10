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
  ArrowUpRight,
  ArrowDownRight,
  X,
  Send,
  Bot,
  Trash2,
  History,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  role?: "admin" | "instore";
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
  { title: "Profit & Loss", description: "Create P&L statements with income and expense analysis.", output: "", icon: TrendingUp, path: "/profit-loss" },
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
  { title: "Total Receivables", amount: "", trend: "", isPositive: true, iconColor: "text-[#006aff]", icon: TrendingUp },
  { title: "Total Payables", amount: "", trend: "", isPositive: true, iconColor: "text-[#f0483e]", icon: Receipt },
  { title: "Net Profit", amount: "", trend: "", isPositive: true, iconColor: "text-[#00b365]", icon: BarChart2 },
  { title: "Cash at Bank", amount: "", trend: "", isPositive: true, iconColor: "text-[#8e24aa]", icon: RefreshCw },
  { title: "Outstanding Inv", amount: "", trend: "", isPositive: false, iconColor: "text-[#f57c00]", icon: FileText },
  { title: "GST Payable", amount: "", trend: "", isPositive: true, iconColor: "text-[#0288d1]", icon: Receipt },
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
  const [chatViewMode, setChatViewMode] = useState<"chat" | "history">("chat");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fetching Logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchChatHistory = async () => {
      try {
        const res = await apiRequest(API_ENDPOINTS.AI_CHAT_HISTORY);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.history) && data.history.length > 0) {
            setChatMessages(data.history.map((msg: any) => ({
              id: msg.id || Math.random().toString(),
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp)
            })));
          }
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

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
        } else {
          fetchChatHistory();
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

  // Load each dashboard value from the module that owns it
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const readJson = async (endpoint: string) => {
          const response = await apiRequest(endpoint).catch(() => null);
          return response?.ok ? response.json() : null;
        };

        const invoicesRes = await apiRequest(`${API_ENDPOINTS.INVOICE}/all?limit=100`).catch(() => null);
        let invoicesData = [];
        if (invoicesRes && invoicesRes.ok) {
          const parsed = await invoicesRes.json();
          if (parsed && parsed.invoices) {
            invoicesData = parsed.invoices;
            setAllInvoices(parsed.invoices);
          }
        }

        const purchasesRes = await apiRequest(`${API_BASE_URL}/purchase-invoice/all`).catch(() => null);
        let purchasesData = [];
        if (purchasesRes && purchasesRes.ok) {
          const parsed = await purchasesRes.json();
          if (parsed && parsed.invoices) {
            purchasesData = parsed.invoices;
            setAllPurchaseInvoices(parsed.invoices);
          }
        }

        const payrollRes = await apiRequest(`${API_BASE_URL}/payroll/all`).catch(() => null);
        let payrollData = [];
        if (payrollRes && payrollRes.ok) {
          const parsed = await payrollRes.json();
          if (parsed) {
            payrollData = parsed;
            setAllPayrolls(parsed);
          }
        }

        const balanceSheetsRes = await apiRequest(`${API_BASE_URL}/balance`).catch(() => null);
        let balanceSheetsData = [];
        if (balanceSheetsRes && balanceSheetsRes.ok) {
          const parsed = await balanceSheetsRes.json();
          if (parsed) {
            balanceSheetsData = parsed;
            setAllBalanceSheets(parsed);
          }
        }

        const ratiosRes = await apiRequest(`${API_BASE_URL}/financial-ratios/history`).catch(() => null);
        let ratiosHistory = null;
        if (ratiosRes && ratiosRes.ok) {
          ratiosHistory = await ratiosRes.json();
        }

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
          { label: "Sales Invoices", count: toNumber(invoiceStats?.overall?.totalInvoices), path: "/invoice" },
          { label: "Purchase Bills", count: purchasesData.length, path: "/invoice" },
          { label: "Bank Transactions", count: cashFlowData.length, path: "/cashflow" },
          { label: "Manual Journals", count: bookkeepingEntries.length, path: "/bookkeeping" },
          { label: "Items & Inventory", count: inventoryItems.length, path: "/inventory" },
          { label: "Tax Returns", count: gstRecords.length, path: "/tax-gst" },
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

    const revenue = filteredInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const purchaseExpenses = filteredPurchases.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const payrollExpenses = filteredPayrolls.reduce((sum, pr) => sum + (pr.grossSalary || 0), 0);
    const expenses = purchaseExpenses + payrollExpenses;
    const profit = revenue - expenses;

    const selectedPeriodBookkeeping = allBookkeepingEntries.filter(entry => isDateInPeriod(entry.date, selectedPeriod));
    const bkIncome = selectedPeriodBookkeeping.reduce((sum, entry) => entry.type === "income" ? sum + toNumber(entry.amount) : sum, 0);
    const bkExpense = selectedPeriodBookkeeping.reduce((sum, entry) => entry.type === "expense" ? sum + toNumber(entry.amount) : sum, 0);
    const bkNet = bkIncome - bkExpense;

    setDashboardStats([
      { title: "Total Receivables", amount: bkIncome > 0 ? formatCurrency(bkIncome) : "₹0.00", trend: "", isPositive: true, hasData: true, iconColor: "text-[#006aff]", icon: TrendingUp },
      { title: "Total Payables", amount: bkExpense > 0 ? formatCurrency(bkExpense) : "₹0.00", trend: "", isPositive: true, hasData: true, iconColor: "text-[#f0483e]", icon: Receipt },
      { title: "Net Profit", amount: "₹0.00", trend: "", isPositive: true, hasData: false, iconColor: "text-[#00b365]", icon: BarChart2 },
      { title: "Cash at Bank", amount: formatCurrency(bkNet), trend: "", isPositive: bkNet >= 0, hasData: true, iconColor: "text-[#8e24aa]", icon: RefreshCw },
      { title: "Outstanding Inv", amount: "₹0.00", trend: "", isPositive: false, hasData: false, iconColor: "text-[#f57c00]", icon: FileText },
      { title: "GST Payable", amount: "₹0.00", trend: "", isPositive: true, hasData: false, iconColor: "text-[#0288d1]", icon: Receipt },
    ]);

    setPlSummaryData({
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: profit,
      grossProfitMargin: revenue > 0 ? ((revenue - purchaseExpenses) / revenue) * 100 : 0,
      netProfitMargin: revenue > 0 ? (profit / revenue) * 100 : 0
    });

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

    const selectedPeriodInvoices = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    const mappedInvoices = selectedPeriodInvoices.slice(0, 5).map((inv: any) => {
      let statusColor = "bg-[#f4f5f8] text-[#555] border border-[#ddd]";
      const statusStr = inv.status || "draft";
      if (statusStr === "paid") statusColor = "bg-[#e6f8ef] text-[#00b365] border border-[#00b365]/30";
      else if (statusStr === "sent" || statusStr === "viewed") statusColor = "bg-[#e8f2ff] text-[#006aff] border border-[#006aff]/30";
      else if (statusStr === "overdue") statusColor = "bg-[#fde9e8] text-[#f0483e] border border-[#f0483e]/30";
      else if (statusStr === "draft") statusColor = "bg-[#fff8e1] text-[#f57c00] border border-[#f57c00]/30";

      return {
        id: inv.invoiceNumber || "INV-UNKNOWN",
        company: inv.customerName || "Unknown Client",
        amount: `₹${inv.grandTotal ? inv.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}`,
        status: statusStr.charAt(0).toUpperCase() + statusStr.slice(1),
        statusColor
      };
    });
    setInvoicesList(mappedInvoices);

    let matchingBS = allBalanceSheets.find(bs => isDateInPeriod(bs.createdAt, selectedPeriod));
    if (!matchingBS && allBalanceSheets.length > 0) {
      matchingBS = allBalanceSheets[0];
    }

    if (matchingBS) {
      const bsCurrentAssets = matchingBS.currentAssets || 0;
      const bsCurrentLiabilities = matchingBS.currentLiabilities || 0;
      const bsTotalAssets = matchingBS.totalAssets || 0;
      const bsTotalEquity = matchingBS.equity || 0;
      const bsTotalDebt = matchingBS.totalLiabilities || 0;
      
      let bsInventory = 0;
      if (matchingBS.breakdown?.assets?.currentAssets) {
        const invItem = matchingBS.breakdown.assets.currentAssets.find((item: any) => 
          item.label?.toLowerCase().includes("inventory") || item.label?.toLowerCase().includes("stock")
        );
        if (invItem) bsInventory = invItem.value || 0;
      }

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

  const formatYAxis = (val: number) => {
    if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return Math.round(val).toString();
  };

  const { revenueLinePath, revenueMax, revenueXLabels } = useMemo(() => {
    const filtered = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    if (!filtered.length) return { revenueLinePath: "", revenueMax: 0, revenueXLabels: [] };

    const sorted = [...filtered].sort((a, b) => new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime());
    
    const pointsCount = Math.min(10, sorted.length);
    const step = Math.max(1, Math.floor(sorted.length / pointsCount));
    const selectedPoints: any[] = [];
    for (let i = 0; i < sorted.length; i += step) {
      selectedPoints.push(sorted[i]);
      if (selectedPoints.length >= 10) break;
    }
    if (sorted.length > 1 && !selectedPoints.includes(sorted[sorted.length - 1])) {
      selectedPoints.push(sorted[sorted.length - 1]);
    }

    const maxVal = Math.max(...selectedPoints.map(p => p.grandTotal || 0), 1000);
    const xLabels = selectedPoints.map(p => {
      const d = new Date(p.invoiceDate);
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    });

    let path = "";
    selectedPoints.forEach((p, idx) => {
      const x = (idx / (selectedPoints.length - 1)) * 100;
      const y = 100 - (((p.grandTotal || 0) / maxVal) * 80 + 10);
      if (idx === 0) path += `M${x},${y}`;
      else path += ` L${x},${y}`;
    });

    return { revenueLinePath: path, revenueMax: maxVal, revenueXLabels: xLabels };
  }, [allInvoices, selectedPeriod]);

  const { cashFlowBars, cashFlowMax, cashFlowXLabels } = useMemo(() => {
    const filteredInvoices = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    const filteredPurchases = allPurchaseInvoices.filter(inv => isDateInPeriod(inv.createdAt || inv.billDate, selectedPeriod));
    
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

  const profileName = useMemo(() => {
    if (!user?.email) return "User";
    return user.name?.trim() || user.email.split("@")[0];
  }, [user]);

  const selectedPlanLabel = user?.subscriptionPlan
    ? { trial: "Trial", monthly: "Standard", annual: "Professional", lifetime: "Enterprise" }[user.subscriptionPlan]
    : "Pending";

  const profileInitial = profileName.charAt(0).toUpperCase();
  
  const filteredModules = useMemo(() => {
    if (user?.role === "instore") {
      return dashboardModules.filter(m => 
        m.path === "/" || 
        m.path === "/invoice" || 
        m.path === "/inventory"
      );
    }
    return dashboardModules;
  }, [user]);
  
  const latestCashFlowStatement = useMemo(() => {
    if (cashFlowStatements && cashFlowStatements.length > 0) {
      return cashFlowStatements[0];
    }
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
    navigate("/auth");
  };

  const handleMainSearchSubmit = () => {
    if (!inputValue.trim()) return;
    toast({
      title: mode === "assistant" ? "AI Search" : "Automation Executed",
      description: inputValue.trim(),
    });
    setInputValue("");
  };

  const handleClearChat = async () => {
    try {
      const res = await apiRequest(API_ENDPOINTS.AI_CHAT_HISTORY, {
        method: "DELETE"
      });
      if (res.ok) {
        setChatMessages([
          { id: "1", role: "ai", content: "Hi there! I am your SHREE ANDAL AI Assistant. How can I help you automate tasks today?", timestamp: new Date() }
        ]);
        toast({ title: "Chat cleared", description: "History removed from database." });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: userText, timestamp: new Date() };
    const aiPlaceholderId = (Date.now() + 1).toString();
    const newAiMsgPlaceholder: ChatMessage = { id: aiPlaceholderId, role: "ai", content: "Thinking...", timestamp: new Date() };

    setChatMessages((prev) => [...prev, newUserMsg, newAiMsgPlaceholder]);
    setChatInput("");

    try { await apiRequest(API_ENDPOINTS.AI_CHAT_MESSAGE, { method: "POST", body: JSON.stringify({ role: "user", content: userText }) }); } catch (dbErr) { }

    try {
      const currentHistory = [...chatMessages, newUserMsg];
      const replyText = await callGemini(currentHistory);

      try { await apiRequest(API_ENDPOINTS.AI_CHAT_MESSAGE, { method: "POST", body: JSON.stringify({ role: "ai", content: replyText }) }); } catch (dbErr) { }

      setChatMessages((prev) => 
        prev.map(msg => msg.id === aiPlaceholderId ? { ...msg, content: replyText, timestamp: new Date() } : msg)
      );
    } catch (error: any) {
      setChatMessages((prev) => 
        prev.map(msg => msg.id === aiPlaceholderId ? { ...msg, content: "Error communicating with AI.", timestamp: new Date() } : msg)
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f8] font-sans text-[#333] overflow-hidden selection:bg-[#006aff]/20 selection:text-[#006aff]">
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 bg-[#111]/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Deep Navy Classic ERP Style */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[45] bg-[#1c2434] border-r border-[#111827] flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } ${sidebarOpen ? 'w-[260px]' : 'w-20'}`}
      >
        {/* Sidebar Header */}
        <div className="h-[60px] flex items-center px-4 border-b border-[#2d3748] shrink-0">
          <button 
            onClick={() => {
              if (window.innerWidth >= 1024) setSidebarOpen(!sidebarOpen);
              else setMobileSidebarOpen(false);
            }}
            className="w-8 h-8 bg-[#006aff] rounded flex items-center justify-center text-white font-bold text-[16px] mr-3 shrink-0 shadow-sm focus:outline-none"
          >
            S
          </button>
          
          {sidebarOpen && (
            <div className="flex flex-col justify-center overflow-hidden whitespace-nowrap min-w-0">
              <span className="font-bold text-[15px] tracking-tight text-white leading-none mb-1 truncate">SHREE ANDAL AI</span>
              <span className="text-[10px] text-[#8a99a8] uppercase tracking-wider font-semibold leading-none truncate">Books & Accounting</span>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="space-y-0.5 px-3">
            {filteredModules.map((module) => {
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
                  className={`w-full flex items-center px-3 py-2 rounded-[4px] transition-colors group ${
                    isActive 
                      ? 'bg-[#006aff] text-white' 
                      : 'text-[#8a99a8] hover:bg-[#2a3143] hover:text-white'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-[#8a99a8] group-hover:text-white'}`} />
                  {sidebarOpen && (
                    <>
                      <span className="ml-3 text-[13px] font-medium truncate">{module.title}</span>
                      {!isActive && <ChevronDown className="w-[14px] h-[14px] ml-auto opacity-0 group-hover:opacity-100 -rotate-90 transition-all shrink-0" />}
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
        <header className="h-[60px] bg-white border-b border-[#e4e5e7] flex items-center justify-between px-4 sm:px-6 z-10 shrink-0 sticky top-0">
          
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="p-1.5 -ml-1.5 text-[#555] hover:bg-[#f4f5f8] rounded lg:hidden flex-shrink-0">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative w-full max-w-[400px] flex items-center">
              <Search className="w-[15px] h-[15px] absolute left-3 text-[#999]" />
              <input 
                id="main-search-input"
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleMainSearchSubmit(); } }}
                placeholder="Search in your organization..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#f4f5f8] border border-transparent rounded-[4px] text-[13px] text-[#333] focus:outline-none focus:bg-white focus:border-[#006aff] transition-all placeholder:text-[#999] h-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 shrink-0">
            <button className="relative p-1.5 text-[#555] hover:text-[#222] hover:bg-[#f4f5f8] rounded transition-colors">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-[#f0483e] rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#e4e5e7] cursor-pointer group relative shrink-0">
               <div className="w-7 h-7 rounded-full bg-[#f2f8ff] border border-[#cce3ff] flex items-center justify-center text-[#006aff] font-bold text-[12px] shrink-0">
                  {loading ? "-" : profileInitial}
               </div>
               <div className="hidden md:flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold text-[#222] leading-none truncate max-w-[120px]">{loading ? "Loading..." : profileName}</span>
               </div>
               <ChevronDown className="hidden md:block w-4 h-4 text-[#999] shrink-0" />
               
               {/* Dropdown Menu */}
               <div className="absolute right-0 top-[120%] w-[250px] bg-white rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-[#e4e5e7] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-right">
                  <div className="p-3 border-b border-[#eee]">
                     <p className="text-[13px] font-bold text-[#222] truncate">{profileName}</p>
                     <p className="text-[11px] text-[#777] mt-0.5 truncate">{user?.email}</p>
                     <div className="flex flex-wrap gap-1.5 mt-2">
                       <div className="inline-block px-2 py-0.5 bg-[#e8f2ff] text-[#006aff] text-[10px] font-bold uppercase rounded-sm border border-[#cce3ff]">
                         {selectedPlanLabel} Plan
                       </div>
                       <div className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                         user?.role === "instore" 
                           ? "bg-[#fff8e1] text-[#f57c00] border-[#f57c00]/30" 
                           : "bg-[#e6f8ef] text-[#00b365] border-[#00b365]/30"
                       }`}>
                         {user?.role === "instore" ? "In-Store POS" : "Admin Portal"}
                       </div>
                     </div>
                  </div>
                  <div className="py-1">
                    <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-2 text-[13px] text-[#444] hover:bg-[#f4f5f8] hover:text-[#006aff] flex items-center gap-2 transition-colors">
                      <Settings className="w-[14px] h-[14px]" /> Account Settings
                    </button>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-[13px] text-[#f0483e] hover:bg-[#fde9e8] flex items-center gap-2 transition-colors">
                      <LogOut className="w-[14px] h-[14px]" /> Sign Out
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Analytics Area */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
            
            {/* Page Title & Period Selector */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[22px] font-bold text-[#111] tracking-tight truncate">Dashboard</h1>
                <p className="text-[13px] text-[#666] mt-0.5 truncate">Overview of your business financials.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12px] font-semibold text-[#555] uppercase tracking-wide">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full sm:w-[150px] text-[13px] font-semibold px-3 py-1.5 border border-[#ccc] rounded-sm text-[#222] bg-white hover:border-[#aaa] focus:border-[#006aff] focus:ring-1 focus:ring-[#006aff] transition-all outline-none cursor-pointer h-8"
                >
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-quarter">This Quarter</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
            </div>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              {dashboardStats.map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col justify-between group">
                  <div className="flex items-center gap-2.5 mb-3">
                    <stat.icon className={`w-[18px] h-[18px] ${stat.iconColor}`} />
                    <h3 className="text-[12px] font-semibold text-[#555] uppercase tracking-wide truncate">
                      {stat.title}
                    </h3>
                  </div>
                  <h2 className="text-[20px] font-bold text-[#111] tabular-nums truncate">
                    {stat.amount || "₹0.00"}
                  </h2>
                </div>
              ))}
            </div>

            {/* --- Charts Row 1 --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
              
              {/* Revenue Line Chart */}
              <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col min-w-0">
                <div className="px-5 py-3.5 border-b border-[#e4e5e7] flex justify-between items-center">
                  <h3 className="text-[14px] font-semibold text-[#222]">Income and Expense</h3>
                  <button className="text-[12px] text-[#006aff] font-medium hover:underline">View Report</button>
                </div>
                <div className="p-5 flex-1 w-full flex flex-col justify-center">
                  {!revenueLinePath ? (
                    <div className="flex-1 flex items-center justify-center text-[#999] text-[13px] font-medium py-12">
                      No data available for this period
                    </div>
                  ) : (
                    <>
                      <div className="relative flex-1 flex min-h-[160px]">
                        <div className="flex flex-col justify-between text-[11px] text-[#777] font-medium py-1 w-9 shrink-0">
                          <span>{formatYAxis(revenueMax)}</span>
                          <span>{formatYAxis(revenueMax * 0.75)}</span>
                          <span>{formatYAxis(revenueMax * 0.5)}</span>
                          <span>{formatYAxis(revenueMax * 0.25)}</span>
                          <span>0</span>
                        </div>
                        <div className="flex-1 relative border-b border-[#eee]">
                          <div className="absolute inset-0 flex flex-col justify-between py-1">
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-transparent"></div>
                          </div>
                          <svg className="absolute inset-0 w-full h-full pb-1" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d={revenueLinePath} fill="none" stroke="#006aff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#777] font-semibold uppercase tracking-wider pl-9 pt-3">
                        {revenueXLabels.map((lbl, idx) => (
                          <span key={idx} className={idx >= 3 ? "hidden sm:inline" : ""}>{lbl}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Cash Flow Overview */}
              <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col min-w-0">
                <div className="px-5 py-3.5 border-b border-[#e4e5e7]">
                  <h3 className="text-[14px] font-semibold text-[#222]">Cash Flow</h3>
                </div>
                <div className="p-5 flex-1 w-full flex flex-col justify-center">
                  {!cashFlowBars ? (
                    <div className="flex-1 flex items-center justify-center text-[#999] text-[13px] font-medium py-12">
                      No cash flow data
                    </div>
                  ) : (
                    <>
                      <div className="relative flex-1 flex min-h-[160px]">
                        <div className="flex flex-col justify-between text-[11px] text-[#777] font-medium py-1 w-9 shrink-0">
                          <span>{formatYAxis(cashFlowMax)}</span>
                          <span>{formatYAxis(cashFlowMax * 0.75)}</span>
                          <span>{formatYAxis(cashFlowMax * 0.5)}</span>
                          <span>{formatYAxis(cashFlowMax * 0.25)}</span>
                          <span>0</span>
                        </div>
                        <div className="flex-1 relative border-b border-[#eee]">
                          <div className="absolute inset-0 flex flex-col justify-between py-1">
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-[#f4f5f8]"></div>
                            <div className="h-px w-full bg-transparent"></div>
                          </div>
                          <div className="absolute inset-0 flex items-end justify-between px-3 pt-1">
                            {cashFlowBars.map((bar, i) => (
                              <div key={i} className="flex gap-1 w-[8%] h-full items-end pb-[1px] relative z-10">
                                <div className="bg-[#00b365] w-full rounded-t-sm transition-opacity hover:opacity-80" style={{ height: bar.inflowHeight }} title={`Inflow: ₹${bar.inflowVal}`}></div>
                                <div className="bg-[#f0483e] w-full rounded-t-sm transition-opacity hover:opacity-80" style={{ height: bar.outflowHeight }} title={`Outflow: ₹${bar.outflowVal}`}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#777] font-semibold uppercase tracking-wider pl-9 pt-3 mb-4">
                        {cashFlowXLabels.map((lbl, idx) => (
                          <span key={idx} className={idx >= 3 ? "hidden sm:inline" : ""}>{lbl}</span>
                        ))}
                      </div>
                      <div className="flex justify-center gap-5 text-[11px] text-[#555] font-semibold">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#00b365]"></span> Cash Inflow</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#f0483e]"></span> Cash Outflow</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Profit & Loss Summary */}
              <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col lg:col-span-2 xl:col-span-1 min-w-0">
                <div className="px-5 py-3.5 border-b border-[#e4e5e7]">
                  <h3 className="text-[14px] font-semibold text-[#222]">Profit and Loss</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center py-2.5 border-b border-[#f4f5f8]">
                    <span className="text-[13px] text-[#555]">Total Income</span>
                    <span className="text-[14px] font-semibold text-[#222] tabular-nums">
                      {plSummaryData.totalRevenue > 0 ? `₹${plSummaryData.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-[#f4f5f8]">
                    <span className="text-[13px] text-[#555]">Total Expenses</span>
                    <span className="text-[14px] font-semibold text-[#222] tabular-nums">
                      {plSummaryData.totalExpenses > 0 ? `₹${plSummaryData.totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 my-2">
                    <span className="text-[14px] font-bold text-[#222]">Net Profit</span>
                    <span className={`text-[18px] font-bold tabular-nums ${plSummaryData.netProfit >= 0 ? "text-[#00b365]" : "text-[#f0483e]"}`}>
                      {plSummaryData.netProfit < 0 ? "-" : ""}₹{Math.abs(plSummaryData.netProfit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-t border-[#f4f5f8]">
                    <span className="text-[13px] text-[#555]">Gross Margin</span>
                    <span className="text-[13px] font-semibold text-[#222] tabular-nums">
                      {plSummaryData.totalRevenue > 0 ? `${plSummaryData.grossProfitMargin.toFixed(2)}%` : "0.00%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Charts Row 2 --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
              
              {/* Recent Invoices Table */}
              <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col overflow-hidden lg:col-span-2 xl:col-span-3 min-w-0">
                <div className="px-5 py-3.5 border-b border-[#e4e5e7] flex justify-between items-center bg-[#f9fafd]">
                  <h3 className="text-[14px] font-semibold text-[#222]">Recent Invoices</h3>
                  <button className="w-[24px] h-[24px] bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  <table className="w-full text-left border-collapse min-w-[450px]">
                    <thead>
                      <tr className="border-b border-[#e4e5e7] bg-white">
                        <th className="py-2.5 px-5 font-semibold text-[#777] text-[11px] uppercase tracking-wide whitespace-nowrap w-32">Date</th>
                        <th className="py-2.5 px-5 font-semibold text-[#777] text-[11px] uppercase tracking-wide whitespace-nowrap">Invoice#</th>
                        <th className="py-2.5 px-5 font-semibold text-[#777] text-[11px] uppercase tracking-wide whitespace-nowrap">Customer Name</th>
                        <th className="py-2.5 px-5 font-semibold text-[#777] text-[11px] uppercase tracking-wide text-right whitespace-nowrap">Status</th>
                        <th className="py-2.5 px-5 font-semibold text-[#777] text-[11px] uppercase tracking-wide text-right whitespace-nowrap">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicesList.length > 0 ? (
                        invoicesList.map((inv, i) => (
                          <tr key={i} className="border-b border-[#f4f5f8] last:border-0 hover:bg-[#f9fafd] transition-colors cursor-pointer">
                            <td className="py-3 px-5 text-[13px] text-[#555] whitespace-nowrap">12 Aug 2026</td>
                            <td className="py-3 px-5 text-[13px] text-[#006aff] font-medium whitespace-nowrap">{inv.id}</td>
                            <td className="py-3 px-5 text-[13px] text-[#333] font-medium truncate max-w-[180px]">{inv.company}</td>
                            <td className="py-3 px-5 text-right whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-semibold uppercase tracking-wider ${inv.statusColor}`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-5 text-[13px] font-semibold text-[#222] text-right tabular-nums whitespace-nowrap">{inv.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[#999] text-[13px]">
                            No recent invoices found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Module records */}
              <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm lg:col-span-1 flex flex-col min-w-0">
                 <div className="px-5 py-3.5 border-b border-[#e4e5e7] bg-[#f9fafd]">
                    <h3 className="text-[14px] font-semibold text-[#222]">Records Summary</h3>
                 </div>
                 <div className="flex-1 overflow-y-auto divide-y divide-[#f4f5f8]">
                    {moduleRecordCounts.map((module) => (
                      <div key={module.label} className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-[#f9fafd] transition-colors cursor-pointer">
                        <p className="truncate text-[13px] font-medium text-[#444]">{module.label}</p>
                        <span className="text-[13px] font-semibold text-[#222] tabular-nums">{module.count}</span>
                      </div>
                    ))}
                 </div>
              </div>

            </div>

            {/* --- Charts Row 3: Financial Ratios --- */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm mb-6 flex flex-col min-w-0">
              <div className="px-5 py-3.5 border-b border-[#e4e5e7] bg-[#f9fafd]">
                <h3 className="text-[14px] font-semibold text-[#222]">Financial Ratios</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e4e5e7]">
                {financialRatios.length > 0 ? (
                  financialRatios.map((ratio, idx) => (
                     <div key={idx} className="p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:bg-[#f9fafd] transition-colors cursor-default">
                       <span className="text-[12px] font-semibold text-[#555] mb-1.5">{ratio.label}</span>
                       <span className="text-[18px] font-bold text-[#111] tabular-nums mb-2">{ratio.value}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] ${
                         ratio.status === "Good" ? "bg-[#e6f8ef] text-[#00b365] border border-[#00b365]/30" : "bg-[#fde9e8] text-[#f0483e] border border-[#f0483e]/30"
                       }`}>
                         {ratio.status}
                       </span>
                     </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-[#999] text-[13px]">
                    No financial ratios calculated yet.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-[12px] text-[#777] flex flex-col md:flex-row items-center justify-between border-t border-[#e4e5e7] mt-8">
              <p>© 2026 SHREE ANDAL AI Software Solutions. All rights reserved.</p>
              <div className="flex gap-4 mt-2 md:mt-0">
                <a href="#" className="hover:text-[#006aff]">Help</a>
                <a href="#" className="hover:text-[#006aff]">Privacy</a>
                <a href="#" className="hover:text-[#006aff]">Terms</a>
              </div>
            </footer>

          </div>
        </ScrollArea>

        {/* --- Floating AI Chat Button --- */}
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setIsAiChatOpen(true)}
            className="w-14 h-14 bg-[#006aff] rounded-full shadow-[0_4px_15px_rgba(0,106,255,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center relative border-2 border-white"
            title="Ask AI Assistant"
          >
            <Bot className="text-white w-6 h-6" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#f0483e] border-2 border-white rounded-full"></span>
          </button>
        </div>

      </main>

      {/* --- AI Chat Right-Side Panel --- */}
      
      {/* Background Overlay for mobile */}
      {isAiChatOpen && (
        <div 
          className="fixed inset-0 bg-[#111]/30 backdrop-blur-sm z-[55] sm:hidden transition-opacity"
          onClick={() => setIsAiChatOpen(false)} 
        />
      )}

      {/* The Chat Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-[-5px_0_30px_rgba(0,0,0,0.1)] z-[60] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-[#ddd] ${isAiChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-[#006aff] text-white shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
               <Bot className="w-5 h-5 text-white" />
             </div>
             <div>
                <h3 className="font-semibold text-[15px] leading-tight">SHREE ANDAL AI</h3>
                <p className="text-[11px] text-[#cce3ff] flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]"></span> Online
                </p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setChatViewMode(prev => prev === "chat" ? "history" : "chat")} 
              title={chatViewMode === "chat" ? "View history" : "Back to chat"}
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
            >
               <History className="w-[18px] h-[18px]" />
            </button>
            <button 
              onClick={() => setIsAiChatOpen(false)} 
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
            >
               <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {chatViewMode === "chat" ? (
          <>
            {/* Chat Messages Area */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f9fafd]">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-[4px] text-[13px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#006aff] text-white shadow-sm' 
                        : 'bg-white border border-[#e4e5e7] text-[#333] shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[#999] font-medium mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input Area */}
            <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-[#eee] shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your finances..."
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#ccc] rounded-[4px] text-[13px] focus:outline-none focus:border-[#006aff] focus:ring-1 focus:ring-[#006aff] transition-shadow placeholder:text-[#999]"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-1.5 w-8 h-8 rounded bg-[#006aff] text-white flex items-center justify-center hover:bg-[#005cdb] disabled:opacity-50 disabled:hover:bg-[#006aff] transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* History View Mode */
          <div className="flex-1 flex flex-col overflow-hidden bg-[#f9fafd]">
            <div className="px-5 py-3 border-b border-[#eee] bg-white flex items-center justify-between shrink-0">
              <span className="text-[13px] font-semibold text-[#222]">Chat History</span>
              <button 
                onClick={handleClearChat}
                className="text-[11px] font-medium text-[#f0483e] hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.filter(msg => msg.role === 'user').length === 0 ? (
                <div className="h-full flex items-center justify-center text-[#999] text-[13px]">
                  No past queries found
                </div>
              ) : (
                chatMessages.filter(msg => msg.role === 'user').map((msg, index) => (
                  <button
                    key={msg.id || index}
                    onClick={() => {
                      setChatInput(msg.content);
                      setChatViewMode("chat");
                    }}
                    className="w-full text-left p-3 bg-white border border-[#e4e5e7] rounded-[4px] hover:border-[#006aff] transition-colors flex items-start gap-3"
                  >
                    <History className="w-[14px] h-[14px] text-[#999] mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#333] truncate">{msg.content}</p>
                      <span className="text-[10px] text-[#888] block mt-0.5">
                        {msg.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;