import React from "react";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingComparison = () => {
  const navigate = useNavigate();
  const rows = [
    {
      capability: "Software navigation",
      traditional: "Users may move through several menus",
      aibass: "Users can give voice or text instructions"
    },
    {
      capability: "Financial information",
      traditional: "Reports must be located manually",
      aibass: "Information can be requested through commands"
    },
    {
      capability: "GST calculation",
      traditional: "May require additional manual steps",
      aibass: "Supported GST values are calculated automatically"
    },
    {
      capability: "Inventory updates",
      traditional: "Purchases, sales and stock may be updated separately",
      aibass: "Inventory connects with purchases and sales invoices"
    },
    {
      capability: "Financial planning",
      traditional: "Primarily focused on historical reports",
      aibass: "Includes cash flow predictions based on available data"
    },
    {
      capability: "User experience",
      traditional: "May require deeper software knowledge",
      aibass: "Designed to make supported tasks easier to access"
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            AI Accounting Software Versus Traditional Accounting Tools
          </h2>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Comparison Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto border border-slate-200/60 rounded-[24px] bg-white shadow-sm max-w-5xl mx-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/65">
                  <th className="p-4 md:p-5 text-sm font-bold uppercase tracking-wider text-slate-800">Capability</th>
                  <th className="p-4 md:p-5 text-sm font-bold uppercase tracking-wider text-slate-500">Traditional Accounting Tools</th>
                  <th className="p-4 md:p-5 text-sm font-bold uppercase tracking-wider text-indigo-650 bg-indigo-50/20">AIBASS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr 
                   key={idx} 
                  className={`border-b border-slate-100/80 hover:bg-slate-50/30 transition-colors last:border-0`}
                >
                  <td className="p-4 md:p-5 text-sm font-bold text-slate-800">{row.capability}</td>
                  <td className="p-4 md:p-5 text-sm font-semibold text-slate-555">{row.traditional}</td>
                  <td className="p-4 md:p-5 text-sm font-bold text-indigo-900 bg-indigo-50/10">{row.aibass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card List) */}
        <div className="block md:hidden space-y-4 max-w-md mx-auto">
          {rows.map((row, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm text-left space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 tracking-tight">
                {row.capability}
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Traditional Tools</span>
                  <p className="text-sm font-semibold text-slate-600">{row.traditional}</p>
                </div>
                <div className="space-y-1 bg-indigo-50/40 border border-indigo-100/50 p-2.5 rounded-xl">
                  <span className="text-xs font-extrabold text-indigo-650 uppercase tracking-widest block">AIBASS</span>
                  <p className="text-sm font-bold text-slate-900">{row.aibass}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* CTA */}
        <div className="text-center pt-4">
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-full inline-flex items-center gap-2 group transition-all"
          >
            Compare the AIBASS Experience
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

      </div>
    </section>
  );
};
