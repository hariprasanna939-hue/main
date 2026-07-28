import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const EighthSection = () => {
  const handleScrollToDemo = () => {
    const el = document.getElementById("solutions"); // Scrolls to booking form inside SeventhSection/solutions area
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-[0_12px_45px_rgba(15,23,42,0.06)] md:py-20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl leading-[1.15]">
          Make Business Accounting{" "}
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Easier to Understand
          </span>{" "}
          and Manage
        </h2>

        <p className="mx-auto max-w-2xl text-sm font-semibold leading-relaxed text-slate-650 sm:text-base">
          Create sales invoices, calculate GST, monitor stock, generate reports and access cash-flow predictions through voice or text commands with AIBASS.
        </p>

        <div className="pt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Button
            onClick={handleScrollToDemo}
            className="group h-12 rounded-full bg-slate-950 px-7 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Book a Free Demo
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button
            onClick={handleScrollToPricing}
            variant="outline"
            className="h-12 rounded-full border-slate-300 bg-white/50 px-7 text-xs font-bold text-slate-750 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100/50"
          >
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EighthSection;
