import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarCheck,
  Database,
  Terminal,
  FileCheck,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingHowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: "1",
      title: "Add Business Information",
      desc: "Enter sales, purchases, expenses, inventory and other relevant financial records into the platform.",
      icon: Database,
      iconColor: "text-blue-600 bg-blue-50 border-blue-200",
      stepColor: "bg-blue-600"
    },
    {
      step: "2",
      title: "Give the AI a Command",
      desc: "Type or speak the accounting activity or information you need.",
      icon: Terminal,
      iconColor: "text-purple-600 bg-purple-50 border-purple-200",
      stepColor: "bg-purple-600"
    },
    {
      step: "3",
      title: "Review the Result",
      desc: "Check the generated invoice, GST calculation, financial report, inventory update or cash flow prediction.",
      icon: FileCheck,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      stepColor: "bg-emerald-600"
    },
    {
      step: "4",
      title: "Take Informed Action",
      desc: "Use the available financial and operational information to manage expenses, stock, cash flow and everyday business decisions.",
      icon: TrendingUp,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
      stepColor: "bg-indigo-600"
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            How AIBASS Works
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS simplifies the journey from entering business information to reviewing the financial result.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Pipeline Card */}
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-4 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.03)]">

          {/* Desktop: Horizontal Pipeline */}
          <div className="hidden md:grid md:grid-cols-11 gap-3 items-start">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={index}>
                  {/* Step Card */}
                  <div className="col-span-2 flex flex-col items-center text-center space-y-3">
                    {/* Step badge + Icon */}
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center shadow-sm ${item.iconColor}`}>
                        <Icon className="h-9 w-9" />
                      </div>
                      <span className={`absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full ${item.stepColor} text-white text-xs font-black flex items-center justify-center shadow-md`}>
                        {item.step}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">{item.title}</h3>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Arrow connector (between steps) */}
                  {index < steps.length - 1 && (
                    <div className="col-span-1 flex items-center justify-center" style={{ paddingTop: '0px' }}>
                      <div className="flex items-center gap-0.5 text-slate-300" style={{ marginTop: '-48px' }}>
                        <div className="w-6 h-px bg-slate-200" />
                        <ChevronRight className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile: Vertical Stacked Steps */}
          <div className="flex flex-col gap-6 md:hidden">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  {/* Icon + connector line */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center shadow-sm ${item.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${item.stepColor} text-white text-[10px] font-black flex items-center justify-center shadow`}>
                        {item.step}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-px h-8 bg-slate-150 mt-3" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="pt-1 space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{item.title}</h3>
                    <p className="text-base text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Button
            onClick={() => navigate("/auth?tab=signup")}
            className="bg-slate-950 hover:bg-slate-800 text-white font-semibold h-12 px-8 rounded-full inline-flex items-center gap-2 group transition-all"
          >
            Book a Product Walkthrough
            <CalendarCheck className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </section>
  );
};
