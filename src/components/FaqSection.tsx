import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

const faqs = [
  {
    q: "What is AI accounting software?",
    a: "AI accounting software uses automation and intelligent assistance to simplify accounting tasks, financial reporting and business information access.",
  },
  {
    q: "How do voice and text commands work in AIBASS?",
    a: "Users can give AIBASS an instruction through voice or text. The system performs the supported action or displays the requested information.",
  },
  {
    q: "Can AIBASS generate profit and loss statements?",
    a: "Yes. AIBASS can generate monthly profit and loss information based on available accounting records.",
  },
  {
    q: "Does AIBASS generate balance sheets?",
    a: "Yes. Users can access balance sheets and other financial reports through the platform.",
  },
  {
    q: "Does AIBASS calculate GST automatically?",
    a: "AIBASS calculates GST for supported intrastate and interstate sales transactions.",
  },
  {
    q: "Does AIBASS manage inventory?",
    a: "AIBASS updates stock based on purchases and sales invoices and provides low-stock reminders.",
  },
  {
    q: "Can AIBASS predict cash flow?",
    a: "AIBASS uses available financial information to provide cash-flow predictions that support business planning.",
  },
  {
    q: "Who can use AIBASS?",
    a: "AIBASS is suitable for Indian small businesses, startups, SMEs, retailers, traders and service businesses.",
  },
  {
    q: "Can I see the product before purchasing?",
    a: "Yes. Businesses can book a product demonstration before selecting a plan.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
          <HelpCircle className="h-3.5 w-3.5 text-sky-600" />
          Support
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
          Frequently Asked{" "}
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Questions
          </span>
        </h2>
        <p className="mt-4 text-sm font-medium text-slate-500 sm:text-base">
          Got questions? We've got answers. Explore how AIBASS simplifies finance management.
        </p>
      </motion.div>

      {/* Accordion Container */}
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="overflow-hidden rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:bg-white/80 hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {faq.q}
                </span>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/50 border border-white/40 shadow-sm transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-slate-950 text-white border-slate-950" : "text-slate-550"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="border-t border-white/30 bg-white/40 p-5 text-xs sm:text-sm font-medium leading-relaxed text-slate-650">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
