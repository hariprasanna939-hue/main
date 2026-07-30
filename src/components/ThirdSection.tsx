import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  HelpCircle, 
  Briefcase,
  Mic, 
  BookOpen, 
  Calculator, 
  Boxes, 
  BarChart4, 
  TrendingUp, 
  Brain,
  Sparkles
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const featureDetails = [
  {
    id: "commands",
    num: "01",
    title: "Voice and Text AI Commands",
    icon: Mic,
    gradient: "from-sky-400 to-blue-600",
    accentBorder: "bg-sky-500",
    iconBg: "bg-sky-50 text-sky-600",
    glowColor: "bg-sky-450/15",
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
    num: "02",
    title: "AI Accounting and Bookkeeping",
    icon: BookOpen,
    gradient: "from-indigo-500 to-purple-600",
    accentBorder: "bg-indigo-500",
    iconBg: "bg-indigo-50 text-indigo-650",
    glowColor: "bg-indigo-450/15",
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
    num: "03",
    title: "Automatic Invoicing and GST",
    icon: Calculator,
    gradient: "from-emerald-400 to-teal-600",
    accentBorder: "bg-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
    glowColor: "bg-emerald-450/15",
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
    num: "04",
    title: "Inventory and Stock Management",
    icon: Boxes,
    gradient: "from-amber-400 to-orange-600",
    accentBorder: "bg-amber-505",
    iconBg: "bg-amber-50 text-amber-600",
    glowColor: "bg-amber-450/15",
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
    num: "05",
    title: "Financial Reporting",
    icon: BarChart4,
    gradient: "from-rose-400 to-pink-600",
    accentBorder: "bg-rose-500",
    iconBg: "bg-rose-50 text-rose-600",
    glowColor: "bg-rose-450/15",
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
    num: "06",
    title: "Cash Flow Prediction",
    icon: TrendingUp,
    gradient: "from-cyan-400 to-blue-600",
    accentBorder: "bg-cyan-500",
    iconBg: "bg-cyan-50 text-cyan-600",
    glowColor: "bg-cyan-450/15",
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
    num: "07",
    title: "AI Supported Decision Making",
    icon: Brain,
    gradient: "from-purple-400 to-indigo-600",
    accentBorder: "bg-purple-500",
    iconBg: "bg-purple-50 text-purple-650",
    glowColor: "bg-purple-450/15",
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

const SCROLL_LENGTH = 3200; // Duration of pinning in px

const ThirdSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP ScrollTrigger for pinned scroll on Desktop
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: cardRef.current,
          start: "center center",
          end: `+=${SCROLL_LENGTH}`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * featureDetails.length),
              featureDetails.length - 1
            );
            setActiveIndex(index);
          }
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeFeat = featureDetails[activeIndex];
  const ActiveIcon = activeFeat.icon;

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-50/30 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-4xl mx-auto space-y-4 px-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0B0F19] sm:text-4xl lg:text-5xl leading-tight">
            AI Accounting Features That Simplify{" "}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Everyday Business Management
            </span>
          </h2>
          <p className="text-sm font-semibold leading-relaxed text-slate-500 max-w-4xl mx-auto">
            AIBASS combines AI based accounting software, AI bookkeeping software, GST accounting software, inventory accounting software, financial reporting software and cash flow forecasting software in one connected platform.
          </p>
        </div>

        {/* ─── DESKTOP UNIFIED SINGLE CARD SPLIT VIEW ─── */}
        <div className="hidden lg:block pt-6">
          <div 
            ref={cardRef} 
            className="rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_30px_70px_rgba(15,23,42,0.06)] grid lg:grid-cols-[0.5fr_0.5fr] gap-12 p-12 items-stretch min-h-[600px] relative overflow-hidden"
            style={{
              backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          >
            {/* Top accent color bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 transition-all duration-500 ${activeFeat.accentBorder}`} />
            
            {/* Soft decorative background highlight inside card based on active feature */}
            <div className={`absolute -top-1/4 -right-1/4 w-[60%] h-[150%] filter blur-[100px] pointer-events-none opacity-25 transition-all duration-700 ${activeFeat.glowColor}`} />

            {/* Wavy Background Graphic Overlay */}
            <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden rounded-b-3xl z-0 h-[350px]">
              <svg className="w-full h-full transition-colors duration-700" viewBox="0 0 200 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 95C50 85 100 90 200 40V100H0V95Z"
                  className={`transition-all duration-700 fill-current ${
                    activeFeat.id === "commands" ? "text-sky-100/45" :
                    activeFeat.id === "accounting" ? "text-indigo-100/45" :
                    activeFeat.id === "gst" ? "text-emerald-100/45" :
                    activeFeat.id === "inventory" ? "text-amber-100/45" :
                    activeFeat.id === "reporting" ? "text-rose-100/45" :
                    activeFeat.id === "cashflow" ? "text-cyan-100/45" :
                    "text-purple-100/45"
                  }`}
                />
                <path
                  d="M0 98C40 93 85 96 200 60V100H0V98Z"
                  className={`transition-all duration-700 fill-current ${
                    activeFeat.id === "commands" ? "text-sky-200/30" :
                    activeFeat.id === "accounting" ? "text-indigo-200/30" :
                    activeFeat.id === "gst" ? "text-emerald-200/30" :
                    activeFeat.id === "inventory" ? "text-amber-200/30" :
                    activeFeat.id === "reporting" ? "text-rose-200/30" :
                    activeFeat.id === "cashflow" ? "text-cyan-200/30" :
                    "text-purple-200/30"
                  }`}
                />
                <path
                  d="M0 90C60 65 120 85 200 20"
                  className={`transition-all duration-700 stroke-current ${
                    activeFeat.id === "commands" ? "text-sky-300/50" :
                    activeFeat.id === "accounting" ? "text-indigo-300/50" :
                    activeFeat.id === "gst" ? "text-emerald-300/50" :
                    activeFeat.id === "inventory" ? "text-amber-300/50" :
                    activeFeat.id === "reporting" ? "text-rose-300/50" :
                    activeFeat.id === "cashflow" ? "text-cyan-300/50" :
                    "text-purple-300/50"
                  }`}
                  strokeWidth="0.75"
                />
              </svg>
            </div>

            {/* Left Column of the Card: Description content (Feature, Heading, How It Works, Business Benefit) */}
            <div className="flex flex-col justify-start h-full relative z-10 pr-8 pl-8 pt-8 border-r border-slate-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-5 flex flex-col justify-start h-full"
                >
                  <div className="space-y-5">
                    {/* Floating Header */}
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${activeFeat.gradient} text-white shadow-md`}>
                        <ActiveIcon className="h-6.5 w-6.5" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-455 uppercase tracking-widest block">Feature {activeFeat.num}</span>
                        <h3 className="text-3xl font-extrabold text-[#0B0F19] tracking-tight leading-tight mt-1">{activeFeat.title}</h3>
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="h-4.5 w-4.5 text-indigo-600 stroke-[2.5]" />
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-950">How it works</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-700">{activeFeat.howItWorks}</p>
                    </div>
                  </div>

                  {/* Business Benefit Box */}
                  <div className="bg-gradient-to-br from-indigo-50/50 via-indigo-50/80 to-white border border-indigo-100/50 p-5.5 rounded-2xl mt-5 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
                      <Briefcase className="h-4.5 w-4.5 text-indigo-600 stroke-[2.5]" />
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-955">Business Benefit</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-indigo-955 leading-relaxed">{activeFeat.benefit}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column of the Card: Key Operations checklist */}
            <div className="flex flex-col justify-start h-full pl-12 relative z-10 pt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeat.id + "-ops"}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <h4 className="text-base font-extrabold uppercase tracking-wider text-[#0B0F19] border-b pb-3.5 border-slate-100 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                      Key Operations Supported
                    </h4>
                    <div className="space-y-4">
                      {activeFeat.supports.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-2.5 rounded-xl hover:bg-slate-50/60 transition-colors group">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                            <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                          </div>
                          <span className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Progress Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {featureDetails.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? "w-6 bg-slate-800" : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* ─── MOBILE/TABLET VIEW (Stack of all cards scrolling normally) ─── */}
        <div className="lg:hidden space-y-8 px-4">
          {featureDetails.map((feat) => {
            const CardIcon = feat.icon;
            return (
              <div
                key={feat.id}
                className={`rounded-xl border-t-[6px] border-x border-b bg-white p-6 sm:p-8 shadow-md flex flex-col justify-between ${
                  feat.id === "commands" ? "border-t-[#0EA5E9]" :
                  feat.id === "accounting" ? "border-t-[#6366F1]" :
                  feat.id === "gst" ? "border-t-[#10B981]" :
                  feat.id === "inventory" ? "border-t-[#F59E0B]" :
                  feat.id === "reporting" ? "border-t-[#F43F5E]" :
                  feat.id === "cashflow" ? "border-t-[#06B6D4]" :
                  "border-t-[#8B5CF6]"
                }`}
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feat.iconBg} shadow-sm`}>
                      <CardIcon className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Feature {feat.num}</span>
                      <h3 className="text-xl font-extrabold text-[#0B0F19] tracking-tight leading-tight">{feat.title}</h3>
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="bg-slate-50/80 rounded-xl p-4.5 border border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <HelpCircle className="h-4.5 w-4.5 text-slate-500" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider">How it works</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-655">{feat.howItWorks}</p>
                  </div>

                  {/* Supports List */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block pl-1">Key Operations Supported</span>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {feat.supports.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                            <Check className="h-3 w-3 stroke-[3.5]" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Business Benefit */}
                <div className="bg-indigo-50/60 border border-indigo-100/50 p-4.5 rounded-xl mt-6">
                  <div className="flex items-center gap-1.5 text-indigo-650 mb-1">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600">Business Benefit</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-indigo-955 leading-relaxed">{feat.benefit}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ThirdSection;