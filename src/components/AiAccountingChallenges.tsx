import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  MonitorOff,
  History,
  Coins,
  LineChart,
  Boxes,
  TrendingDown
} from "lucide-react";

export const AiAccountingChallenges = () => {
  const challenges = [
    {
      title: "Complex Software",
      problem: "Traditional accounting tools may require users to move through several screens and understand complicated accounting terms.",
      solution: "Users can enter or speak a simple command to access supported accounting tasks, reports and business information.",
      icon: MonitorOff,
      color: "text-red-500 bg-red-50 border-red-100"
    },
    {
      title: "Repetitive Bookkeeping",
      problem: "Entering and reviewing information across separate spreadsheets and systems takes time.",
      solution: "Accounting and bookkeeping information remains organised within one connected platform for easier management.",
      icon: History,
      color: "text-amber-500 bg-amber-50 border-amber-100"
    },
    {
      title: "Manual GST Work",
      problem: "Calculating GST manually while preparing sales invoices can cause delays and errors.",
      solution: "AIBASS calculates applicable GST for supported intrastate and interstate sales transactions.",
      icon: Coins,
      color: "text-blue-500 bg-blue-50 border-blue-100"
    },
    {
      title: "Unclear Financial Performance",
      problem: "Business owners may wait until reports are manually prepared before understanding income, expenses and profit.",
      solution: "Users can access profit and loss statements, balance sheets and category wise financial views.",
      icon: LineChart,
      color: "text-emerald-500 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Stock Mismatches",
      problem: "Inventory records can become inaccurate when purchases, sales and stock quantities are managed separately.",
      solution: "Purchase and sales records connect with inventory quantities to keep stock information updated.",
      icon: Boxes,
      color: "text-indigo-500 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Unexpected Cash Shortages",
      problem: "Businesses may identify cash shortages only when payments or expenses become due.",
      solution: "Cash flow predictions help users understand expected availability and prepare for upcoming financial requirements.",
      icon: TrendingDown,
      color: "text-purple-500 bg-purple-50 border-purple-100"
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Make Everyday Accounting Easier with AI
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS is designed around the common accounting challenges that business owners experience every day.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-slate-150 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] flex flex-col space-y-4 text-left hover:shadow-[0_15px_35px_rgba(99,102,241,0.04)] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                </div>
                
                <div className="space-y-2.5 text-sm">
                  <div>
                    <span className="font-extrabold text-rose-500 block uppercase tracking-wider text-xs">The Problem</span>
                    <p className="text-slate-655 font-medium leading-relaxed mt-0.5">{item.problem}</p>
                  </div>
                  <div className="pt-1.5 border-t border-slate-50">
                    <span className="font-extrabold text-emerald-650 block uppercase tracking-wider text-xs">The AIBASS Solution</span>
                    <p className="text-slate-800 font-semibold leading-relaxed mt-0.5">{item.solution}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Button 
            onClick={() => {
              const element = document.getElementById("ai-commands");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-slate-950 hover:bg-slate-800 text-white font-semibold h-11 px-6 rounded-full inline-flex items-center gap-2 group transition-all"
          >
            Discover How AIBASS Helps
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

      </div>
    </section>
  );
};
