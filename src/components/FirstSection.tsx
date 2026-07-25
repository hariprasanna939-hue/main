import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Package,
  Mic,
  TrendingUp,
  IndianRupee,
  ArrowRight,
  CheckCircle,
  ReceiptText,
  AlertTriangle,
  Inbox,
  BarChart2,
  ShoppingCart,
} from "lucide-react";

// ─── Unique Right-Panel Visuals ────────────────────────────────────────────────

const NavigationVisual = () => (
  <div className="flex h-full gap-4">
    {/* Sidebar */}
    <div className="flex w-40 shrink-0 flex-col gap-1 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Menu</p>
      {[
        { icon: Inbox, label: "Dashboard", active: true },
        { icon: ReceiptText, label: "Invoices", active: false },
        { icon: BarChart2, label: "Reports", active: false },
        { icon: ShoppingCart, label: "Inventory", active: false },
        { icon: BarChart3, label: "GST", active: false },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            item.active
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <item.icon className="h-3.5 w-3.5 shrink-0" />
          {item.label}
        </motion.div>
      ))}
    </div>
    {/* Content area */}
    <div className="flex flex-1 flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Today Revenue</p>
          <p className="text-2xl font-bold text-slate-900">₹1,24,500</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
        </div>
      </motion.div>
      {[{ label: "GST Filing", status: "Ready", color: "emerald" }, { label: "Pending Invoices", status: "3", color: "amber" }, { label: "Stock Alert", status: "2 items", color: "rose" }].map((row, i) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
          className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm"
        >
          <p className="text-xs font-semibold text-slate-700">{row.label}</p>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            row.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
            row.color === "amber" ? "bg-amber-100 text-amber-700" :
            "bg-rose-100 text-rose-600"
          }`}>{row.status}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const FinancialClarityVisual = () => {
  const segments = [
    { label: "Revenue", value: 52, color: "#22c55e" },
    { label: "Expenses", value: 28, color: "#f43f5e" },
    { label: "Profit", value: 20, color: "#0ea5e9" },
  ];
  const total = 360;
  let offset = 0;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="relative flex h-52 w-52 items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
          {segments.map((seg, i) => {
            const deg = (seg.value / 100) * total;
            const arc = `M 50 50 L ${50 + 45 * Math.cos((offset * Math.PI) / 180)} ${50 + 45 * Math.sin((offset * Math.PI) / 180)}`;
            const endAngle = offset + deg;
            const largeArc = deg > 180 ? 1 : 0;
            const x1 = 50 + 45 * Math.cos((offset * Math.PI) / 180);
            const y1 = 50 + 45 * Math.sin((offset * Math.PI) / 180);
            const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);
            const path = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;
            offset += deg;
            return (
              <motion.path
                key={seg.label}
                d={path}
                fill={seg.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              />
            );
          })}
          <circle cx="50" cy="50" r="28" fill="white" />
        </svg>
        <div className="relative text-center">
          <p className="text-2xl font-bold text-slate-900">₹84K</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Net Profit</p>
        </div>
      </div>
      <div className="flex w-full gap-3">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex flex-1 flex-col items-center rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <div className="mb-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <p className="text-xs font-bold text-slate-800">{seg.value}%</p>
            <p className="text-[10px] text-slate-500">{seg.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const InvoicingVisual = () => (
  <div className="flex h-full flex-col gap-3">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax Invoice</p>
          <p className="text-sm font-bold text-slate-900">#INV-2024-0847</p>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700"
        >
          GST Auto-applied ✓
        </motion.span>
      </div>
      <div className="space-y-2">
        {[
          { item: "Accounting Software License", qty: 1, amount: "₹12,000" },
          { item: "GST Setup & Training", qty: 1, amount: "₹5,000" },
        ].map((row, i) => (
          <motion.div
            key={row.item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
          >
            <p className="text-[11px] font-medium text-slate-700">{row.item}</p>
            <p className="text-[11px] font-bold text-slate-900">{row.amount}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <div className="grid grid-cols-3 gap-2">
          {[{ label: "CGST 9%", val: "₹1,530" }, { label: "SGST 9%", val: "₹1,530" }, { label: "Total", val: "₹20,060" }].map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`rounded-xl p-2 text-center ${i === 2 ? "bg-slate-950" : "bg-slate-100"}`}
            >
              <p className={`text-[9px] font-semibold uppercase tracking-wide ${i === 2 ? "text-white/60" : "text-slate-500"}`}>{r.label}</p>
              <p className={`text-xs font-bold ${i === 2 ? "text-white" : "text-slate-900"}`}>{r.val}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-4 py-2.5"
    >
      <CheckCircle className="h-4 w-4 text-sky-600" />
      <p className="text-xs font-semibold text-sky-700">IGST automatically switched for interstate billing</p>
    </motion.div>
  </div>
);

const StockVisual = () => {
  const items = [
    { name: "Laptop Stand", stock: 24, max: 50, status: "ok" },
    { name: "USB-C Cables", stock: 6, max: 100, status: "low" },
    { name: "Wireless Mouse", stock: 38, max: 60, status: "ok" },
    { name: "HDMI Adapter", stock: 3, max: 40, status: "critical" },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total SKUs Tracked</p>
          <p className="text-2xl font-bold text-slate-900">248</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-600">2 Critical</span>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-600">1 Low</span>
        </div>
      </div>
      {items.map((item, i) => {
        const pct = Math.round((item.stock / item.max) * 100);
        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-800">{item.name}</p>
              <span className={`text-[10px] font-bold ${item.status === "ok" ? "text-emerald-600" : item.status === "low" ? "text-amber-600" : "text-rose-600"}`}>
                {item.stock} / {item.max}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                className={`h-full rounded-full ${item.status === "ok" ? "bg-emerald-500" : item.status === "low" ? "bg-amber-500" : "bg-rose-500"}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const AiAssistVisual = () => {
  const chats = [
    { from: "user", text: "Show GST report for June", delay: 0.2 },
    { from: "ai", text: "Generating your GSTR-3B for June 2024...", delay: 0.7 },
    { from: "user", text: "Create invoice for Ravi Traders ₹45,000", delay: 1.3 },
    { from: "ai", text: "Invoice #INV-0849 created with CGST + SGST applied ✓", delay: 1.9 },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Waveform */}
      <div className="flex items-center justify-center gap-1 rounded-2xl border border-slate-100 bg-slate-950 py-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: ["6px", `${12 + Math.random() * 24}px`, "6px"] }}
            transition={{ duration: 0.8 + Math.random() * 0.6, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
            className="w-1.5 rounded-full bg-sky-400"
            style={{ minHeight: "6px" }}
          />
        ))}
      </div>
      {/* Chat */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        {chats.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: msg.delay, duration: 0.35 }}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs font-medium ${
              msg.from === "user"
                ? "bg-slate-950 text-white"
                : "border border-slate-100 bg-slate-50 text-slate-700"
            }`}>
              {msg.from === "ai" && <span className="mr-1.5 text-sky-500">✦</span>}
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CashForecastVisual = () => {
  const points = [38, 45, 42, 55, 60, 58, 72, 68, 80, 85, 90, 95];
  const max = Math.max(...points);
  const w = 100 / (points.length - 1);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * w} ${100 - (p / max) * 90}`).join(" ");
  const areaD = `${pathD} L ${(points.length - 1) * w} 100 L 0 100 Z`;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cash Flow Forecast</p>
          <p className="text-2xl font-bold text-emerald-600">+₹2.4L</p>
          <p className="text-[11px] font-medium text-slate-500">Predicted next 30 days</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrendingUp className="h-10 w-10 text-emerald-400" />
        </motion.div>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">12-Month Trend</p>
        <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" className="h-28 w-full">
          <defs>
            <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={areaD} fill="url(#cashGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
          <motion.path
            d={pathD}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </svg>
        <div className="mt-2 flex justify-between text-[9px] font-medium text-slate-400">
          {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[{ label: "Inflow", val: "₹5.8L", up: true }, { label: "Outflow", val: "₹3.4L", up: false }, { label: "Surplus", val: "₹2.4L", up: true }].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-center shadow-sm"
          >
            <p className={`text-sm font-bold ${s.up ? "text-emerald-600" : "text-rose-500"}`}>{s.val}</p>
            <p className="text-[9px] text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PricingVisual = () => {
  const plans = [
    { name: "Monthly", price: "₹999", period: "/mo", highlight: false },
    { name: "Annual", price: "₹749", period: "/mo", highlight: false },
    { name: "Lifetime", price: "₹14,999", period: " once", highlight: true },
  ];
  const feats = ["Bookkeeping", "GST Filing", "Inventory", "AI Commands", "All Reports"];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className={`rounded-2xl border p-4 text-center ${plan.highlight ? "border-slate-950 bg-slate-950 shadow-lg" : "border-slate-100 bg-white shadow-sm"}`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-wider ${plan.highlight ? "text-white/50" : "text-slate-400"}`}>{plan.name}</p>
            <p className={`mt-1 text-xl font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>{plan.price}</p>
            <p className={`text-[10px] ${plan.highlight ? "text-white/40" : "text-slate-400"}`}>{plan.period}</p>
            {plan.highlight && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="mt-2 inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white"
              >
                BEST VALUE
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">All Plans Include</p>
        <div className="space-y-2">
          {feats.map((feat, i) => (
            <motion.div
              key={feat}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2.5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 350 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100"
              >
                <CheckCircle className="h-3 w-3 text-emerald-600" />
              </motion.div>
              <p className="text-xs font-medium text-slate-700">{feat}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const visuals = [
  NavigationVisual,
  FinancialClarityVisual,
  InvoicingVisual,
  StockVisual,
  AiAssistVisual,
  CashForecastVisual,
  PricingVisual,
];

// ─── Feature Data ──────────────────────────────────────────────────────────────

const features = [
  {
    id: "navigation",
    tab: "Simple Navigation",
    icon: LayoutDashboard,
    problem: "Traditional accounting software often requires users to move through multiple menus to complete simple tasks.",
    solution: "AIBASS brings invoices, reports, GST, inventory and financial information into one easy platform for faster access.",
  },
  {
    id: "clarity",
    tab: "Financial Clarity",
    icon: BarChart3,
    problem: "Business owners may not clearly understand their monthly income, expenses, profit and overall financial position.",
    solution: "AIBASS provides profit and loss statements, balance sheets and category wise reports to make financial performance easier to understand.",
  },
  {
    id: "invoicing",
    tab: "Smart Invoicing",
    icon: FileText,
    problem: "Creating sales invoices and calculating GST manually can take time and lead to errors.",
    solution: "AIBASS creates sales invoices with automatic GST calculations for intrastate and interstate transactions.",
  },
  {
    id: "stock",
    tab: "Stock Updates",
    icon: Package,
    problem: "Inventory records can become inaccurate when purchases, sales and stock are updated separately.",
    solution: "AIBASS updates stock based on purchases and sales invoices and sends reminders when products are running low.",
  },
  {
    id: "ai",
    tab: "AI Assistance",
    icon: Mic,
    problem: "Users often spend time searching through software screens to find reports or complete accounting tasks.",
    solution: "Users can give AIBASS voice or text commands to create invoices, view reports, check stock or access financial information.",
  },
  {
    id: "cash",
    tab: "Cash Forecasting",
    icon: TrendingUp,
    problem: "Businesses may identify cash shortages only when upcoming payments are already due.",
    solution: "AIBASS uses available financial data to predict future cash availability and support better expense planning.",
  },
  {
    id: "pricing",
    tab: "Affordable Pricing",
    icon: IndianRupee,
    problem: "Advanced accounting software can be expensive or require businesses to pay extra for important features.",
    solution: "AIBASS offers monthly, annual and lifetime plans that include accounting, bookkeeping, invoicing, GST, inventory and financial reporting.",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const FirstSection = ({ onWatchDemo }: { onWatchDemo: () => void }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const current = features[active];
  const ActiveIcon = current.icon;
  const Visual = visuals[active];

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const handleTabClick = (i: number) => {
    setActive(i);
    setPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => setPaused(false), 8000);
  };

  return (
    <section id="features" className="py-20 lg:py-12">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm backdrop-blur-md">
            <span className="text-sky-600">01</span>
            <span className="h-3 w-px bg-slate-300" />
            First Section
          </span>
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          How Our AI Based Accounting Software{" "}
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Makes Accounting Easier
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-5xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
          Managing business accounts often involves repeated data entry, complicated software screens, manual GST
          calculations and delayed financial reports. AIBASS solves these everyday problems by bringing accounting,
          bookkeeping, invoicing, GST, inventory and financial insights into one connected platform. Instead of
          navigating multiple menus, users can give instructions through voice or text and let the AI complete the
          requested action or display the required information.
        </p>
      </motion.div>

      {/* Unified card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-[0_8px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl"
      >
        {/* Tab Bar */}
        <div className="border-b border-slate-200/60 bg-white px-6 pt-4">
          <div className="flex items-center justify-center gap-0.5 overflow-x-auto scrollbar-hide w-full">
            {features.map((f, i) => {
              const TabIcon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => handleTabClick(i)}
                  className={`relative flex shrink-0 items-center gap-2 px-2 py-3 md:px-4 text-sm font-semibold transition-all duration-200 ${
                    active === i ? "text-slate-950" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title={f.tab}
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline whitespace-nowrap">{f.tab}</span>
                  {active === i && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-950"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid min-h-[520px] items-start gap-10 px-8 py-12 sm:px-12 sm:py-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16"
          >
            {/* Left */}
            <div className="flex h-full flex-col justify-center">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 shadow-md">
                  <ActiveIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  {current.tab}
                </h3>
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-500">The Problem</p>
              <p className="mb-6 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                {current.problem}
              </p>

              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AIBASS Solves This</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-600">The Solution</p>
              <p className="mb-8 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                {current.solution}
              </p>

              <Button
                onClick={onWatchDemo}
                className="group w-fit h-11 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                See AIBASS in Action
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Right — unique visual per tab */}
            <div className="flex h-full min-h-[380px] flex-col rounded-2xl bg-slate-50/60 p-4">
              <Visual />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default FirstSection;
