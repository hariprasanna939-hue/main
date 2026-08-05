import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingBottomBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-250 bg-white px-8 py-12 text-center shadow-[0_12px_45px_rgba(15,23,42,0.04)] md:py-16">
          
          {/* Subtle background glow graphics */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
          
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-650">
              <Sparkles className="h-4.5 w-4.5" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Start Today</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl leading-tight">
              Make Business Accounting{" "}
              <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Easier with AI
              </span>
            </h2>

            <div className="space-y-4 text-sm md:text-base font-semibold text-slate-655 leading-relaxed max-w-2xl mx-auto">
              <p>
                Manage bookkeeping, create sales invoices, calculate GST, monitor inventory, generate financial reports and review cash flow predictions from one connected platform.
              </p>
              <p>
                Use voice or text commands to access the accounting actions and business information you need with AIBASS AI accounting software.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="w-full sm:w-auto bg-slate-950 hover:bg-slate-850 text-white font-bold h-12 px-8 rounded-full text-xs shadow-md transition-all hover:-translate-y-0.5"
              >
                Book a Free Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto border-slate-300 bg-white/50 hover:bg-slate-100/50 text-slate-750 font-bold h-12 px-8 rounded-full text-xs transition-all hover:-translate-y-0.5"
              >
                View Pricing
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
