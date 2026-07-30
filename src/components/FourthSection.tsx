import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  Terminal, 
  CheckCircle, 
  TrendingUp, 
  ArrowRightLeft,
  Check
} from "lucide-react";

const flowStages = [
  {
    id: "ingest",
    num: "01",
    phase: "Data Ingest",
    title: "Enter Your Business Data",
    desc: "Add sales, purchases, expenses, inventory and other financial information to keep your business records organised.",
    icon: Database,
    colorClass: "from-sky-400 to-blue-500",
    activeBg: "#0c4a6e", // sky-900
    activeBorder: "#0284c7", // sky-600
    bullet: "Invoice, stock & receipts synced",
  },
  {
    id: "command",
    num: "02",
    phase: "AI Command",
    title: "Give the AI a Command",
    desc: "Type or speak what you need, such as creating an invoice, checking stock or generating a financial report.",
    icon: Terminal,
    colorClass: "from-indigo-500 to-purple-650",
    activeBg: "#1e1b4b", // indigo-950
    activeBorder: "#4f46e5", // indigo-600
    bullet: "Voice or text commands ready",
  },
  {
    id: "synthesis",
    num: "03",
    phase: "Synthesis",
    title: "Review the Output",
    desc: "Check the invoice, GST calculation, report, stock update or cash flow prediction produced by AIBASS.",
    icon: CheckCircle,
    colorClass: "from-emerald-500 to-teal-650",
    activeBg: "#064e3b", // emerald-950
    activeBorder: "#059669", // emerald-600
    bullet: "Real-time accuracy check",
  },
  {
    id: "decision",
    num: "04",
    phase: "Optimization",
    title: "Take Better Action",
    desc: "Use the updated financial and operational information to manage expenses, stock, cash flow and everyday business decisions.",
    icon: TrendingUp,
    colorClass: "from-violet-500 to-fuchsia-600",
    activeBg: "#2e1065", // violet-950
    activeBorder: "#7c3aed", // violet-600
    bullet: "Drive growth with AI insights",
  },
];

const FourthSection = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  return (
    <section className="relative py-20 lg:py-24">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-100/50 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center space-y-4"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0B0F19] sm:text-4xl lg:text-5xl leading-tight">
            How{" "}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AIBASS Works
            </span>
          </h2>
          <p className="text-sm font-semibold leading-relaxed text-slate-555 max-w-2xl mx-auto">
            A continuous step-by-step process designed to simplify compliance, automate bookkeeping, and secure full financial control.
          </p>
        </motion.div>

        {/* ─── DESKTOP EXPANDING ACCORDION VIEW ─── */}
        <div className="hidden lg:flex lg:flex-row gap-4 lg:h-[380px] w-full items-stretch">
          {flowStages.map((stage, idx) => {
            const isExpanded = hoveredIdx === idx;
            const IconComponent = stage.icon;

            return (
              <motion.div
                key={stage.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setHoveredIdx(idx)}
                animate={{
                  flex: isExpanded ? 2.5 : 1,
                  backgroundColor: isExpanded ? stage.activeBg : "#ffffff",
                  borderColor: isExpanded ? stage.activeBorder : "rgba(226, 232, 240, 0.8)",
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 140, 
                  damping: 22 
                }}
                className="relative rounded-2xl border p-6 flex flex-col justify-between overflow-hidden cursor-pointer shadow-md hover:shadow-lg h-full"
              >
                {/* Accent Color Band on top */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stage.colorClass}`} />

                <div className="space-y-4">
                  {/* Top Header info */}
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-colors ${
                      isExpanded ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      <IconComponent className="h-5.5 w-5.5" />
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                      isExpanded ? "bg-white/5 border-white/15 text-white/95" : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}>
                      {stage.phase}
                    </span>
                  </div>

                  {/* Title & Phase Number */}
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest block text-slate-400">
                      Phase {stage.num}
                    </span>
                    <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight mt-1 leading-tight transition-colors ${isExpanded ? "text-white" : "text-slate-900"}`}>
                      {stage.title}
                    </h3>
                  </div>

                  {/* Description - Slides open when expanded */}
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: isExpanded ? 1 : 0, 
                      height: isExpanded ? "auto" : 0,
                      marginTop: isExpanded ? 12 : 0
                    }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className={`text-xs font-semibold leading-relaxed overflow-hidden transition-colors ${
                      isExpanded ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {stage.desc}
                  </motion.p>
                </div>

                {/* Footer Checkmark Bullet */}
                <div className={`mt-8 pt-4 border-t transition-colors ${isExpanded ? "border-white/10" : "border-slate-100"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                      isExpanded ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      <Check className="h-3 w-3 stroke-[3.5]" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isExpanded ? "text-white/85" : "text-slate-655"}`}>
                      {stage.bullet}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── MOBILE/TABLET STACKED FULL VIEW ─── */}
        <div className="flex flex-col lg:hidden gap-5 px-4">
          {flowStages.map((stage) => {
            const IconComponent = stage.icon;

            return (
              <div
                key={stage.id}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Accent Color Band on top */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stage.colorClass}`} />

                <div className="space-y-4">
                  {/* Top Header info */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm">
                      <IconComponent className="h-5.5 w-5.5" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-slate-50 border-slate-100 text-slate-400">
                      {stage.phase}
                    </span>
                  </div>

                  {/* Title & Phase Number */}
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest block text-slate-400">
                      Phase {stage.num}
                    </span>
                    <h3 className="text-lg font-extrabold tracking-tight mt-1 leading-tight text-slate-900">
                      {stage.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-semibold leading-relaxed text-slate-500 mt-2">
                    {stage.desc}
                  </p>
                </div>

                {/* Footer Checkmark Bullet */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <Check className="h-3 w-3 stroke-[3.5]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-655">
                      {stage.bullet}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FourthSection;
