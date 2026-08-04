import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Mic, 
  Calculator, 
  Package, 
  BarChart3, 
  TrendingUp, 
  CalendarCheck,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  BadgeCent,
  ShoppingCart,
  BookOpen,
  Settings,
  Users,
  CheckCheck,
  Send,
  Download,
  Share2,
  ChevronRight,
  TrendingDown,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AiAccountingDemoSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"commands" | "invoicing" | "gst" | "inventory" | "reports" | "cashflow">("commands");

  const tabs = [
    { id: "commands", label: "AI Commands", icon: MessageSquare },
    { id: "invoicing", label: "Invoicing", icon: FileTextIcon },
    { id: "gst", label: "GST", icon: Calculator },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "cashflow", label: "Cash Flow", icon: TrendingUp }
  ] as const;

  const featureCards = [
    { title: "Text Commands", desc: "Ask in plain language and get instant results.", icon: MessageSquare, color: "text-blue-500 bg-blue-50/60" },
    { title: "Voice Commands", desc: "Speak naturally and let AIBASS handle the rest.", icon: Mic, color: "text-indigo-500 bg-indigo-50/60" },
    { title: "GST Calculation", desc: "Accurate GST computation and return summaries.", icon: Calculator, color: "text-purple-500 bg-purple-50/60" },
    { title: "Inventory Updates", desc: "Real-time stock tracking and low-stock alerts.", icon: Package, color: "text-blue-600 bg-blue-50/60" },
    { title: "Profit & Loss", desc: "Instant P&L insights at your fingertips.", icon: BarChart3, color: "text-emerald-500 bg-emerald-50/60" },
    { title: "Cash Flow", desc: "Track inflows, outflows and cash position.", icon: TrendingUp, color: "text-cyan-500 bg-cyan-50/60" }
  ];

  return (
    <section id="aibass-action-demo" className="py-6 md:py-8 border-t border-slate-100 bg-transparent scroll-mt-24">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 text-center">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-indigo-650 uppercase block">Product Demonstration</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            See <span className="text-indigo-650">AIBASS</span> in Action
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Explore how AIBASS responds to everyday accounting instructions and turns available business information into useful actions and reports.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Tab Controls Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto pt-2">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  isActive 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                    : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Browser Dashboard Mockup Container */}
        <div className="w-full max-w-6xl mx-auto bg-slate-100/50 border border-slate-200/60 rounded-[36px] p-3 md:p-4 shadow-[0_30px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl overflow-hidden flex flex-col relative h-auto">
          
          {/* Mockup Browser Window Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white/60">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            
            {/* Search/Address Bar Mock */}
            <div className="w-1/3 bg-slate-100 border border-slate-200/50 rounded-full py-1 text-[10px] text-slate-450 font-semibold tracking-wide">
              app.aibass.com
            </div>

            <div className="flex items-center gap-3">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                AD
              </div>
            </div>
          </div>

          {/* Dashboard Main Workspace */}
          <div className="flex-1 flex overflow-hidden bg-white text-left text-xs text-slate-800">
            
            {/* Sidebar Navigation */}
            <aside className="w-44 border-r border-slate-150 bg-slate-50/50 p-3 hidden sm:flex flex-col gap-0.5 justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 block mb-2">AIBASS</span>
                {[
                  { icon: LayoutDashboard, label: "Dashboard", active: true },
                  { icon: BadgeCent, label: "Sales" },
                  { icon: ShoppingCart, label: "Purchases" },
                  { icon: BookOpen, label: "Banking" },
                  { icon: Package, label: "Inventory" },
                  { icon: Calculator, label: "GST" },
                  { icon: BarChart3, label: "Reports" },
                  { icon: Users, label: "Contacts" },
                  { icon: Settings, label: "Settings" }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                      item.active 
                        ? "bg-indigo-600 text-white shadow-sm" 
                        : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Bottom sidebar info */}
              <div className="border-t border-slate-200/60 pt-2 px-1">
                <p className="text-[10px] font-bold text-slate-800">AIBASS Demo Co.</p>
                <span className="text-[8px] text-indigo-650 font-bold block">Premium Plan</span>
              </div>
            </aside>

            {/* Main content grid */}
            <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-y-auto bg-slate-50/50 relative">
              
              {/* Col 1: AIBASS AI Chat Window */}
              <div className={`md:col-span-4 bg-white border border-slate-150 rounded-2xl p-4 flex-col justify-between shadow-sm relative transition-all duration-350 ${activeTab === "commands" ? "ring-2 ring-indigo-500 ring-offset-2 flex" : "hidden md:flex"}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="font-extrabold text-slate-800">AIBASS AI</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold cursor-pointer hover:underline">Clear chat</span>
                  </div>

                  {/* Dialogue list */}
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    <div className="flex flex-col gap-1 text-left items-end">
                      <div className="bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-2xl rounded-tr-none max-w-[90%] text-[10px] font-bold">
                        Create a sales invoice for this customer.
                      </div>
                      <span className="text-[8px] text-slate-400">10:32 AM</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-left items-start">
                      <div className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1.5 rounded-2xl rounded-tl-none max-w-[90%] text-[10px] font-semibold">
                        Here's the sales invoice for Bright Tech Solutions.
                        <span className="text-indigo-650 block font-bold mt-1 cursor-pointer hover:underline flex items-center gap-0.5">View Invoice <ArrowRight className="h-3 w-3" /></span>
                      </div>
                      <span className="text-[8px] text-slate-400">10:32 AM</span>
                    </div>

                    <div className="flex flex-col gap-1 text-left items-end">
                      <div className="bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-2xl rounded-tr-none max-w-[90%] text-[10px] font-bold">
                        Show my profit and loss for this month.
                      </div>
                      <span className="text-[8px] text-slate-400">10:33 AM</span>
                    </div>

                    <div className="flex flex-col gap-1 text-left items-start">
                      <div className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1.5 rounded-2xl rounded-tl-none max-w-[90%] text-[10px] font-semibold">
                        Here's your Profit & Loss summary for May 2026.
                        <span className="text-indigo-650 block font-bold mt-1 cursor-pointer hover:underline flex items-center gap-0.5">View Report <ArrowRight className="h-3 w-3" /></span>
                      </div>
                      <span className="text-[8px] text-slate-400">10:33 AM</span>
                    </div>
                  </div>
                </div>

                {/* Input block */}
                <div className="border border-slate-200 rounded-xl px-2.5 py-1.5 flex items-center justify-between bg-slate-50/50 mt-3">
                  <span className="text-[10px] text-slate-400 font-medium">Type your command...</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Mic className="h-3.5 w-3.5 cursor-pointer hover:text-slate-655" />
                    <Send className="h-3.5 w-3.5 cursor-pointer text-indigo-500 hover:text-indigo-700" />
                  </div>
                </div>
              </div>

              {/* Col 2: Invoicing details & Stock */}
              <div className={`md:col-span-4 flex-col gap-4 ${activeTab === "invoicing" || activeTab === "inventory" ? "flex" : "hidden md:flex"}`}>
                
                {/* Sales Invoice Widget */}
                <div className={`bg-white border border-slate-150 rounded-2xl p-4 shadow-sm space-y-3 transition-all duration-350 ${activeTab === "invoicing" ? "ring-2 ring-indigo-500 ring-offset-2 block" : "hidden md:block"}`}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-extrabold text-slate-800">Sales Invoice</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">INV-2024-1258</span>
                  </div>

                  <div className="text-[10px] space-y-1">
                    <p className="font-bold text-slate-800">Bright Tech Solutions</p>
                    <p className="text-[8px] text-slate-400 font-medium">GSTIN: 27ABCDE1234F1Z5</p>
                  </div>

                  <div className="border-t border-slate-100 pt-2 text-[9px] space-y-1">
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Item</span>
                      <span>Qty</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-semibold">
                      <span>Web Design Service</span>
                      <span>1</span>
                      <span>41,313.56</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1 text-[10px]">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Subtotal</span>
                      <span>41,313.56</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>CGST (9%)</span>
                      <span>3,718.22</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>SGST (9%)</span>
                      <span>3,718.22</span>
                    </div>
                    <div className="flex justify-between text-indigo-655 font-black pt-1 border-t border-slate-100 text-xs">
                      <span>Total</span>
                      <span>₹48,750.00</span>
                    </div>
                  </div>
                </div>

                {/* Low Stock Items Widget */}
                <div className={`bg-white border border-slate-150 rounded-2xl p-4 shadow-sm space-y-3 transition-all duration-350 ${activeTab === "inventory" ? "ring-2 ring-indigo-500 ring-offset-2 block" : "hidden md:block"}`}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-extrabold text-slate-800">Low Stock Items</span>
                  </div>
                  <table className="w-full text-left text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold">
                        <th className="py-1">Item</th>
                        <th className="py-1 text-center">Available</th>
                        <th className="py-1 text-right">Reorder Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Wireless Mouse", qty: 4, limit: 10 },
                        { name: "HDMI Cable", qty: 6, limit: 15 },
                        { name: "Notebook AS", qty: 3, limit: 20 },
                        { name: "Toner Cartridge", qty: 2, limit: 10 }
                      ].map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-50 last:border-0 text-slate-700 font-semibold">
                          <td className="py-1">{item.name}</td>
                          <td className="py-1 text-center text-rose-500 font-bold">{item.qty}</td>
                          <td className="py-1 text-right">{item.limit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Col 3: GST Summary & Profit & Loss */}
              <div className={`md:col-span-4 flex-col gap-4 ${activeTab === "gst" || activeTab === "reports" || activeTab === "cashflow" ? "flex" : "hidden md:flex"}`}>
                
                {/* GST Summary Widget */}
                <div className={`bg-white border border-slate-150 rounded-2xl p-4 shadow-sm space-y-4 transition-all duration-350 ${activeTab === "gst" ? "ring-2 ring-indigo-500 ring-offset-2 block" : "hidden md:block"}`}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-extrabold text-slate-800">GST Summary</span>
                    <span className="text-[8px] text-slate-400 font-medium">May 2026</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[8px] text-slate-400 block font-bold uppercase">Total Output GST</span>
                      <span className="text-xs font-black text-indigo-650">₹18,742.20</span>
                    </div>
                    <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[8px] text-slate-400 block font-bold uppercase">Total Input GST</span>
                      <span className="text-xs font-black text-emerald-600">₹11,325.50</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <div>
                      <span className="text-slate-450 block font-bold uppercase text-[8px]">Net GST Payable</span>
                      <span className="text-sm font-black text-slate-900">₹7,416.70</span>
                    </div>
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                      Payable
                    </span>
                  </div>
                </div>

                {/* Profit & Loss Widget */}
                <div className={`bg-white border border-slate-150 rounded-2xl p-4 shadow-sm space-y-4 transition-all duration-350 ${activeTab === "reports" || activeTab === "cashflow" ? "ring-2 ring-indigo-500 ring-offset-2 block" : "hidden md:block"}`}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-extrabold text-slate-800">Profit & Loss</span>
                    <span className="text-[8px] text-slate-400 font-medium">May 2026</span>
                  </div>

                  <div className="space-y-2 text-[10px] font-semibold text-slate-655">
                    <div className="flex justify-between">
                      <span>Total Income</span>
                      <span className="text-emerald-600 font-bold">₹3,28,750.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expenses</span>
                      <span className="text-rose-500 font-bold">₹2,01,420.00</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-2 text-xs font-black text-slate-900">
                      <span>Net Profit</span>
                      <span className="text-emerald-650 font-black">₹1,27,330.00</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-450">
                      <span>Profit Margin</span>
                      <span className="font-bold text-indigo-650">38.71%</span>
                    </div>
                  </div>
                </div>

              </div>

            </main>
          </div>
        </div>

        {/* CTA Banner bottom */}
        <div className="space-y-4 pt-4">
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-full text-sm shadow-md transition-all hover:-translate-y-0.5"
          >
            Book a Free Demo
          </Button>
        </div>

      </div>
    </section>
  );
};

// Simple wrapper inside component for lucide-react file icon
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);
