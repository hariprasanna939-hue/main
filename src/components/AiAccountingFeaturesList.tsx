import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  BookOpen,
  Receipt,
  Package,
  BarChart3,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingFeaturesList = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "AI Accounting and Bookkeeping",
      desc: "AIBASS works as an AI bookkeeping software that organises available accounting information and presents it through understandable financial views. Businesses can track income and expenses, review monthly records, generate profit and loss information, access balance sheets and understand category wise financial activity.",
      linkText: "Explore AI Bookkeeping",
      route: "/bookkeeping",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-500 text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "Automatic Invoicing and GST",
      desc: "Create sales invoices and calculate the applicable tax without completing the entire process manually. The GST accounting software supports automatic sales invoice creation. It calculates CGST and SGST for supported intrastate sales and IGST for supported interstate sales.",
      linkText: "Explore GST Accounting",
      route: "/tax-gst",
      icon: Receipt,
      color: "from-emerald-500 to-teal-500 text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Inventory and Stock Management",
      desc: "AIBASS connects purchase and sales information with inventory quantities. The inventory accounting software increases stock when purchases are recorded and reduces quantities when sales invoices are created. Users can view available stock and receive reminders when products are running low.",
      linkText: "Explore Inventory Management",
      route: "/inventory",
      icon: Package,
      color: "from-orange-500 to-amber-500 text-orange-655 bg-orange-50 border-orange-100"
    },
    {
      title: "Financial Reporting",
      desc: "Understand business performance through clear and organised financial reports. The financial reporting software provides monthly reports, profit and loss statements, balance sheets, income and expense summaries and category wise financial views.",
      linkText: "Explore Financial Reporting",
      route: "/profit-loss",
      icon: BarChart3,
      color: "from-purple-500 to-fuchsia-500 text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      title: "Cash Flow Prediction",
      desc: "Cash flow forecasting software helps businesses prepare for future financial requirements. AIBASS uses available accounting information to estimate expected cash availability and highlight possible changes. Users can review future cash needs, identify potential shortages and plan upcoming expenses more carefully.",
      linkText: "Explore Cash Flow Forecasting",
      route: "/cashflow",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500 text-cyan-600 bg-cyan-50 border-cyan-100"
    },
    {
      title: "AI Supported Business Insights",
      desc: "AIBASS connects financial reports, expenses, inventory and cash flow information to provide a clearer view of business activity. Users can review monthly performance, high expense categories, current stock, low stock products and expected cash availability from one platform.",
      linkText: "Explore All Features",
      route: "/dashboard",
      icon: BrainCircuit,
      color: "from-rose-500 to-pink-500 text-rose-600 bg-rose-50 border-rose-100"
    }
  ];

  return (
    <section id="features-section" className="py-6 md:py-8 border-t border-slate-100 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            AI Accounting Features for Everyday Business Management
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS combines essential accounting, GST, inventory and reporting capabilities within one connected platform.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Features list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-slate-150 rounded-[32px] p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-[0_15px_45px_rgba(0,0,0,0.03)] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <span 
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-850 cursor-pointer group uppercase tracking-wider"
                  >
                    {item.linkText}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-full inline-flex items-center gap-2 group transition-all"
          >
            Explore All Features
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

      </div>
    </section>
  );
};
