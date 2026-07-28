import React from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export const AiAccountingFaq = () => {
  const faqs = [
    {
      q: "What is AI accounting software?",
      a: "AI accounting software uses intelligent automation to simplify supported accounting activities and make financial information easier to access. It can help organise records, generate reports, complete defined actions and respond to natural language instructions. Users should review important financial outputs before using them for business or tax decisions."
    },
    {
      q: "How does AIBASS use AI in accounting?",
      a: "Users can type or speak supported accounting instructions. The platform processes the command and either completes the requested action or displays the required information. Examples include creating a sales invoice, generating a financial report, checking stock and viewing cash flow predictions."
    },
    {
      q: "What accounting tasks can AIBASS perform?",
      a: "AIBASS supports accounting and bookkeeping information, sales invoice creation, GST calculations, inventory updates, low stock reminders, monthly profit and loss, balance sheets, category wise reports and cash flow predictions."
    },
    {
      q: "Can I use voice commands in AIBASS?",
      a: "Yes. Users can speak supported instructions to request accounting actions or financial information. For example, a user may ask to generate a balance sheet, display category wise expenses or show the expected cash position."
    },
    {
      q: "Does AIBASS provide AI bookkeeping?",
      a: "Yes. The platform organises available accounting information and presents it through monthly records, profit and loss statements, balance sheets and category wise views. Users remain responsible for checking important financial information."
    },
    {
      q: "Can AIBASS calculate GST automatically?",
      a: "AIBASS calculates applicable GST for supported sales invoices. It can calculate CGST and SGST for intrastate transactions and IGST for interstate transactions. This does not mean the platform directly files GST returns."
    },
    {
      q: "Does AIBASS manage inventory?",
      a: "Yes. Inventory quantities can be updated based on recorded purchases and sales invoices. The platform also shows current stock information and provides reminders when products are running low."
    },
    {
      q: "Can AIBASS generate financial reports?",
      a: "AIBASS can display monthly reports, profit and loss statements, balance sheets, income and expense summaries and category wise financial views based on available information."
    },
    {
      q: "How does cash flow prediction work?",
      a: "AIBASS reviews available financial information to estimate expected cash availability and possible future changes. These predictions help businesses prepare for expenses and potential shortages but should be reviewed alongside current conditions."
    },
    {
      q: "Is AIBASS suitable for small businesses?",
      a: "Yes. AIBASS is suitable for small businesses that need easier access to bookkeeping, invoicing, GST calculations, stock information and financial reports."
    },
    {
      q: "Can startups and SMEs use AIBASS?",
      a: "Yes. Startups can use the platform to understand expenses, profit and future cash requirements. SMEs can connect sales, purchases, stock, GST and reporting as their financial activity grows."
    },
    {
      q: "Is AIBASS suitable for businesses in India?",
      a: "Yes. AIBASS supports applicable GST calculations for supported intrastate and interstate sales transactions. Businesses should review calculations and use qualified professional support for statutory filing and compliance requirements."
    },
    {
      q: "Does AIBASS replace an accountant?",
      a: "AIBASS simplifies supported accounting tasks and provides easier access to financial information. It does not replace professional accounting, tax or legal advice."
    },
    {
      q: "How much does AIBASS cost?",
      a: "The monthly plan is ₹1,770 including GST, the annual plan is ₹19,116 including GST and the lifetime plan is ₹53,100 including GST. Review the final usage limits and plan conditions before purchasing."
    },
    {
      q: "Can I see AIBASS before purchasing?",
      a: "Yes. Businesses can book a free personalised demonstration to explore the command experience, invoicing, GST calculation, inventory, financial reporting and cash flow prediction features."
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-indigo-655 uppercase block">Help Center</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Accordions */}
        <div className="space-y-4 pt-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden text-left transition-colors hover:border-slate-300"
            >
              <summary className="flex items-center justify-between p-5 font-bold text-slate-900 cursor-pointer list-none select-none">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="text-sm sm:text-base">{faq.q}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-185 transition-transform shrink-0" />
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-slate-655 font-semibold leading-relaxed border-t border-slate-50">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
};
