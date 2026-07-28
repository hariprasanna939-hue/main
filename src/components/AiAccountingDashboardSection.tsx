import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingDashboardSection = () => {
  const navigate = useNavigate();
  const items = [
    "Monthly revenue",
    "Business expenses",
    "Profit and loss",
    "Balance sheet information",
    "Category wise spending",
    "Current stock availability",
    "Low stock products",
    "Expected cash position"
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text and Checklist */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-[0.2em] text-indigo-650 uppercase block">Unified Overview</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Financial Dashboard for a Clear View of Business Performance
              </h2>
              <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                Knowing how the business is performing should not require searching across several reports or spreadsheets. 
                AIBASS brings important financial and operational information together in one place.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-sm font-medium text-slate-600 leading-relaxed pt-2">
              The connected dashboard helps users move from basic accounting records to a clearer understanding of business performance.
            </p>

            <div className="pt-2">
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-indigo-600 hover:bg-indigo-750 text-white font-semibold h-12 px-6 rounded-full inline-flex items-center gap-2 group transition-all shadow-md hover:shadow-indigo-200"
              >
                View the Financial Dashboard
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Visual Dashboard Mockup card preview */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-6">
              
              {/* Stats Widgets */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Financial Summary</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Real-time sync</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Revenue</span>
                  <p className="text-lg font-black text-slate-900">₹24.85L</p>
                  <span className="text-[9px] text-emerald-600 font-bold block">+12.4% vs last month</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Expenses</span>
                  <p className="text-lg font-black text-slate-900">₹14.20L</p>
                  <span className="text-[9px] text-rose-500 font-bold block">78% of budget limits</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1 col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Future Cash Position</span>
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <p className="text-lg font-black text-slate-900">₹10.65L</p>
                  <span className="text-[9px] text-slate-450 font-bold block">Healthy availability predicted</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
