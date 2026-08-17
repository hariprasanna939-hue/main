import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Crown, Infinity, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingPricing = () => {
  const navigate = useNavigate();
  const pricingTiers = [
    {
      id: "trial",
      name: "14-Day Free Trial",
      price: "₹0",
      period: "per 14 days",
      desc: "Start now and explore the platform free for 14 days",
      icon: Sparkles,
      iconBg: "bg-indigo-600/10 text-indigo-650",
      features: [
        "All core dashboard features",
        "Database-backed trial access",
        "Auto-logout after 14 days",
        "Upgrade to paid plan anytime",
      ],
      cta: "₹0 + ₹0 GST",
      popular: false,
      color: "border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm hover:border-slate-350",
      footerText: "FREE FOR 14 DAYS",
      footerAction: "Select plan",
      badge: "",
    },
    {
      id: "monthly",
      name: "Monthly Subscription",
      price: "₹1,770",
      period: "per month",
      desc: "Perfect for getting started",
      icon: Zap,
      iconBg: "bg-sky-500/10 text-sky-655",
      features: [
        "All basic features",
        "Email support",
        "1GB storage",
        "Basic analytics",
        "Up to 10 employees",
      ],
      cta: "₹1,500 + ₹270 GST",
      popular: false,
      color: "border-sky-200 bg-gradient-to-b from-sky-50/40 to-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(14,165,233,0.06)] hover:border-sky-300 ring-2 ring-sky-500/10",
      footerText: "FLEXIBLE ACCESS",
      footerAction: "Selected",
      badge: "",
      selected: true,
    },
    {
      id: "annual",
      name: "Annual Subscription",
      price: "₹19,116",
      period: "per year",
      desc: "Best value - Save 10%",
      icon: Crown,
      iconBg: "bg-indigo-600 text-white",
      features: [
        "All premium features",
        "Priority support",
        "10GB storage",
        "Advanced analytics",
        "Custom reports",
        "Up to 50 employees",
      ],
      cta: "₹16,200 + ₹2,916 GST",
      popular: true,
      color: "border-slate-200/80 bg-white/70 backdrop-blur-md shadow-lg hover:border-slate-350",
      footerText: "SAVE ₹1,800",
      footerAction: "Select plan",
      badge: "MOST POPULAR",
    },
    {
      id: "lifetime",
      name: "Lifetime Access",
      price: "₹53,100",
      period: "One-time",
      desc: "One-time payment, forever access",
      icon: Infinity,
      iconBg: "bg-slate-900 text-white",
      features: [
        "All features included",
        "24/7 priority support",
        "Unlimited storage",
        "Advanced analytics",
        "Custom reports",
        "Unlimited employees",
        "Free updates forever",
      ],
      cta: "₹45,000 + ₹8,100 GST",
      popular: false,
      color: "border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm hover:border-slate-350",
      footerText: "BEST LONG-TERM VALUE",
      footerAction: "Select plan",
      badge: "",
    },
  ];

  return (
    <section id="pricing-section" className="py-6 md:py-8 border-t border-slate-100 bg-transparent scroll-mt-24">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Simple and{" "}
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Affordable Pricing
            </span>
          </h2>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto pt-4">
          {pricingTiers.map((tier, idx) => {
            const TierIcon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 transition-all duration-350 hover:shadow-md ${tier.color} text-left`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-slate-950 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                    {tier.badge}
                  </span>
                )}

                {/* Card Icon */}
                <div className="mb-5 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tier.iconBg} shadow-sm`}>
                    <TierIcon className="h-5 w-5" />
                  </div>
                </div>

                {/* Price Details */}
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-slate-900">{tier.name}</h3>
                      <p className="mt-1.5 text-[11px] font-semibold text-slate-500 min-h-[32px]">
                        {tier.desc}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold tracking-tight text-slate-950 whitespace-nowrap">{tier.price}</span>
                      <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {tier.period}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Button / CTA */}
                <Button
                  onClick={() => navigate(`/auth?tab=signup&plan=${tier.id}`)}
                  className="w-full h-11 rounded-xl font-bold text-xs bg-slate-950 text-white hover:bg-slate-855 shadow-sm border border-slate-955 transition-colors mb-6"
                >
                  {tier.cta}
                </Button>

                {/* Features List */}
                <ul className="flex-grow space-y-3 border-t border-slate-100 pt-5 mb-6 text-xs font-semibold">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className="text-slate-655 font-medium leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-slate-100/80 pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>{tier.footerText}</span>
                  <span className={`text-[10px] font-bold ${tier.selected ? "text-sky-600" : "text-slate-500 hover:text-slate-850 cursor-pointer"}`}>
                    {tier.footerAction}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
