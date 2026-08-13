import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
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
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Home,
  BookOpen,
  Receipt,
  BarChart2,
  Menu,
  X,
  Send,
  Bot,
  History,
  Download,
  Landmark,
  PieChart,
  Activity,
  RefreshCw
} from "lucide-react";

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
  icon: React.ElementType;
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

const emptyStats = [
  { title: "Total Receivables", amount: "", trend: "", isPositive: true, iconColor: "text-[#006aff]", icon: TrendingUp },
  { title: "Total Payables", amount: "", trend: "", isPositive: true, iconColor: "text-[#f0483e]", icon: Receipt },
  { title: "Net Profit", amount: "", trend: "", isPositive: true, iconColor: "text-[#00b365]", icon: BarChart2 },
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
const formatCurrency = (value: unknown) => `₹${toNumber(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// --- Main Component ---

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Period filtering & Raw Datasets States
  const [selectedPeriod, setSelectedPeriod] = useState<string>("last-month");
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [allPurchaseInvoices, setAllPurchaseInvoices] = useState<any[]>([]);
  const [allPayrolls, setAllPayrolls] = useState<any[]>([]);
  const [allBalanceSheets, setAllBalanceSheets] = useState<any[]>([]);
  const [allBookkeepingEntries, setAllBookkeepingEntries] = useState<any[]>([]);
  const [plGen, setPlGen] = useState<any>(null);
  const [cfGen, setCfGen] = useState<any>(null);

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
  const [bsSummary, setBsSummary] = useState({ assets: 0, liabilities: 0, equity: 0 });
  const [cashFlowStatements, setCashFlowStatements] = useState<any[]>([]);

  // AI Chat States
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", role: "ai", content: "Hi there! I am your SHREE ANDAL AI Assistant. How can I help you automate tasks today?", timestamp: new Date() }
  ]);
  const [chatViewMode, setChatViewMode] = useState<"chat" | "history">("chat");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatViewMode]);

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

  // Load Dashboard Data
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
        if (invoicesRes && invoicesRes.ok) {
          const parsed = await invoicesRes.json();
          if (parsed && parsed.invoices) setAllInvoices(parsed.invoices);
        }

        const purchasesRes = await apiRequest(`${API_BASE_URL}/purchase-invoice/all`).catch(() => null);
        if (purchasesRes && purchasesRes.ok) {
          const parsed = await purchasesRes.json();
          if (parsed && parsed.invoices) setAllPurchaseInvoices(parsed.invoices);
        }

        const payrollRes = await apiRequest(`${API_BASE_URL}/payroll/all`).catch(() => null);
        if (payrollRes && payrollRes.ok) {
          const parsed = await payrollRes.json();
          if (parsed) setAllPayrolls(parsed);
        }

        const balanceSheetsRes = await apiRequest(`${API_BASE_URL}/balance`).catch(() => null);
        if (balanceSheetsRes && balanceSheetsRes.ok) {
          const parsed = await balanceSheetsRes.json();
          if (parsed) setAllBalanceSheets(parsed);
        }

        const [statements, bookkeeping, plGenData, cfGenData] = await Promise.all([
          readJson(`${API_BASE_URL}/cashflow-statement/all`),
          readJson(`${API_BASE_URL}/bookkeeping/all`),
          readJson(`${API_BASE_URL}/profitloss/generate?period=${selectedPeriod}`),
          readJson(`${API_BASE_URL}/cashflow-statement/generate?period=${selectedPeriod}`)
        ]);

        if (plGenData) setPlGen(plGenData);
        if (cfGenData) setCfGen(cfGenData);
        const cashFlowStatementData = Array.isArray(statements) ? statements : [];
        const bookkeepingEntries = Array.isArray(bookkeeping?.entries) ? bookkeeping.entries : [];
        
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthCashFlowStatements = cashFlowStatementData.filter((statement: any) => {
          const createdAt = new Date(statement.createdAt);
          return !Number.isNaN(createdAt.getTime()) && createdAt >= lastMonthStart && createdAt < currentMonthStart;
        });

        setCashFlowStatements(lastMonthCashFlowStatements);
        setAllBookkeepingEntries(bookkeepingEntries);

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);

  // Update calculations whenever period or raw data changes
  useEffect(() => {
    const filteredInvoices = allInvoices.filter(inv => isDateInPeriod(inv.invoiceDate, selectedPeriod));
    const filteredPurchases = allPurchaseInvoices.filter(inv => isDateInPeriod(inv.createdAt || inv.billDate, selectedPeriod));

    const revenue = filteredInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const purchaseExpenses = filteredPurchases.reduce((sum, inv) => sum + (inv.total || 0), 0);

    const selectedPeriodBookkeeping = allBookkeepingEntries.filter(entry => isDateInPeriod(entry.date, selectedPeriod));
    const bkIncome = selectedPeriodBookkeeping.reduce((sum, entry) => entry.type === "income" ? sum + toNumber(entry.amount) : sum, 0);
    const bkExpense = selectedPeriodBookkeeping.reduce((sum, entry) => entry.type === "expense" ? sum + toNumber(entry.amount) : sum, 0);

    if (plGen && cfGen) {
      const netProf = plGen.netProfit || 0;
      setDashboardStats([
        { title: "Total Receivables", amount: cfGen.cashFlow?.receivables > 0 ? formatCurrency(cfGen.cashFlow.receivables) : (bkIncome > 0 ? formatCurrency(bkIncome) : "₹0.00"), trend: "", isPositive: true, hasData: true, iconColor: "text-[#006aff]", icon: TrendingUp },
        { title: "Total Payables", amount: cfGen.cashFlow?.payables > 0 ? formatCurrency(cfGen.cashFlow.payables) : (bkExpense > 0 ? formatCurrency(bkExpense) : "₹0.00"), trend: "", isPositive: true, hasData: true, iconColor: "text-[#f0483e]", icon: Receipt },
        { title: "Net Profit", amount: formatCurrency(netProf), trend: "", isPositive: netProf >= 0, hasData: netProf !== 0, iconColor: "text-[#00b365]", icon: BarChart2 },
        { title: "GST Payable", amount: (cfGen.cashFlow?.gstPayable && cfGen.cashFlow.gstPayable > 0) ? formatCurrency(cfGen.cashFlow.gstPayable) : "₹0.00", trend: "", isPositive: true, hasData: (cfGen.cashFlow?.gstPayable !== undefined && cfGen.cashFlow.gstPayable > 0), iconColor: "text-[#0288d1]", icon: Receipt },
      ]);

      setPlSummaryData({
        totalRevenue: plGen.totalRevenue || 0,
        totalExpenses: plGen.totalExpenses || 0,
        netProfit: netProf,
        grossProfitMargin: plGen.totalRevenue > 0 ? (((plGen.totalRevenue - (plGen.costOfMaterials || 0)) / plGen.totalRevenue) * 100) : 0,
        netProfitMargin: plGen.profitMargin || 0
      });
    } else {
      const fallbackProfit = bkIncome - bkExpense;
      setDashboardStats([
        { title: "Total Receivables", amount: bkIncome > 0 ? formatCurrency(bkIncome) : "₹0.00", trend: "", isPositive: true, hasData: true, iconColor: "text-[#006aff]", icon: TrendingUp },
        { title: "Total Payables", amount: bkExpense > 0 ? formatCurrency(bkExpense) : "₹0.00", trend: "", isPositive: true, hasData: true, iconColor: "text-[#f0483e]", icon: Receipt },
        { title: "Net Profit", amount: fallbackProfit !== 0 ? formatCurrency(fallbackProfit) : "₹0.00", trend: "", isPositive: fallbackProfit >= 0, hasData: fallbackProfit !== 0, iconColor: "text-[#00b365]", icon: BarChart2 },
        { title: "GST Payable", amount: "₹0.00", trend: "", isPositive: true, hasData: false, iconColor: "text-[#0288d1]", icon: Receipt },
      ]);

      setPlSummaryData({
        totalRevenue: bkIncome || revenue,
        totalExpenses: bkExpense || purchaseExpenses,
        netProfit: fallbackProfit,
        grossProfitMargin: revenue > 0 ? ((revenue - purchaseExpenses) / revenue) * 100 : 0,
        netProfitMargin: revenue > 0 ? (fallbackProfit / revenue) * 100 : 0
      });
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
    if (!matchingBS && allBalanceSheets.length > 0) matchingBS = allBalanceSheets[0];

    if (matchingBS) {
      const bsCurrentAssets = matchingBS.currentAssets || 0;
      const bsCurrentLiabilities = matchingBS.currentLiabilities || 0;
      const bsTotalAssets = matchingBS.totalAssets || 0;
      const bsTotalEquity = matchingBS.equity || 0;
      const bsTotalDebt = matchingBS.totalLiabilities || 0;
      
      setBsSummary({ assets: bsTotalAssets, liabilities: bsTotalDebt || bsCurrentLiabilities, equity: bsTotalEquity });

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
      const profVal = plSummaryData.netProfit || 0;
      const grossMargin = revenue ? ((revenue - purchaseExpenses) / revenue) * 100 : 0;
      const netMargin = revenue ? (profVal / revenue) * 100 : 0;
      const roe = bsTotalEquity ? (profVal / bsTotalEquity) * 100 : 0;

      setFinancialRatios([
        { label: "Current Ratio", value: currentRatio ? currentRatio.toFixed(2) : "0.00", status: currentRatio >= 1.5 ? "Good" : "Low" },
        { label: "Quick Ratio", value: quickRatio ? quickRatio.toFixed(2) : "0.00", status: quickRatio >= 1.0 ? "Good" : "Low" },
        { label: "Debt to Equity", value: debtToEquity ? debtToEquity.toFixed(2) : "0.00", status: debtToEquity <= 1.5 ? "Good" : "High" },
        { label: "Gross Margin", value: `${grossMargin.toFixed(2)}%`, status: "Good" },
        { label: "Net Margin", value: `${netMargin.toFixed(2)}%`, status: "Good" },
        { label: "ROE", value: `${roe.toFixed(2)}%`, status: "Good" },
      ]);
    } else {
      setBsSummary({ assets: 0, liabilities: 0, equity: 0 });
      setFinancialRatios([
        { label: "Current Ratio", value: "0.00", status: "Low" },
        { label: "Quick Ratio", value: "0.00", status: "Low" },
        { label: "Debt to Equity", value: "0.00", status: "Good" },
        { label: "Gross Margin", value: "0.00%", status: "Good" },
        { label: "Net Margin", value: "0.00%", status: "Good" },
        { label: "ROE", value: "0.00%", status: "Good" },
      ]);
    }

  }, [allInvoices, allPurchaseInvoices, allPayrolls, allBalanceSheets, selectedPeriod, allBookkeepingEntries]);

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

    const maxVal = Math.max(...buckets.map(b => Math.max(b.inflow, b.outflow)), 1000);
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
  
  // Safely Extract Cash Flow Statement Values
  const { cfsInflow, cfsOutflow, cfsNetFlow } = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    let net = 0;
    
    if (cashFlowStatements && cashFlowStatements.length > 0) {
      const stmt = cashFlowStatements[0];
      inflow = Number(stmt?.totalInflow || stmt?.inflow || stmt?.totalInflows || 0);
      outflow = Number(stmt?.totalOutflow || stmt?.outflow || stmt?.totalOutflows || 0);
      net = Number(stmt?.netCashFlow || stmt?.netFlow || (inflow - outflow) || 0);
    } else {
      const lastMonthBookkeeping = allBookkeepingEntries.filter(entry => isDateInPeriod(entry.date, "last-month"));
      inflow = lastMonthBookkeeping.reduce((sum, entry) => entry.type === "income" ? sum + toNumber(entry.amount) : sum, 0);
      outflow = lastMonthBookkeeping.reduce((sum, entry) => entry.type === "expense" ? sum + toNumber(entry.amount) : sum, 0);
      net = inflow - outflow;
    }
    
    return { cfsInflow: inflow, cfsOutflow: outflow, cfsNetFlow: net };
  }, [cashFlowStatements, allBookkeepingEntries]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
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

  const handleDownload = (reportType: string) => {
    let filename = `${reportType.toLowerCase().replace(/\s+/g, "_")}_report.txt`;
    let content = "";
    
    const nowStr = new Date().toLocaleString();
    content += `=========================================\n`;
    content += `  SHREE ANDAL AI - FINANCIAL REPORT      \n`;
    content += `  Report: ${reportType}                  \n`;
    content += `  Generated: ${nowStr}                   \n`;
    content += `  Period: ${selectedPeriod}              \n`;
    content += `=========================================\n\n`;

    if (reportType === "Cash Flow Prediction") {
      content += `Month\t\tActual Inflow\tActual Outflow\n`;
      cashFlowStatements.forEach(stmt => {
        const inflow = Number(stmt?.totalInflow || stmt?.inflow || 0);
        const outflow = Number(stmt?.totalOutflow || stmt?.outflow || 0);
        content += `${stmt.period || "Period"}\t₹${inflow.toLocaleString()}\t₹${outflow.toLocaleString()}\n`;
      });
      content += `\n* Forecast for Next Month (Est):\n`;
      content += `Inflow Estimate: +70% of Maximum Value\n`;
      content += `Outflow Estimate: +40% of Maximum Value\n`;
    } else if (reportType === "Profit and Loss") {
      content += `Total Income: ₹${plSummaryData.totalRevenue.toLocaleString("en-IN")}\n`;
      content += `Total Expenses: ₹${plSummaryData.totalExpenses.toLocaleString("en-IN")}\n`;
      content += `Gross Margin: ${plSummaryData.grossProfitMargin.toFixed(2)}%\n`;
      content += `Net Margin: ${plSummaryData.netProfitMargin.toFixed(2)}%\n`;
      content += `-----------------------------------------\n`;
      content += `Net Profit: ₹${plSummaryData.netProfit.toLocaleString("en-IN")}\n`;
    } else if (reportType === "Recent Invoices") {
      content += `Invoice ID\tCompany\tAmount\tStatus\n`;
      invoicesList.forEach(inv => {
        content += `${inv.id}\t${inv.company}\t${inv.amount}\t${inv.status}\n`;
      });
    } else if (reportType === "Cash Flow Statement") {
      const cfsInflow = Number(cfGen?.cashFlow?.inflow || 0);
      const cfsOutflow = Number(cfGen?.cashFlow?.outflow || 0);
      const cfsNetFlow = Number(cfGen?.cashFlow?.net || 0);
      content += `Operating Activities: +₹${(cfsInflow * 0.8).toLocaleString()}\n`;
      content += `Investing Activities: -₹${(cfsOutflow * 0.3).toLocaleString()}\n`;
      content += `Financing Activities: +₹${(cfsInflow * 0.2).toLocaleString()}\n`;
      content += `-----------------------------------------\n`;
      content += `Net Cash Flow: ₹${cfsNetFlow.toLocaleString()}\n`;
    } else if (reportType === "Financial Ratios") {
      financialRatios.forEach(ratio => {
        content += `${ratio.label}: ${ratio.value} (${ratio.status})\n`;
      });
    } else if (reportType === "Income and Expense") {
      content += `Overall Income: ₹${plSummaryData.totalRevenue.toLocaleString()}\n`;
      content += `Overall Expense: ₹${plSummaryData.totalExpenses.toLocaleString()}\n`;
    } else if (reportType === "Balance Sheet Overview") {
      content += `Total Assets: ₹${bsSummary.assets.toLocaleString()}\n`;
      content += `Total Liabilities: ₹${bsSummary.liabilities.toLocaleString()}\n`;
      content += `-----------------------------------------\n`;
      content += `Total Equity: ₹${bsSummary.equity.toLocaleString()}\n`;
    } else if (reportType === "Tax and GST Analysis") {
      const outputGst = plSummaryData.totalRevenue * 0.18;
      const inputItc = plSummaryData.totalExpenses * 0.18;
      const netGst = Math.max(0, outputGst - inputItc);
      content += `Output GST (18% on revenue): ₹${outputGst.toLocaleString()}\n`;
      content += `Input ITC (18% on expenses): ₹${inputItc.toLocaleString()}\n`;
      content += `-----------------------------------------\n`;
      content += `Net GST Payable: ₹${netGst.toLocaleString()}\n`;
    } else {
      content += `No detailed data available.`;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `Successfully downloaded ${filename}`,
    });
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
    <div className="flex flex-col h-screen bg-[#f4f5f8] font-sans text-[#333] overflow-hidden selection:bg-[#006aff]/20 selection:text-[#006aff]">
      
      {/* Top Header & Navigation Container */}
      <header className="h-[60px] bg-white border-b border-[#e4e5e7] flex items-center justify-between px-6 z-20 shrink-0 sticky top-0 shadow-sm">
        
        {/* Left Side: Brand Logo & Nav */}
        <div className="flex items-center gap-10 h-full">
          
          {/* Brand Logo */}
          <div className="flex flex-col justify-center select-none">
            <span className="font-bold text-[16px] tracking-tight text-[#006aff] leading-none mb-1">
              SHREE ANDAL AI
            </span>
            <span className="text-[10px] text-[#555] uppercase tracking-wider font-bold leading-none">
              Books & Accounting
            </span>
          </div>

          {/* Horizontal Navigation */}
          <nav className="hidden lg:flex items-center gap-6 h-full">
            <button onClick={() => navigate("/inventory")} className="text-[14px] font-medium text-[#333] hover:text-[#006aff] transition-colors h-full flex items-center">Inventory</button>
            <button onClick={() => navigate("/invoice")} className="text-[14px] font-medium text-[#333] hover:text-[#006aff] transition-colors h-full flex items-center">Invoice</button>
            <button onClick={() => navigate("/bookkeeping")} className="text-[14px] font-medium text-[#333] hover:text-[#006aff] transition-colors h-full flex items-center">Bookkeeping</button>

            {/* Dropdown for All Products */}
            <div className="relative group flex items-center h-full">
              <div className="flex items-center gap-1 cursor-pointer text-[14px] font-medium text-[#333] group-hover:text-[#006aff] transition-colors h-full">
                All Products <ChevronDown className="w-4 h-4 text-[#777] group-hover:text-[#006aff] transition-transform" />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-[100%] left-0 w-[260px] bg-white rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-[#e4e5e7] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-left z-50">
                <div className="py-2 max-h-[400px] overflow-y-auto">
                  {filteredModules
                    .filter(m => !["/inventory", "/invoice", "/bookkeeping", "/"].includes(m.path))
                    .map(module => {
                      const Icon = module.icon;
                      return (
                        <button
                          key={module.path}
                          onClick={() => navigate(module.path)}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-[#444] hover:bg-[#f4f5f8] hover:text-[#006aff] flex items-center gap-3 transition-colors"
                        >
                          <Icon className="w-4 h-4 shrink-0 text-[#777]" />
                          <span className="truncate">{module.title}</span>
                        </button>
                      )
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile menu trigger */}
          <button onClick={() => setMobileSidebarOpen(true)} className="p-1.5 text-[#555] hover:bg-[#f4f5f8] rounded lg:hidden flex-shrink-0 ml-auto">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side: User Profile */}
        <div className="flex items-center h-full">
          <div className="flex items-center gap-2.5 pl-4 cursor-pointer group relative h-full shrink-0">
             <div className="w-8 h-8 rounded-full bg-[#f2f8ff] border border-[#cce3ff] flex items-center justify-center text-[#006aff] font-bold text-[14px] shrink-0">
                {loading ? "-" : profileInitial}
             </div>
             <div className="hidden md:flex flex-col min-w-0">
                <span className="text-[14px] font-semibold text-[#222] leading-none truncate max-w-[120px]">{loading ? "Loading..." : profileName}</span>
             </div>
             <ChevronDown className="hidden md:block w-4 h-4 text-[#999] shrink-0" />
             
             {/* Profile Dropdown Menu */}
             <div className="absolute right-0 top-[100%] w-[250px] bg-white rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-[#e4e5e7] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-right">
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

      {/* Mobile Sidebar Overlay & Nav */}
      {mobileSidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 bg-[#111]/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Nav Menu (Sliding from left) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[45] w-[260px] bg-white border-r border-[#e4e5e7] flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="h-[60px] flex items-center px-4 border-b border-[#e4e5e7] shrink-0 justify-between">
          <div className="flex flex-col justify-center">
            <span className="font-bold text-[15px] tracking-tight text-[#006aff] leading-none mb-1 truncate">SHREE ANDAL AI</span>
            <span className="text-[10px] text-[#555] uppercase tracking-wider font-bold leading-none truncate">Books & Accounting</span>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 text-[#555] hover:bg-[#f4f5f8] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ScrollArea className="flex-1 py-3">
          <nav className="space-y-0.5 px-3">
            {filteredModules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.path}
                  onClick={() => {
                    navigate(module.path);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[14px] text-[#444] hover:bg-[#f4f5f8] hover:text-[#006aff] flex items-center gap-3 transition-colors rounded"
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#777]" />
                  <span className="truncate font-medium">{module.title}</span>
                </button>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative w-full">
        
        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          {/* Page Title & Period Selector */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pt-4">
            <div>
              <h1 className="text-[26px] font-bold text-[#111] tracking-tight">Dashboard</h1>
              <p className="text-[14px] text-[#666] mt-1">Overview of your business financials.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[12px] font-semibold text-[#555] uppercase tracking-wide">Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full sm:w-[160px] text-[14px] font-medium px-3 py-2 border border-[#ccc] rounded text-[#222] bg-white hover:border-[#aaa] focus:border-[#006aff] focus:ring-1 focus:ring-[#006aff] transition-all outline-none cursor-pointer"
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </select>
            </div>
          </div>

          {/* --- Stats Grid (4 columns to fit fully visible text) --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {dashboardStats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col justify-between group">
                <div className="flex items-center gap-3 mb-4">
                  <stat.icon className={`w-[20px] h-[20px] ${stat.iconColor}`} />
                  <h3 className="text-[13px] font-semibold text-[#555] uppercase tracking-wide">
                    {stat.title}
                  </h3>
                </div>
                <h2 className="text-[24px] font-bold text-[#111] tabular-nums">
                  {stat.amount || "₹0.00"}
                </h2>
              </div>
            ))}
          </div>

          {/* --- Row 1: Cash Flow Prediction & Profit & Loss --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Cash Flow Prediction (Spans 2 columns) */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm lg:col-span-2 flex flex-col min-w-0 relative overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e4e5e7] flex justify-between items-center bg-[#f9fafd]">
                <h3 className="text-[15px] font-bold text-[#222] flex items-center gap-2">
                  <Activity className="w-[18px] h-[18px] text-[#006aff]" /> 
                  Cash Flow Prediction
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] bg-[#e8f2ff] text-[#006aff] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#cce3ff] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Forecast Active
                  </span>
                  <button onClick={() => handleDownload("Cash Flow Prediction")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 w-full flex flex-col justify-center">
                {!cashFlowBars ? (
                  <div className="flex-1 flex items-center justify-center text-[#999] text-[14px] font-medium py-16">
                    No cash flow data available to predict
                  </div>
                ) : (
                  <>
                    <div className="relative flex-1 flex min-h-[200px]">
                      <div className="flex flex-col justify-between text-[12px] text-[#777] font-medium py-1 w-12 shrink-0">
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
                        <div className="absolute inset-0 flex items-end justify-between px-4 pt-1">
                          {cashFlowBars.map((bar, i) => (
                            <div key={i} className="flex gap-1.5 w-[8%] h-full items-end pb-[1px] relative z-10">
                              <div className="bg-[#00b365] w-full rounded-t-sm transition-opacity hover:opacity-80" style={{ height: bar.inflowHeight }} title={`Inflow: ₹${bar.inflowVal}`}></div>
                              <div className="bg-[#f0483e] w-full rounded-t-sm transition-opacity hover:opacity-80" style={{ height: bar.outflowHeight }} title={`Outflow: ₹${bar.outflowVal}`}></div>
                            </div>
                          ))}
                          {/* AI Prediction Dummy Bar */}
                          <div className="flex gap-1.5 w-[8%] h-full items-end pb-[1px] relative z-10 opacity-60">
                              <div className="bg-[#00b365] w-full rounded-t-sm border border-dashed border-[#00b365] bg-opacity-40" style={{ height: "70%" }} title="Predicted Inflow"></div>
                              <div className="bg-[#f0483e] w-full rounded-t-sm border border-dashed border-[#f0483e] bg-opacity-40" style={{ height: "40%" }} title="Predicted Outflow"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#777] font-semibold uppercase tracking-wider pl-12 pt-4 mb-5">
                      {cashFlowXLabels.map((lbl, idx) => (
                        <span key={idx} className={idx >= 3 ? "hidden sm:inline" : ""}>{lbl}</span>
                      ))}
                      <span className="text-[#006aff]">Next Mo (Est)</span>
                    </div>
                    <div className="flex justify-center gap-6 text-[12px] text-[#555] font-semibold">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#00b365]"></span> Actual Inflow</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#f0483e]"></span> Actual Outflow</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm border border-dashed border-[#00b365] bg-transparent"></span> Predicted</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profit & Loss Summary (Spans 1 column) */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col lg:col-span-1 min-w-0">
              <div className="px-6 py-4 border-b border-[#e4e5e7] bg-[#f9fafd] flex justify-between items-center">
                <h3 className="text-[15px] font-bold text-[#222]">Profit and Loss</h3>
                <button onClick={() => handleDownload("Profit and Loss")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center py-3 border-b border-[#f4f5f8]">
                  <span className="text-[14px] text-[#555]">Total Income</span>
                  <span className="text-[15px] font-semibold text-[#222] tabular-nums">
                    {plSummaryData.totalRevenue > 0 ? `₹${plSummaryData.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#f4f5f8]">
                  <span className="text-[14px] text-[#555]">Total Expenses</span>
                  <span className="text-[15px] font-semibold text-[#222] tabular-nums">
                    {plSummaryData.totalExpenses > 0 ? `₹${plSummaryData.totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-5 my-2">
                  <span className="text-[16px] font-bold text-[#222]">Net Profit</span>
                  <span className={`text-[22px] font-bold tabular-nums ${plSummaryData.netProfit >= 0 ? "text-[#00b365]" : "text-[#f0483e]"}`}>
                    {plSummaryData.netProfit < 0 ? "-" : ""}₹{Math.abs(plSummaryData.netProfit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-[#f4f5f8]">
                  <span className="text-[14px] text-[#555]">Gross Margin</span>
                  <span className="text-[15px] font-semibold text-[#222] tabular-nums">
                    {plSummaryData.totalRevenue > 0 ? `${plSummaryData.grossProfitMargin.toFixed(2)}%` : "0.00%"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Row 2: Recent Invoices & Cash Flow Statement --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Recent Invoices Table (Spans 2 columns) */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col overflow-hidden lg:col-span-2 min-w-0">
              <div className="px-6 py-4 border-b border-[#e4e5e7] flex justify-between items-center bg-[#f9fafd]">
                <h3 className="text-[15px] font-bold text-[#222]">Recent Invoices</h3>
                <button onClick={() => handleDownload("Recent Invoices")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#e4e5e7] bg-white">
                      <th className="py-3 px-6 font-semibold text-[#777] text-[12px] uppercase tracking-wide whitespace-nowrap w-36">Date</th>
                      <th className="py-3 px-6 font-semibold text-[#777] text-[12px] uppercase tracking-wide whitespace-nowrap">Invoice#</th>
                      <th className="py-3 px-6 font-semibold text-[#777] text-[12px] uppercase tracking-wide whitespace-nowrap">Customer Name</th>
                      <th className="py-3 px-6 font-semibold text-[#777] text-[12px] uppercase tracking-wide text-right whitespace-nowrap">Status</th>
                      <th className="py-3 px-6 font-semibold text-[#777] text-[12px] uppercase tracking-wide text-right whitespace-nowrap">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesList.length > 0 ? (
                      invoicesList.map((inv, i) => (
                        <tr key={i} className="border-b border-[#f4f5f8] last:border-0 hover:bg-[#f9fafd] transition-colors cursor-pointer">
                          <td className="py-4 px-6 text-[14px] text-[#555] whitespace-nowrap">12 Aug 2026</td>
                          <td className="py-4 px-6 text-[14px] text-[#006aff] font-medium whitespace-nowrap">{inv.id}</td>
                          <td className="py-4 px-6 text-[14px] text-[#333] font-medium truncate max-w-[200px]">{inv.company}</td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${inv.statusColor}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[14px] font-bold text-[#222] text-right tabular-nums whitespace-nowrap">{inv.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-[#999] text-[14px]">
                          No recent invoices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cash Flow Statement (Spans 1 column) */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm lg:col-span-1 flex flex-col min-w-0">
               <div className="px-6 py-4 border-b border-[#e4e5e7] bg-[#f9fafd] flex justify-between items-center">
                  <h3 className="text-[15px] font-bold text-[#222]">Cash Flow Statement</h3>
                  <button onClick={() => handleDownload("Cash Flow Statement")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
               </div>
               <div className="p-6 flex-1 flex flex-col justify-center gap-5">
                  <div className="flex justify-between items-center pb-3 border-b border-[#f4f5f8]">
                     <span className="text-[14px] text-[#555]">Operating Activities</span>
                     <span className="text-[15px] font-semibold text-[#00b365]">+{formatCurrency(cfsInflow * 0.8)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-[#f4f5f8]">
                     <span className="text-[14px] text-[#555]">Investing Activities</span>
                     <span className="text-[15px] font-semibold text-[#f0483e]">{formatCurrency(cfsOutflow * 0.3)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-[#f4f5f8]">
                     <span className="text-[14px] text-[#555]">Financing Activities</span>
                     <span className="text-[15px] font-semibold text-[#00b365]">+{formatCurrency(cfsInflow * 0.2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                     <span className="text-[16px] font-bold text-[#222]">Net Cash Flow</span>
                     <span className={`text-[18px] font-bold tabular-nums ${cfsNetFlow >= 0 ? "text-[#006aff]" : "text-[#f0483e]"}`}>
                       {formatCurrency(cfsNetFlow)}
                     </span>
                  </div>
               </div>
            </div>

          </div>

          {/* --- Row 3: Financial Ratios & Income / Expense --- */}
          <div className="flex flex-col gap-6 mb-8">
            
            {/* Financial Ratios block */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col min-w-0">
              <div className="px-6 py-4 border-b border-[#e4e5e7] bg-[#f9fafd] flex justify-between items-center">
                <h3 className="text-[15px] font-bold text-[#222]">Financial Ratios</h3>
                <button onClick={() => handleDownload("Financial Ratios")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e4e5e7]">
                {financialRatios.length > 0 ? (
                  financialRatios.map((ratio, idx) => (
                      <div key={idx} className="p-5 flex flex-col items-center justify-center text-center hover:bg-[#f9fafd] transition-colors cursor-default">
                        <span className="text-[13px] font-semibold text-[#555] mb-2">{ratio.label}</span>
                        <span className="text-[22px] font-bold text-[#111] tabular-nums mb-3">{ratio.value}</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-[4px] ${
                          ratio.status === "Good" ? "bg-[#e6f8ef] text-[#00b365] border border-[#00b365]/30" : "bg-[#fde9e8] text-[#f0483e] border border-[#f0483e]/30"
                        }`}>
                          {ratio.status}
                        </span>
                      </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center text-[#999] text-[14px]">
                    No financial ratios calculated yet.
                  </div>
                )}
              </div>
            </div>

            {/* Income & Expense block (Full Width SVG line chart) */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col min-w-0">
              <div className="px-6 py-4 border-b border-[#e4e5e7] flex justify-between items-center bg-[#f9fafd]">
                <h3 className="text-[15px] font-bold text-[#222]">Income and Expense</h3>
                <button onClick={() => handleDownload("Income and Expense")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex-1 w-full flex flex-col justify-center">
                {!revenueLinePath ? (
                  <div className="flex-1 flex items-center justify-center text-[#999] text-[14px] font-medium py-16">
                    No data available for this period
                  </div>
                ) : (
                  <>
                    <div className="relative flex-1 flex min-h-[220px]">
                      <div className="flex flex-col justify-between text-[12px] text-[#777] font-medium py-1 w-12 shrink-0">
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
                    <div className="flex justify-between text-[11px] text-[#777] font-semibold uppercase tracking-wider pl-12 pt-4">
                      {revenueXLabels.map((lbl, idx) => (
                        <span key={idx} className={idx >= 3 ? "hidden sm:inline" : ""}>{lbl}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* --- Row 4: Balance Sheet & Tax / GST Analysis --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Balance Sheet */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col min-w-0">
               <div className="px-6 py-4 border-b border-[#e4e5e7] bg-[#f9fafd] flex justify-between items-center">
                  <h3 className="text-[15px] font-bold text-[#222] flex items-center gap-2">
                     <Landmark className="w-4 h-4 text-[#555]" /> Balance Sheet Overview
                  </h3>
                  <button onClick={() => handleDownload("Balance Sheet Overview")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
               </div>
               <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-center p-4 bg-[#f9fafd] rounded border border-[#e4e5e7]">
                     <span className="text-[14px] font-semibold text-[#555]">Total Assets</span>
                     <span className="text-[16px] font-bold text-[#222] tabular-nums">{formatCurrency(bsSummary.assets)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#f9fafd] rounded border border-[#e4e5e7]">
                     <span className="text-[14px] font-semibold text-[#555]">Total Liabilities</span>
                     <span className="text-[16px] font-bold text-[#222] tabular-nums">{formatCurrency(bsSummary.liabilities)}</span>
                  </div>
                  <div className="flex justify-between items-center p-5 mt-3 bg-[#e8f2ff] rounded border border-[#cce3ff]">
                     <span className="text-[16px] font-bold text-[#006aff]">Total Equity</span>
                     <span className="text-[20px] font-bold text-[#006aff] tabular-nums">{formatCurrency(bsSummary.equity)}</span>
                  </div>
               </div>
            </div>

            {/* Tax & GST Analysis */}
            <div className="bg-white rounded-[4px] border border-[#e4e5e7] shadow-sm flex flex-col min-w-0">
               <div className="px-6 py-4 border-b border-[#e4e5e7] bg-[#f9fafd] flex justify-between items-center">
                  <h3 className="text-[15px] font-bold text-[#222] flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-[#555]" /> Tax & GST Analysis
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] bg-[#e6f8ef] text-[#00b365] px-2.5 py-1 rounded uppercase font-bold tracking-wide border border-[#00b365]/30">Compliant</span>
                    <button onClick={() => handleDownload("Tax and GST Analysis")} className="w-8 h-8 bg-white border border-[#ccc] rounded flex items-center justify-center text-[#555] hover:border-[#006aff] hover:text-[#006aff] transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col gap-5">
                  <div className="flex gap-4">
                     <div className="flex-1 p-5 border border-[#e4e5e7] rounded bg-[#f9fafd]">
                        <p className="text-[12px] text-[#777] font-semibold uppercase tracking-wide mb-1.5">Output GST</p>
                        <p className="text-[20px] font-bold text-[#222] tabular-nums">
                          {formatCurrency(plSummaryData.totalRevenue * 0.18)}
                        </p>
                     </div>
                     <div className="flex-1 p-5 border border-[#e4e5e7] rounded bg-[#f9fafd]">
                        <p className="text-[12px] text-[#777] font-semibold uppercase tracking-wide mb-1.5">Input ITC</p>
                        <p className="text-[20px] font-bold text-[#00b365] tabular-nums">
                          {formatCurrency(plSummaryData.totalExpenses * 0.18)}
                        </p>
                     </div>
                  </div>
                  <div className="flex justify-between items-center p-5 mt-2 bg-[#fdf2f2] rounded border border-[#fbd4d4]">
                     <span className="text-[16px] font-bold text-[#f0483e]">Net GST Payable</span>
                     <span className="text-[20px] font-bold text-[#f0483e] tabular-nums">
                       {formatCurrency(Math.max(0, (plSummaryData.totalRevenue * 0.18) - (plSummaryData.totalExpenses * 0.18)))}
                     </span>
                  </div>
               </div>
            </div>

          </div>

          {/* Footer */}
          <footer className="py-8 text-[13px] text-[#777] flex flex-col md:flex-row items-center justify-between border-t border-[#e4e5e7] mt-10">
            <p>©️ 2026 SHREE ANDAL AI Software Solutions. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#006aff] transition-colors">Help</a>
              <a href="#" className="hover:text-[#006aff] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#006aff] transition-colors">Terms</a>
            </div>
          </footer>

        </div>

        {/* --- Floating AI Chat Button --- */}
        <div className="fixed bottom-8 right-8 z-40">
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