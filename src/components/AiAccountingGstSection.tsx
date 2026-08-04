import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  MapPin, 
  Map, 
  FileText, 
  Calculator, 
  History, 
  Package, 
  Percent, 
  Info,
  ArrowRight,
  TrendingUp,
  Link,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingGstSection = () => {
  const navigate = useNavigate();

  return (
    <section id="gst-calculation-section" className="py-6 md:py-8 border-t border-slate-100 bg-transparent scroll-mt-24">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* Main Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-indigo-650 uppercase block">Smart GST Invoicing</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Automatic GST Calculation for Sales Invoices
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS simplifies GST invoicing by calculating the applicable tax while creating supported sales invoices. 
            It helps businesses prepare invoices faster and keeps sales, accounting and inventory information connected within one platform.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Comparative Side-by-Side Invoicing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Intrastate Transactions */}
          <div className="bg-slate-50/50 border border-slate-150 rounded-[32px] p-6 md:p-8 flex flex-col space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Intrastate Transactions</h3>
              </div>
              <p className="text-xs font-semibold text-slate-655">
                For sales completed within the same state, AIBASS calculates CGST and SGST based on the transaction information entered.
              </p>
              <div className="inline-flex">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Calculates CGST + SGST
                </span>
              </div>
            </div>

            {/* Checklist + Invoice Inner Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              {/* Checklist */}
              <div className="md:col-span-4 space-y-3.5 text-left">
                {[
                  "Automatic Invoice Creation",
                  "CGST 9% Calculated",
                  "SGST 9% Calculated"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Invoice Mockup visual */}
              <div className="md:col-span-8 border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-800">TAX INVOICE</h4>
                    <span className="text-[9px] font-bold text-slate-400">INV-2024-0256</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                    INTRASTATE
                  </span>
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                  <span>Date: 20 May 2026</span>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between text-slate-450 border-b border-slate-100 pb-1 font-bold">
                    <span>Item</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="flex justify-between text-slate-655 font-semibold">
                    <span>Subtotal</span>
                    <span>10,000.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>CGST (9%)</span>
                    <span>900.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>SGST (9%)</span>
                    <span>900.00</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black border-t border-slate-200 pt-1.5 text-xs">
                    <span>Total</span>
                    <span>₹ 11,800.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Interstate Transactions */}
          <div className="bg-slate-50/50 border border-slate-150 rounded-[32px] p-6 md:p-8 flex flex-col space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Map className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Interstate Transactions</h3>
              </div>
              <p className="text-xs font-semibold text-slate-655">
                For sales completed between different states, AIBASS calculates IGST and includes it in the sales invoice.
              </p>
              <div className="inline-flex">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Calculates IGST
                </span>
              </div>
            </div>

            {/* Checklist + Invoice Inner Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              {/* Checklist */}
              <div className="md:col-span-4 space-y-3.5 text-left">
                {[
                  "Automatic Invoice Creation",
                  "IGST 18% Calculated",
                  "Connected to Records"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Invoice Mockup visual */}
              <div className="md:col-span-8 border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-800">TAX INVOICE</h4>
                    <span className="text-[9px] font-bold text-slate-400">INV-2024-0257</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-blue-750 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    INTERSTATE
                  </span>
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                  <span>Date: 20 May 2026</span>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between text-slate-450 border-b border-slate-100 pb-1 font-bold">
                    <span>Item</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="flex justify-between text-slate-655 font-semibold">
                    <span>Subtotal</span>
                    <span>10,000.00</span>
                  </div>
                  <div className="flex justify-between text-blue-600 font-bold">
                    <span>IGST (18%)</span>
                    <span>1,800.00</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black border-t border-slate-200 pt-1.5 text-xs">
                    <span>Total</span>
                    <span>₹ 11,800.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>



        {/* Section: Supported GST Capabilities */}
        <div className="space-y-8 text-center">
          <h3 className="text-base font-bold text-slate-900">Supported GST Capabilities</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Automatic Sales Invoice Creation", desc: "Create GST sales invoices faster.", icon: FileText, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { title: "Intrastate GST Calculation", desc: "Automatically calculate CGST and SGST.", icon: Percent, color: "text-blue-600 bg-blue-50 border-blue-100" },
              { title: "Interstate GST Calculation", desc: "Automatically calculate applicable IGST.", icon: Percent, color: "text-indigo-650 bg-indigo-50 border-indigo-100" },
              { title: "CGST and SGST Calculation", desc: "CGST and SGST calculated for intrastate sales.", icon: Percent, color: "text-purple-655 bg-purple-50 border-purple-100" },
              { title: "IGST Calculation", desc: "IGST calculated for interstate sales.", icon: Percent, color: "text-orange-655 bg-orange-50 border-orange-100" },
              { title: "Connected Sales and Accounting Records", desc: "Keep sales and accounting information aligned.", icon: Link, color: "text-teal-600 bg-teal-50 border-teal-100" },
              { title: "Sales Based Inventory Updates", desc: "Inventory is updated automatically on sales.", icon: Package, color: "text-rose-600 bg-rose-50 border-rose-100" }
            ].map((cap, idx) => {
              const Icon = cap.icon;
              const isLast = idx === 6;
              return (
                <div 
                  key={idx} 
                  className={`bg-white border border-slate-150 rounded-2xl p-5 flex shadow-sm transition-all flex-row items-center gap-4 text-left ${
                    isLast 
                      ? "lg:col-start-2 lg:col-span-1 sm:col-span-2 max-w-md mx-auto w-full" 
                      : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cap.color} flex-shrink-0`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{cap.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Bottom CTA Actions */}
        <div className="text-center space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-full text-sm shadow-md transition-all hover:-translate-y-0.5"
            >
              Start 30 Day Free Trial
            </Button>
            <Button
              variant="outline"
              onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
              className="w-full sm:w-auto border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold h-12 px-8 rounded-full text-sm transition-all hover:-translate-y-0.5"
            >
              Explore GST Accounting
            </Button>
          </div>
          <p className="text-[11px] font-semibold text-slate-450">
            Create GST invoices and see how automatic tax calculations work in AIBASS.
          </p>
        </div>

      </div>
    </section>
  );
};
