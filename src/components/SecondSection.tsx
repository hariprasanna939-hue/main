import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Terminal, MessageSquare, Sparkles, CheckCircle2, PlayCircle, AlertCircle } from "lucide-react";

const textDemoSteps = [
  {
    input: "Create a sales invoice for this customer",
    output: "Generates the invoice and calculates the applicable GST.",
    result: {
      type: "invoice",
      client: "Acme Corp",
      items: ["Software Services", "Consulting"],
      gst: "18% (CGST 9% + SGST 9%)",
      total: "₹47,200",
    },
  },
  {
    input: "Show my profit and loss for this month",
    output: "Displays monthly income, expenses and profit status.",
    result: {
      type: "pl",
      revenue: "₹4,25,000",
      expenses: "₹1,85,000",
      profit: "₹2,40,000",
      status: "Healthy",
    },
  },
  {
    input: "Which products are running low?",
    output: "Shows current stock levels and low stock products.",
    result: {
      type: "stock",
      lowItems: [
        { name: "USB-C Hubs", stock: 3 },
        { name: "Wireless Keyboards", stock: 2 },
      ],
      totalSKUs: "48 Low",
    },
  },
];

const voiceDemoSteps = [
  {
    speech: "Show my future cash position",
    output: "Displays cash flow predictions based on available financial data.",
    result: {
      type: "cash",
      projection: "+₹3,50,000",
      period: "Next 30 Days",
      confidence: "98% Accuracy",
    },
  },
  {
    speech: "Generate my balance sheet",
    output: "Shows the balance sheet instantly.",
    result: {
      type: "balance",
      assets: "₹12,40,000",
      liabilities: "₹4,10,000",
      equity: "₹8,30,000",
    },
  },
  {
    speech: "Display category wise expenses",
    output: "Shows expense breakdown by category.",
    result: {
      type: "expenses",
      breakdown: [
        { cat: "Marketing", val: "₹45,000" },
        { cat: "Infrastructure", val: "₹80,000" },
        { cat: "Salaries", val: "₹60,000" },
      ],
    },
  },
];

const SecondSection = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect simulator for Text Commands
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const fullText = textDemoSteps[textIndex].input;
    setIsTyping(true);
    setTypingText("");

    let currentLength = 0;
    const interval = setInterval(() => {
      if (currentLength < fullText.length) {
        currentLength++;
        setTypingText(fullText.substring(0, currentLength));
      } else {
        clearInterval(interval);
        setIsTyping(false);
        // Switch to next text step after 4.5 seconds
        timer = setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % textDemoSteps.length);
        }, 4500);
      }
    }, 55);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [textIndex]);

  // Interval loop for Voice Commands
  useEffect(() => {
    const interval = setInterval(() => {
      setVoiceIndex((prev) => (prev + 1) % voiceDemoSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeTextResult = textDemoSteps[textIndex];
  const activeVoiceResult = voiceDemoSteps[voiceIndex];

  return (
    <section id="solutions" className="py-20 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-4xl text-center"
      >
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            Meet AIBASS
          </span>
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          One AI Accounting Platform for{" "}
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Everyday Business Finance
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
          AIBASS is an AI accounting software for Indian businesses that helps manage invoicing, GST, inventory,
          bookkeeping, financial reports and cash flow insights through simple text or voice commands.
        </p>
      </motion.div>

      {/* Main Subheading */}
      <div className="mb-10 text-center">
        <h3 className="text-2xl font-bold text-slate-950 sm:text-3xl">Tell AIBASS What You Need</h3>
        <p className="mt-2 text-sm text-slate-500">Choose your style of command and watch the AI process tasks instantly</p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Card 1: Text Command */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:p-8"
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Type Your Command</h4>
              <p className="text-xs text-slate-500">Command via text input</p>
            </div>
          </div>

          <p className="mb-8 text-sm font-medium leading-relaxed text-slate-600">
            Enter a simple text instruction and let AIBASS complete the task or display the information you need.
          </p>

          {/* Interactive Visual Window */}
          <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            {/* Command Input Bar */}
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-inner">
              <span className="text-sky-600 font-bold font-mono">&gt;</span>
              <p className="flex-1 text-xs font-semibold text-slate-800 font-mono">
                {typingText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {/* Execution Result */}
            <AnimatePresence mode="wait">
              <motion.div
                key={textIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    AIBASS Output Action
                  </p>
                </div>
                <p className="mb-4 text-xs font-bold text-slate-800">{activeTextResult.output}</p>

                {/* Simulated Result Container */}
                <div className="rounded-lg bg-slate-50/80 p-3.5 border border-slate-100">
                  {activeTextResult.result.type === "invoice" && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b pb-1.5 font-bold">
                        <span className="text-slate-500">Invoice Draft</span>
                        <span className="text-sky-600">{activeTextResult.result.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">CGST + SGST:</span>
                        <span className="font-semibold text-slate-800">{activeTextResult.result.gst}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 border-t pt-1.5">
                        <span>Total Due:</span>
                        <span className="text-sm">{activeTextResult.result.total}</span>
                      </div>
                    </div>
                  )}

                  {activeTextResult.result.type === "pl" && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b pb-1.5 font-bold">
                        <span className="text-slate-500">Monthly P&L</span>
                        <span className="text-emerald-600">{activeTextResult.result.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Revenue:</span>
                        <span className="font-semibold text-slate-800">{activeTextResult.result.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expenses:</span>
                        <span className="font-semibold text-rose-500">{activeTextResult.result.expenses}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 border-t pt-1.5">
                        <span>Net Profit:</span>
                        <span className="text-emerald-600">{activeTextResult.result.profit}</span>
                      </div>
                    </div>
                  )}

                  {activeTextResult.result.type === "stock" && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b pb-1.5 font-bold">
                        <span className="text-slate-500">Low Stock Alert</span>
                        <span className="text-rose-500">{activeTextResult.result.totalSKUs}</span>
                      </div>
                      {activeTextResult.result.lowItems?.map((item) => (
                        <div key={item.name} className="flex justify-between">
                          <span className="text-slate-600 font-semibold">{item.name}</span>
                          <span className="font-bold text-rose-600">{item.stock} left</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Card 2: Voice Command */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:p-8"
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Mic className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Speak Your Command</h4>
              <p className="text-xs text-slate-500">Command via voice input</p>
            </div>
          </div>

          <p className="mb-8 text-sm font-medium leading-relaxed text-slate-600">
            Talk to AIBASS naturally and get the required accounting action or financial information without searching through multiple screens.
          </p>

          {/* Interactive Visual Window */}
          <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            {/* Audio Signal Pulse */}
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm justify-between">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-indigo-600" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={voiceIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs font-semibold text-indigo-700 italic"
                  >
                    “{activeVoiceResult.speech}”
                  </motion.p>
                </AnimatePresence>
              </div>
              {/* Mic soundwaves */}
              <div className="flex gap-1">
                {[1, 2, 3].map((bar) => (
                  <motion.span
                    key={bar}
                    animate={{ height: ["8px", "16px", "8px"] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: bar * 0.15 }}
                    className="w-1 rounded-full bg-indigo-500"
                    style={{ minHeight: "8px" }}
                  />
                ))}
              </div>
            </div>

            {/* Execution Result */}
            <AnimatePresence mode="wait">
              <motion.div
                key={voiceIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    AIBASS Voice Action
                  </p>
                </div>
                <p className="mb-4 text-xs font-bold text-slate-800">{activeVoiceResult.output}</p>

                {/* Simulated Result Container */}
                <div className="rounded-lg bg-slate-50/80 p-3.5 border border-slate-100">
                  {activeVoiceResult.result.type === "cash" && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b pb-1.5 font-bold">
                        <span className="text-slate-500">{activeVoiceResult.result.period} Projection</span>
                        <span className="text-emerald-600">{activeVoiceResult.result.confidence}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-600">Projected Balance:</span>
                        <span className="text-base font-extrabold text-emerald-600">{activeVoiceResult.result.projection}</span>
                      </div>
                    </div>
                  )}

                  {activeVoiceResult.result.type === "balance" && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b pb-1.5 font-bold text-slate-500">
                        <span>Balance Sheet</span>
                        <span className="text-slate-900 font-bold">Live Summary</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Assets:</span>
                        <span className="font-semibold text-slate-850">{activeVoiceResult.result.assets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Liabilities:</span>
                        <span className="font-semibold text-slate-850">{activeVoiceResult.result.liabilities}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 border-t pt-1.5">
                        <span>Owner Equity:</span>
                        <span className="text-indigo-600">{activeVoiceResult.result.equity}</span>
                      </div>
                    </div>
                  )}

                  {activeVoiceResult.result.type === "expenses" && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b pb-1.5 font-bold text-slate-500">
                        <span>Expense Breakdown</span>
                        <span className="text-indigo-600">June</span>
                      </div>
                      {activeVoiceResult.result.breakdown?.map((item) => (
                        <div key={item.cat} className="flex justify-between">
                          <span className="text-slate-600">{item.cat}</span>
                          <span className="font-bold text-slate-850">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecondSection;
