import React from "react";
import { Quote, Sparkles } from "lucide-react";

export const AiAccountingTestimonials = () => {
  const testimonials = [
    {
      title: "Easier Access to Financial Reports",
      quote: "Before using AIBASS, we depended on spreadsheets and waited for reports to be prepared manually. The voice and text commands now help us access profit, expense and balance sheet information much faster.",
      name: "Arun Kumar",
      role: "Founder, BrightEdge Consulting",
      business: "Business Consulting Company"
    },
    {
      title: "Faster Sales Invoicing",
      quote: "Creating sales invoices and calculating GST used to involve several manual steps. With AIBASS, we can prepare supported invoices faster and keep the related accounting information organised.",
      name: "Priya Nair",
      role: "Operations Manager, Nexora Services",
      business: "Professional Services Business"
    },
    {
      title: "Better Stock Visibility",
      quote: "We previously updated sales and inventory separately, which made stock tracking difficult. AIBASS connects invoice activity with inventory and helps us identify low stock products earlier.",
      name: "Karthik Rajan",
      role: "Managing Director, MetroMart Traders",
      business: "Retail and Trading Business"
    },
    {
      title: "Clearer Monthly Performance",
      quote: "AIBASS gives us a clearer view of monthly income, expenses and profit. We can review financial information without searching through multiple spreadsheets or software screens.",
      name: "Sneha Iyer",
      role: "Business Owner, GreenLeaf Enterprises",
      business: "Small Business"
    },
    {
      title: "Improved Cash Flow Planning",
      quote: "Cash requirements were difficult to understand until upcoming payments became urgent. AIBASS cash flow predictions now give us better visibility when planning expenses.",
      name: "Rahul Menon",
      role: "Co Founder, CloudNest Technologies",
      business: "Technology Startup"
    },
    {
      title: "Simple AI Commands",
      quote: "The voice and text command feature makes AIBASS easier to use. We can request reports, check inventory and access financial information without navigating through several menus.",
      name: "Meena Subramanian",
      role: "Finance Manager, Apex Manufacturing Solutions",
      business: "Manufacturing Business"
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-indigo-655 uppercase block">Customer Stories</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Helping Businesses Manage Accounts More Easily
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            See how businesses can use AIBASS to simplify accounting tasks, access financial information faster and reduce repeated manual work.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>


        {/* Grid of Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((item, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-150 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.01)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.04)] transition-all flex flex-col justify-between text-left space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {item.title}
                  </span>
                  <Quote className="h-5 w-5 text-indigo-200 shrink-0 mt-0.5" />
                </div>
                <p className="text-sm font-semibold text-slate-655 leading-relaxed italic">
                  “{item.quote}”
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-indigo-650 shadow-inner">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                  <p className="text-xs text-slate-450 font-bold">{item.role}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{item.business}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
