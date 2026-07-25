import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Calendar, ArrowRight, Loader2, Sparkles, Building, Landmark, Rocket, Store, Briefcase, Zap, Crown, Infinity, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const pricingTiers = [
  {
    name: "30-Day Free Trial",
    price: "₹0",
    period: "per 30 days",
    desc: "Start now and explore the platform free for 30 days",
    icon: Sparkles,
    iconBg: "bg-indigo-600/10 text-indigo-650",
    features: [
      "All core dashboard features",
      "Database-backed trial access",
      "Auto-logout after 30 days",
      "Upgrade to paid plan anytime",
    ],
    cta: "₹0 + ₹0 GST",
    popular: false,
    color: "border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm hover:border-slate-350",
    footerText: "FREE FOR 30 DAYS",
    footerAction: "Select plan",
    badge: "",
  },
  {
    name: "Monthly Subscription",
    price: "₹1,770",
    period: "per month",
    desc: "Perfect for getting started",
    icon: Zap,
    iconBg: "bg-sky-500/10 text-sky-600",
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

const SeventhSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    businessType: "small_business",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.businessName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields to book your free demo.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate API Submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Demo Request Submitted!",
        description: "We will contact you within 24 hours to schedule your personalized demo.",
      });
    }, 1500);
  };

  return (
    <section className="py-20 lg:py-12 space-y-24">
      {/* ─── Pricing block ─── */}
      <div id="pricing" className="space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
            Choose a plan that feels as{" "}
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              clear as the interface.
            </span>
          </h2>
          <p className="mt-4 text-sm font-medium text-slate-500 sm:text-base">
            Each plan is shown as its own card so pricing stays readable, distinct, and easy to compare.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {pricingTiers.map((tier, idx) => {
            const TierIcon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 transition-all duration-350 hover:shadow-md ${tier.color}`}
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
                      <h3 className="text-lg font-bold tracking-tight text-slate-900">{tier.name}</h3>
                      <p className="mt-1.5 text-xs font-medium text-slate-500 min-h-[32px]">
                        {tier.desc}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold tracking-tight text-slate-950">{tier.price}</span>
                      <p className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                        {tier.period}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Button / CTA */}
                <Button
                  onClick={() => {
                    toast({
                      title: `Selected ${tier.name}`,
                      description: "Book a demo to proceed with account setup.",
                    });
                  }}
                  className="w-full h-11 rounded-xl font-bold text-xs bg-slate-950 text-white hover:bg-slate-850 shadow-sm border border-slate-950 transition-colors mb-6"
                >
                  {tier.cta}
                </Button>

                {/* Features List */}
                <ul className="flex-1 space-y-3 border-t border-slate-100 pt-5 mb-6 text-xs font-semibold">
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
                  <span className={`text-[10px] font-bold ${tier.selected ? "text-sky-600" : "text-slate-500 hover:text-slate-800 cursor-pointer"}`}>
                    {tier.footerAction}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── Demo Booking Form Block ─── */}
      <div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 md:p-12 shadow-[0_12px_45px_rgba(15,23,42,0.06)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Form Description */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              Personalized Demo
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              See AIBASS in Action
            </h2>
            <p className="text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">
              Book a personalised demonstration and explore how AIBASS manages voice and text commands, invoicing, GST,
              inventory, financial reporting and cash-flow predictions.
            </p>

            {/* Micro value props */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {[
                "15-minute quick walkthrough of all features",
                "Learn how voice and text commands optimize workflows",
                "Answers to your customized GST and stock questions",
              ].map((val) => (
                <div key={val} className="flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0 text-sky-600" />
                  <p className="text-xs font-bold text-slate-700">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="booking-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-750 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ravi Kumar"
                        className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-750 uppercase tracking-wider">Business Name</label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Ravi Traders"
                        className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-750 uppercase tracking-wider">Work Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ravi@traders.com"
                        className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-750 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-750 uppercase tracking-wider">Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50 px-4 text-xs font-semibold text-slate-700 focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                    >
                      <option value="small_business">Small Business / Service</option>
                      <option value="startup">Startup / Tech</option>
                      <option value="retail">Retailer / Trader</option>
                      <option value="sme">SME / Manufacturing</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 mt-4 rounded-full bg-slate-950 text-white font-bold hover:bg-slate-850 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        Book My Free Demo
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 text-center space-y-4"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Demo Scheduled Successfully!</h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-600 max-w-sm mx-auto">
                    Thanks for reaching out! We've received your request for **{formData.businessName}**. An AIBASS specialist will email you shortly at **{formData.email}** with a demo link.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="h-10 rounded-full text-xs font-bold border-slate-200/80 bg-white"
                  >
                    Book another Demo
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeventhSection;
