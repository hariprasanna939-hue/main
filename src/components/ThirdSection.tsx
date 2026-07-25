import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Sparkles, HelpCircle, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const featureDetails = [
  {
    id: "commands",
    title: "Voice and Text AI Commands",
    howItWorks: "Users can give AIBASS instructions through voice or text. The AI processes the command and completes the supported action or displays the requested business information.",
    supports: [
      "Create a sales invoice",
      "Show monthly profit and loss",
      "Generate a balance sheet",
      "Display category wise expenses",
      "Check available inventory",
      "Show low stock products",
      "View cash flow predictions",
    ],
    benefit: "Business owners can complete accounting tasks and access important information without navigating multiple software screens.",
  },
  {
    id: "accounting",
    title: "AI Accounting and Bookkeeping",
    howItWorks: "AIBASS organises accounting and bookkeeping information within one structured system. It records available business data and presents financial information through reports and category wise views.",
    supports: [
      "AI based accounting",
      "AI based bookkeeping",
      "Income and expense tracking",
      "Monthly profit and loss reports",
      "Balance sheet generation",
      "Category wise financial views",
    ],
    benefit: "Businesses can maintain clearer financial records, reduce dependence on separate spreadsheets and understand monthly performance more easily.",
  },
  {
    id: "gst",
    title: "Automatic Invoicing and GST",
    howItWorks: "AIBASS creates sales invoices and calculates the applicable GST based on the type of transaction.",
    supports: [
      "Automatic sales invoice creation",
      "CGST and SGST calculations for intrastate sales",
      "IGST calculations for interstate sales",
      "Connected invoice and accounting records",
      "Automatic tax value calculation",
    ],
    benefit: "Businesses can prepare invoices faster, reduce manual tax calculations and maintain more consistent sales and accounting records.",
  },
  {
    id: "inventory",
    title: "Inventory and Stock Management",
    howItWorks: "AIBASS connects purchase and sales records with inventory quantities. Stock levels are updated when purchases are recorded or sales invoices are created.",
    supports: [
      "Purchase based stock additions",
      "Sales invoice based stock reductions",
      "Automatic inventory updates",
      "Current stock visibility",
      "Low stock reminders",
    ],
    benefit: "Businesses can reduce stock mismatches, identify products that need replenishment and avoid losing sales because of unexpected shortages.",
  },
  {
    id: "reporting",
    title: "Financial Reporting",
    howItWorks: "AIBASS uses recorded accounting information to generate financial reports that show business performance and financial position.",
    supports: [
      "Monthly financial reports",
      "Profit and loss statements",
      "Balance sheets",
      "Income and expense summaries",
      "Category wise financial views",
    ],
    benefit: "Business owners can understand revenue, expenses, profit, assets and liabilities without waiting for reports to be prepared manually.",
  },
  {
    id: "cashflow",
    title: "Cash Flow Prediction",
    howItWorks: "AIBASS analyses available financial information to estimate future cash availability and highlight possible cash flow changes.",
    supports: [
      "Review expected cash availability",
      "Identify possible cash shortages",
      "Plan upcoming expenses",
      "Understand future financial requirements",
    ],
    benefit: "Businesses can prepare for upcoming payments, manage expenses more carefully and reduce the risk of unexpected cash shortages.",
  },
  {
    id: "decision",
    title: "AI Supported Decision Making",
    howItWorks: "AIBASS combines financial reports, category wise information, stock details and cash flow predictions to provide useful business insights.",
    supports: [
      "Monthly financial performance",
      "High expense categories",
      "Current stock position",
      "Low stock products",
      "Expected cash availability",
      "Important financial changes",
    ],
    benefit: "Business owners can make decisions using current business information instead of relying only on assumptions or delayed reports.",
  },
];

const ThirdSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(featureDetails[0].id);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      // Pin the left panel while right panel scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 90px",
        end: "bottom bottom",
        pin: leftContentRef.current,
        pinSpacing: false,
      });

      // Track active section to highlight on left side
      featureDetails.forEach((feat) => {
        ScrollTrigger.create({
          trigger: `#feat-sec-${feat.id}`,
          start: "top 250px",
          end: "bottom 250px",
          onEnter: () => setActiveId(feat.id),
          onEnterBack: () => setActiveId(feat.id),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={containerRef} className="relative pt-0 lg:pt-4 pb-0 lg:pb-20">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        {/* Left Side: Static/Pinned */}
        <div ref={leftContentRef} className="self-start space-y-8 pr-4">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
              AI Accounting Features That Simplify{" "}
              <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Everyday Business Management
              </span>
            </h2>
            <p className="text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              AIBASS combines AI based accounting software, AI bookkeeping software, GST accounting software, inventory
              accounting software, financial reporting software and cash flow forecasting software in one connected
              platform. Each feature is designed to reduce repetitive work, improve financial visibility and help
              businesses make faster decisions.
            </p>
          </div>

          {/* Mini navigation index */}
          <div className="hidden space-y-2 lg:block border-l border-slate-200 pl-4">
            {featureDetails.map((feat) => (
              <button
                key={feat.id}
                onClick={() => {
                  const el = document.getElementById(`feat-sec-${feat.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className={`flex items-center gap-2 py-1.5 text-xs font-bold transition-all duration-300 ${
                  activeId === feat.id
                    ? "text-slate-950 translate-x-2"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <ChevronRight className={`h-3.5 w-3.5 text-sky-600 transition-transform ${activeId === feat.id ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
                {feat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Scrolling Content */}
        <div ref={rightContentRef} className="space-y-12">
          {featureDetails.map((feat, index) => (
            <motion.div
              id={`feat-sec-${feat.id}`}
              key={feat.id}
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={isMobile ? { duration: 0 } : { duration: 0.5, delay: 0.05 }}
              className={`rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8 transition-colors duration-300 ${
                !isMobile && activeId === feat.id ? "ring-2 ring-slate-950/5 shadow-md" : ""
              }`}
            >
              {/* Feature Title */}
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {feat.title}
                </h3>
              </div>

              {/* How it works */}
              <div className="mb-6 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="mb-2.5 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-sky-600" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">How it works</p>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-600">{feat.howItWorks}</p>
              </div>

              {/* Supports / List of subfeatures */}
              <div className="mb-6 space-y-2.5 pl-2">
                {feat.supports.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                    <p className="text-xs sm:text-sm font-medium text-slate-700">{item}</p>
                  </div>
                ))}
              </div>

              {/* Business Benefit */}
              <div className="rounded-2xl bg-indigo-50/50 p-4 border border-indigo-50">
                <div className="mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Business Benefit</p>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed text-indigo-900">{feat.benefit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;