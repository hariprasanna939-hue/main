import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Building,
  Rocket,
  Store,
  Layers,
  Briefcase,
  Wrench,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingBusinessNeeds = () => {
  const navigate = useNavigate();
  const needs = [
    {
      title: "Small Businesses",
      desc: "AIBASS works as AI accounting software for small business owners who may have limited accounting resources. It reduces dependence on spreadsheets by bringing bookkeeping, GST invoices, inventory, reporting and cash flow predictions into one platform. Voice and text commands make supported activities easier to access.",
      linkText: "Accounting Software for Small Businesses",
      route: "/bookkeeping",
      icon: Store,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "Startups",
      desc: "This accounting software for startups helps founders understand expenses, monthly profit, balance sheet information and future cash requirements. It is suitable for growing teams that need financial visibility without building a large internal finance department during the early stages.",
      linkText: "Accounting Software for Startups",
      route: "/financial-ratios",
      icon: Rocket,
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      title: "Small and Medium Enterprises",
      desc: "AIBASS provides accounting software for SMEs that need a connected view of sales, purchases, inventory, GST and financial performance. It helps growing businesses reduce repeated work and access important information more quickly as transaction volumes increase.",
      linkText: "Accounting Software for SMEs",
      route: "/tax-gst",
      icon: Layers,
      color: "text-indigo-650 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Retailers and Traders",
      desc: "Retailers and traders can connect sales invoices, GST calculations and inventory updates. The platform reduces the need to update stock separately and provides low stock reminders before important products become unavailable.",
      linkText: "Accounting Software for Retailers",
      route: "/inventory",
      icon: Building,
      color: "text-orange-655 bg-orange-50 border-orange-100"
    },
    {
      title: "Service Businesses",
      desc: "AIBASS provides accounting software for service businesses that need invoicing, bookkeeping, expense tracking, financial reporting and cash flow visibility. Service companies can use the financial capabilities without depending on stock processes that may not apply to their operations.",
      linkText: "Accounting Software for Service Businesses",
      route: "/invoice",
      icon: Briefcase,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100"
    },
    {
      title: "Manufacturing Businesses",
      desc: "AIBASS helps manufacturing businesses connect purchases, inventory, sales invoices, GST calculations and financial reporting within one platform. It provides better visibility into stock availability, low stock items, expenses, cash flow and important project activities.",
      linkText: "Accounting Software for Manufacturing Businesses",
      route: "/dashboard",
      icon: Wrench,
      color: "text-rose-600 bg-rose-50 border-rose-100"
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            AI Accounting Software for Different Business Needs
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS supports businesses with different accounting, invoicing, inventory and financial reporting requirements.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Needs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {needs.map((item, index) => {
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
                    onClick={() => navigate(item.route)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-650 hover:text-indigo-850 cursor-pointer group uppercase tracking-wider"
                  >
                    {item.linkText}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
