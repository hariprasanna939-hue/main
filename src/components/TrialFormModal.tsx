import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TrialFormModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    business: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Listen for the global open event dispatched by all CTA buttons
  useEffect(() => {
    const handler = () => {
      navigate("/auth?tab=signup&plan=trial");
    };
    window.addEventListener("openTrialModal", handler);
    return () => window.removeEventListener("openTrialModal", handler);
  }, [navigate]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      close();
      navigate("/thank-you");
    }, 1200);
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="trial-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            key="trial-modal-card"
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 28 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header gradient stripe */}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)" }} />

            <div className="px-7 pt-6 pb-7">
              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 rounded-full p-1.5 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="flex flex-col items-center text-center py-8 gap-4"
                  >
                    <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="h-9 w-9 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">You're All Set!</h2>
                      <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                        Thanks, <span className="font-semibold text-slate-700">{form.fullName}</span>! Our team will reach you at <span className="font-semibold text-slate-700">{form.email}</span> to activate your 30-day free trial.
                      </p>
                    </div>
                    <button
                      onClick={close}
                      className="mt-2 h-11 px-6 rounded-full text-sm font-semibold text-white transition-all"
                      style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-1" style={{ color: "#2563eb" }}>
                      Start Your 30-Day Free Trial
                    </h2>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      Fill out the details below, and our team will get you set up with your free trial account immediately.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            id="trial-full-name"
                            type="text"
                            placeholder="John Doe"
                            value={form.fullName}
                            onChange={e => handleChange("fullName", e.target.value)}
                            className={`w-full pl-10 pr-4 h-12 rounded-xl border text-sm bg-slate-50 placeholder:text-slate-400 text-slate-900 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.fullName ? "border-red-400 focus:ring-red-100" : "border-slate-200"}`}
                          />
                        </div>
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            id="trial-email"
                            type="email"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={e => handleChange("email", e.target.value)}
                            className={`w-full pl-10 pr-4 h-12 rounded-xl border text-sm bg-slate-50 placeholder:text-slate-400 text-slate-900 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200"}`}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            id="trial-phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={form.phone}
                            onChange={e => handleChange("phone", e.target.value)}
                            className={`w-full pl-10 pr-4 h-12 rounded-xl border text-sm bg-slate-50 placeholder:text-slate-400 text-slate-900 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.phone ? "border-red-400 focus:ring-red-100" : "border-slate-200"}`}
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                      </div>

                      {/* Business Description */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                          Business Description
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <textarea
                            id="trial-business"
                            placeholder="Tell us a bit about your business and accounting needs..."
                            value={form.business}
                            onChange={e => handleChange("business", e.target.value)}
                            rows={3}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 placeholder:text-slate-400 text-slate-900 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        id="trial-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-full text-white text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                        style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)" }}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Setting up your account...
                          </>
                        ) : "Get Started Now"}
                      </button>

                      <p className="text-center text-[11px] text-slate-400 pt-1">
                        No credit card required · Cancel anytime
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
