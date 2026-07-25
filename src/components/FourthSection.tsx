import { motion } from "framer-motion";
import { Database, Terminal, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Enter Your Business Data",
    desc: "Add sales, purchases, expenses, inventory and other financial information to keep your business records organised.",
    icon: Database,
    colorClass: "border-t-sky-500",
    iconBg: "bg-sky-50 text-sky-600",
    bullet: "Invoice, stock & receipts synced",
    glowClass: "hover:shadow-[0_20px_45px_rgba(14,165,233,0.12)] hover:border-sky-500/30",
  },
  {
    number: "02",
    title: "Give the AI a Command",
    desc: "Type or speak what you need, such as creating an invoice, checking stock or generating a financial report.",
    icon: Terminal,
    colorClass: "border-t-indigo-500",
    iconBg: "bg-indigo-50 text-indigo-600",
    bullet: "Voice or text commands ready",
    glowClass: "hover:shadow-[0_20px_45px_rgba(99,102,241,0.12)] hover:border-indigo-500/30",
  },
  {
    number: "03",
    title: "Review the Output",
    desc: "Check the invoice, GST calculation, report, stock update or cash flow prediction produced by AIBASS.",
    icon: CheckCircle,
    colorClass: "border-t-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
    bullet: "Real-time accuracy check",
    glowClass: "hover:shadow-[0_20px_45px_rgba(16,185,129,0.12)] hover:border-emerald-500/30",
  },
  {
    number: "04",
    title: "Take Better Action",
    desc: "Use the updated financial and operational information to manage expenses, stock, cash flow and everyday business decisions.",
    icon: TrendingUp,
    colorClass: "border-t-violet-500",
    iconBg: "bg-violet-50 text-violet-600",
    bullet: "Drive growth with AI insights",
    glowClass: "hover:shadow-[0_20px_45px_rgba(139,92,246,0.12)] hover:border-violet-500/30",
  },
];

const FourthSection = () => {
  return (
    <section className="py-20 lg:py-12">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
          Workflow
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
          How{" "}
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            AIBASS Works
          </span>
        </h2>
        <p className="mt-4 text-sm font-medium text-slate-500 sm:text-base">
          Four simple steps to automate bookkeeping and secure full financial control.
        </p>
      </motion.div>

      {/* Grid of Steps */}
      <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className={`relative flex flex-col items-start text-left rounded-3xl border border-slate-200/60 border-t-4 ${step.colorClass} bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7 hover:-translate-y-1 transition-all duration-300 ${step.glowClass}`}
            >
              {/* Row: Icon on top-left, Step number on top-right */}
              <div className="mb-5 flex w-full items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.iconBg} shadow-sm`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  STEP {step.number}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="mb-2 text-base font-extrabold text-slate-900 leading-tight">
                {step.title}
              </h3>
              <p className="flex-1 mb-5 text-xs font-semibold leading-relaxed text-slate-500">
                {step.desc}
              </p>

              {/* Bullet at bottom */}
              <div className="mt-auto border-t border-slate-100 pt-4 w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ✦ {step.bullet}
                </span>
              </div>

              {/* Next arrow indicator (only between columns on desktop) */}
              {idx < 3 && (
                <>
                  <div className="absolute top-[45%] -right-4 z-10 hidden translate-y-[-50%] lg:block">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                  </div>
                  {/* Mobile vertical timeline connector line */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 block lg:hidden h-8">
                    <div className="h-full w-0.5 bg-gradient-to-b from-slate-200 to-slate-300 relative">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[3px] border-r-[3px] border-t-[5px] border-transparent border-t-slate-300" />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FourthSection;
