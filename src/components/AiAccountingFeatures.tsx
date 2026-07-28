import React from "react";
import { 
  Receipt, 
  BookOpen, 
  Package, 
  BarChart3, 
  TrendingUp, 
  Activity 
} from "lucide-react";
import { motion } from "framer-motion";

export const AiAccountingFeatures = () => {
  const cards = [
    {
      title: "Smart Invoicing",
      desc: "Create sales invoices and calculate applicable GST automatically.",
      icon: Receipt,
      color: "from-blue-500 to-indigo-650",
      bgColor: "bg-blue-50/60",
      textColor: "text-blue-600",
      borderColor: "border-blue-100"
    },
    {
      title: "Easy Bookkeeping",
      desc: "Organise income, expenses and financial records in one place.",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-650",
      bgColor: "bg-emerald-50/60",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100"
    },
    {
      title: "Stock Updates",
      desc: "Update inventory through purchases and sales.",
      icon: Package,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50/60",
      textColor: "text-orange-600",
      borderColor: "border-orange-100"
    },
    {
      title: "Financial Reports",
      desc: "Access profit and loss, balance sheet and other key reports.",
      icon: BarChart3,
      color: "from-purple-500 to-fuchsia-600",
      bgColor: "bg-purple-50/60",
      textColor: "text-purple-600",
      borderColor: "border-purple-100"
    },
    {
      title: "Cash Forecasting",
      desc: "Review expected cash availability and prepare for upcoming needs.",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50/60",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-100"
    },
    {
      title: "AI Commands",
      desc: "Request financial information through voice or text.",
      icon: Activity,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50/60",
      textColor: "text-pink-600",
      borderColor: "border-pink-100"
    }
  ];

  return (
    <section id="ai-features" className="py-16 bg-transparent relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Section Title */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            How <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">AI Accounting Software</span> Helps in Day to Day Business Finance
          </h2>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 justify-center">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`bg-white border ${card.borderColor} rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center text-center space-y-4 transition-shadow hover:shadow-[0_15px_35px_rgba(99,102,241,0.08)]`}
              >
                {/* Icon Wrapper */}
                <div className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center ${card.textColor} shadow-inner`}>
                  <IconComponent className="h-6 w-6 stroke-[2]" />
                </div>
                
                {/* Text content */}
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
