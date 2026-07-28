import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Rocket, Store, Briefcase, Landmark, ShieldCheck } from "lucide-react";

const businessTypes = [
  {
    id: "small",
    title: "Small Businesses",
    icon: Store,
    desc: "AIBASS works as AI accounting software for small business owners who struggle with spreadsheets, manual GST calculations and delayed reports. It connects bookkeeping, invoicing, GST, inventory and financial insights while allowing users to complete supported tasks through voice or text commands.",
    accent: "from-sky-400 to-sky-600",
    badge: "For Solo & Small Teams",
  },
  {
    id: "startups",
    title: "Startups",
    icon: Rocket,
    desc: "This accounting software for startups helps founders understand monthly profit, expenses, balance sheets and future cash requirements without depending on delayed financial reports or a large finance team.",
    accent: "from-indigo-400 to-indigo-600",
    badge: "For Fast-Growing Teams",
  },
  {
    id: "smes",
    title: "Small and Medium Enterprises",
    icon: Building,
    desc: "AIBASS provides accounting software for SMEs that brings sales, purchases, stock updates, GST and reporting into one system, helping growing businesses reduce repeated work and make faster decisions.",
    accent: "from-emerald-400 to-emerald-600",
    badge: "For Structured Operations",
  },
  {
    id: "retailers",
    title: "Retailers and Traders",
    icon: Landmark,
    desc: "Retailers and traders can connect sales invoices, GST calculations and inventory updates, reducing stock mismatches and receiving low stock reminders before product shortages affect sales.",
    accent: "from-amber-400 to-amber-600",
    badge: "For Inventory & Sales",
  },
  {
    id: "services",
    title: "Service Businesses",
    icon: Briefcase,
    desc: "AIBASS provides accounting software for service businesses that simplifies invoicing, bookkeeping, expense tracking, financial reporting and cash flow visibility without adding unnecessary inventory complexity.",
    accent: "from-violet-400 to-violet-600",
    badge: "For Invoice & Expense",
  },
];

const FifthSection = () => {
  const [activeTab, setActiveTab] = useState(businessTypes[0].id);
  const current = businessTypes.find((b) => b.id === activeTab) || businessTypes[0];
  const IconComponent = current.icon;

  return (
    <section className="py-20 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-12 max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
          AI Accounting Software for{" "}
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Different Businesses
          </span>
        </h2>
        <p className="mt-4 text-sm font-medium text-slate-500 sm:text-base">
          AIBASS supports Indian businesses by simplifying accounting, GST, invoicing, inventory, reporting and financial planning through one connected platform.
        </p>
      </motion.div>

      {/* Interactive Tabs Layout */}
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        {/* Left Side: Tabs buttons */}
        <div className="flex flex-col gap-3">
          {businessTypes.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isActive
                    ? "border-sky-200 bg-sky-50 text-sky-950 shadow-sm"
                    : "border-slate-200/60 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isActive ? "bg-sky-500 text-white shadow-sm" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <TabIcon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{tab.title}</span>
                </div>
                <ChevronIcon isActive={isActive} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Interactive Display Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_40px_rgba(15,23,42,0.05)] sm:p-8 md:p-10"
          >
            {/* Content header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {current.badge}
              </span>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${current.accent} text-white shadow-md`}>
                <IconComponent className="h-6 w-6" />
              </div>
            </div>

            {/* Title & Desc */}
            <h3 className="mb-4 text-2xl font-extrabold text-slate-900 tracking-tight">
              {current.title}
            </h3>
            <p className="text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">
              {current.desc}
            </p>

            {/* Bottom Benefit feature */}
            <div className="mt-8 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-xs font-bold text-slate-700">
                Designed to simplify compliance & automate bookkeeping for {current.title.toLowerCase()}.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const ChevronIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    className={`h-4 w-4 shrink-0 transition-all duration-300 ${isActive ? "translate-x-1.5 text-sky-600" : "text-slate-400"}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default FifthSection;
