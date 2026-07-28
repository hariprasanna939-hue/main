import { motion } from "framer-motion";
import { CheckCircle2, Award, Zap, Sparkles } from "lucide-react";

const reasons = [
  "Complete accounting tasks using simple voice or text commands",
  "Access clear profit, loss, balance sheet and category wise reports",
  "Create sales invoices with automatic intrastate and interstate GST calculation",
  "Keep inventory updated automatically through purchases and sales invoices",
  "Receive low stock reminders before shortages affect business operations",
  "Predict future cash availability and plan expenses with greater confidence",
  "Manage accounting, GST, inventory and financial insights from one platform",
];

const SixthSection = () => {
  return (
    <section className="py-20 lg:py-12">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        {/* Left Side: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
            Why Businesses{" "}
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Choose AIBASS
            </span>
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
            Modern Indian business owners require accounting software that is fast, accessible, and error-free. Here's how AIBASS helps you stay ahead.
          </p>

          {/* Interactive visual helper card */}
          <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 flex gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1">
                Zero Learning Curve
              </p>
              <p className="text-xs font-semibold text-sky-800 leading-relaxed">
                Give commands naturally via voice or text and skip navigating through nested dashboard menus entirely.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Checklist Cards Grid */}
        <div className="space-y-3.5">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-200"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-slate-700 leading-snug">
                {reason}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SixthSection;
