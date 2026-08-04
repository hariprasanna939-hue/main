import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Database, 
  Cpu, 
  FileCheck2, 
  Target, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const AiAccountingWorkflow = () => {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Business Data",
      desc: "Sales, purchases, expenses, inventory and more.",
      icon: Database,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-100"
    },
    {
      title: "AI Processes Request",
      desc: "AIBASS understands your command and processes data.",
      icon: Cpu,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-650",
      borderColor: "border-purple-100"
    },
    {
      title: "Financial Result",
      desc: "Accurate reports and insights instantly available.",
      icon: FileCheck2,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-650",
      borderColor: "border-emerald-100"
    },
    {
      title: "Better Decision",
      desc: "Make informed decisions and grow your business.",
      icon: Target,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-650",
      borderColor: "border-indigo-100"
    }
  ];

  return (
    <section className="py-16 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Pipeline container */}
        <div className="bg-slate-50/60 border border-slate-200/60 rounded-[32px] p-6 md:p-8 backdrop-blur-md shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <React.Fragment key={index}>
                  {/* Step Item */}
                  <div className="flex items-center gap-4 flex-1 w-full lg:w-auto">
                    {/* Circle Icon */}
                    <div className={`w-14 h-14 rounded-full ${step.bgColor} border ${step.borderColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <IconComponent className={`h-6 w-6 ${step.iconColor}`} />
                    </div>
                    {/* Text */}
                    <div className="text-left space-y-1">
                      <h4 className="text-base font-extrabold text-slate-800 tracking-tight">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-normal max-w-xs">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex items-center text-slate-300 mx-2">
                      <ArrowRight className="h-5 w-5 stroke-[1.5]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="text-center space-y-6 pt-4">
          <p className="text-base md:text-lg font-bold text-slate-850 max-w-3xl mx-auto leading-relaxed">
            AIBASS reduces manual work and helps you understand your business finance better every day.{" "}
            <span className="text-indigo-650 cursor-pointer hover:underline" onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}>
              Start your 30 day free trial today!
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-6 rounded-xl text-base shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
            >
              Start 30 Day Free Trial
            </Button>
            <Button
              variant="outline"
              onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
              className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-8 py-6 rounded-xl text-base transition-all hover:-translate-y-0.5"
            >
              Book a Free Demo
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};
