import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Check, 
  Lock, 
  Mail, 
  Receipt, 
  CreditCard, 
  PackageCheck,
  ArrowRight,
  Star,
  Quote,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { API_ENDPOINTS, apiRequest } from "@/lib/api";
import { isTrialExpired } from "@/lib/trial";
import { motion, AnimatePresence } from "framer-motion";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
  theme: { color: string };
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: { plan?: string; planName?: string };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  gst: number;
  totalAmount: number;
  duration: string;
  description: string;
  features: string[];
  popular: boolean;
};

// Enriched plans with detailed features for the right-side cards
const subscriptionPlans = {
  trial: {
    id: "trial",
    name: "30-Day Sandbox",
    price: 0,
    gst: 0,
    totalAmount: 0,
    duration: "30 days",
    description: "Full access to test the platform.",
    features: [
      "Unlimited GST Invoicing",
      "Real-time ledger sync",
      "Standard email support"
    ],
    popular: false,
  },
  monthly: {
    id: "monthly",
    name: "Express Billing",
    price: 1500,
    gst: 270,
    totalAmount: 1770,
    duration: "month",
    description: "Perfect for growing small businesses.",
    features: [
      "Everything in Free Trial",
      "Payment link generation",
      "Basic inventory tracking"
    ],
    popular: false,
  },
  annual: {
    id: "annual",
    name: "Pro ERP & Tax",
    price: 16200,
    gst: 2916,
    totalAmount: 19116,
    duration: "year",
    description: "Save 10%. Full automation suite.",
    features: [
      "e-Invoicing (IRN) & e-Way bills",
      "Payroll & salary slip automation",
      "Priority CA & tech support"
    ],
    popular: true,
  },
  lifetime: {
    id: "lifetime",
    name: "Enterprise",
    price: 45000,
    gst: 8100,
    totalAmount: 53100,
    duration: "lifetime",
    description: "One-time cost for unlimited scale.",
    features: [
      "Multi-branch & warehouse prep",
      "Custom API & POS integrations",
      "Dedicated account manager"
    ],
    popular: false,
  }
} satisfies Record<string, SubscriptionPlan>;

type PlanKey = keyof typeof subscriptionPlans;

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [view, setView] = useState<"signin" | "signup">("signin");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("trial");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginRole, setLoginRole] = useState<"admin" | "instore">("admin");
  const [signupRole, setSignupRole] = useState<"admin" | "instore">("admin");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const plan = params.get("plan") as PlanKey | null;

    if (tab === "signup" || tab === "signin") setView(tab);
    if (plan && plan in subscriptionPlans) {
      setSelectedPlan(plan);
      if (plan === "trial") setView("signup");
    }
  }, [location.search]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest(API_ENDPOINTS.SIGNIN, {
        method: "POST",
        body: JSON.stringify({ email, password, role: loginRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (isTrialExpired(data.user)) {
        toast({ 
          variant: "destructive", 
          title: "Subscription Required", 
          description: "Your trial has expired. Please subscribe to continue accessing your ledgers." 
        });
        setView("signup");
        setSelectedPlan("monthly");
        return;
      }

      localStorage.setItem("token", data.token);
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      toast({ 
        variant: "destructive", 
        title: "Sign In Failed", 
        description: err instanceof Error ? err.message : "Invalid credentials." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast({ variant: "destructive", title: "Required", description: "Email and password are required." });
    }
    
    setPaymentLoading(true);

    try {
      if (selectedPlan === "trial") {
        setLoading(true);
        const trialRes = await apiRequest(API_ENDPOINTS.SIGNUP_TRIAL, {
          method: "POST",
          body: JSON.stringify({ email, password, name: name || email.split("@")[0], role: signupRole }),
        });
        const trialData = await trialRes.json();
        if (!trialRes.ok) throw new Error(trialData.message);

        localStorage.setItem("token", trialData.token);
        toast({ title: "Welcome!", description: "Initializing your billing workspace..." });
        setTimeout(() => navigate("/dashboard"), 500);
        return;
      }

      const orderRes = await apiRequest(API_ENDPOINTS.CREATE_ORDER, {
        method: "POST",
        body: JSON.stringify({ email, plan: selectedPlan }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message);

      if (orderData.devMode) {
        setLoading(true);
        const verifyRes = await apiRequest(API_ENDPOINTS.VERIFY_PAYMENT, {
          method: "POST",
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: "dev_payment_" + Date.now(),
            razorpay_signature: "dev_signature",
            email, password, name: name || email.split('@')[0], plan: selectedPlan, role: signupRole
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.message);
        
        localStorage.setItem("token", verifyData.token);
        setTimeout(() => navigate("/dashboard"), 500);
        return;
      }

      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SHREE ANDAL AI",
        description: `Billing License - ${subscriptionPlans[selectedPlan].name}`,
        order_id: orderData.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            setLoading(true);
            const verifyRes = await apiRequest(API_ENDPOINTS.VERIFY_PAYMENT, {
              method: "POST",
              body: JSON.stringify({ ...response, email, password, plan: selectedPlan, name: name || email.split('@')[0], role: signupRole }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message);
            
            localStorage.setItem("token", verifyData.token);
            setTimeout(() => navigate("/dashboard"), 500);
          } catch (err) {
            toast({ variant: "destructive", title: "Payment Error", description: err instanceof Error ? err.message : "Verification failed" });
          } finally {
            setLoading(false);
            setPaymentLoading(false);
          }
        },
        modal: { ondismiss: () => setPaymentLoading(false) },
        prefill: { email, name: name || email.split('@')[0] },
        theme: { color: "#006aff" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err instanceof Error ? err.message : "An error occurred." });
      setPaymentLoading(false);
      setLoading(false);
    }
  };

  const planEntries = Object.entries(subscriptionPlans) as Array<[PlanKey, SubscriptionPlan]>;

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-[#333] selection:bg-[#006aff]/20 selection:text-[#006aff]">
      
      {/* LEFT SIDE - AUTHENTICATION FORM */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col min-h-screen relative z-20 bg-white shadow-[10px_0_30px_rgba(0,0,0,0.03)] border-r border-[#eee]">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 bg-[#006aff] rounded-[6px] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[16px] tracking-tight text-[#111] leading-none">SHREE ANDAL AI</span>
              <span className="text-[10px] text-[#006aff] font-bold uppercase tracking-wider mt-0.5">Billing & Accounts</span>
            </div>
          </div>
          
          {/* Mobile Toggle */}
          <div className="lg:hidden text-[13px] font-medium">
            {view === "signin" ? (
              <span className="text-[#555]">New? <button onClick={() => {setView("signup"); setEmail(""); setPassword("");}} className="text-[#006aff] hover:underline font-semibold">Sign Up</button></span>
            ) : (
              <span className="text-[#555]">Registered? <button onClick={() => {setView("signin"); setEmail(""); setPassword("");}} className="text-[#006aff] hover:underline font-semibold">Sign In</button></span>
            )}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 pb-12 w-full max-w-[560px] mx-auto overflow-y-auto [&::-webkit-scrollbar]:hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="mb-8">
                <h1 className="text-[26px] font-bold text-[#111] tracking-tight mb-2">
                  {view === "signin" ? "Sign in to your portal" : "Create your account"}
                </h1>
                <p className="text-[14px] text-[#555] leading-relaxed">
                  {view === "signin" 
                    ? "Manage your invoices, track receivables, and automate your GST compliance." 
                    : "Create professional GST invoices & manage inventory in under 2 minutes. No credit card required."}
                </p>
              </div>

              {view === "signin" ? (
                /* --- SIGN IN FORM --- */
                <div className="flex flex-col h-full">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    {/* Role Selector Grid */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#333] mb-1.5">Choose portal access</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setLoginRole("admin")}
                          className={`p-3 rounded-[4px] border text-center transition-all ${
                            loginRole === "admin"
                              ? "border-[#006aff] bg-[#f2f8ff] text-[#006aff] font-bold"
                              : "border-[#ccc] bg-white text-[#555] font-semibold hover:border-[#aaa]"
                          }`}
                        >
                          <div className="text-[13px]">Admin Portal</div>
                          <div className="text-[10px] opacity-75 font-normal mt-0.5">Full CFO access</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoginRole("instore")}
                          className={`p-3 rounded-[4px] border text-center transition-all ${
                            loginRole === "instore"
                              ? "border-[#006aff] bg-[#f2f8ff] text-[#006aff] font-bold"
                              : "border-[#ccc] bg-white text-[#555] font-semibold hover:border-[#aaa]"
                          }`}
                        >
                          <div className="text-[13px]">In-Store POS</div>
                          <div className="text-[10px] opacity-75 font-normal mt-0.5">Cashier access</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[#333] mb-1.5">Business email address</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 w-[18px] h-[18px] text-[#999]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 pl-10 pr-10 bg-white border border-[#ccc] rounded-[4px] text-[15px] focus:border-[#006aff] focus:ring-1 focus:ring-[#006aff] outline-none transition-all placeholder:text-[#aaa]"
                          placeholder="name@company.com"
                          required
                        />
                        <div className="absolute right-2">
                          <VoiceButton onTranscript={setEmail} onClear={() => setEmail("")} size="sm" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[13px] font-bold text-[#333]">Password</label>
                        <a href="#" className="text-[12px] font-semibold text-[#006aff] hover:underline">Forgot password?</a>
                      </div>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 w-[18px] h-[18px] text-[#999]" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 bg-white border border-[#ccc] rounded-[4px] text-[15px] focus:border-[#006aff] focus:ring-1 focus:ring-[#006aff] outline-none transition-all placeholder:text-[#aaa]"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 mt-2 bg-[#006aff] hover:bg-[#005cdb] text-white font-bold text-[15px] rounded-[4px] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>

                  {/* START FREE TRIAL PROMO BOX (Under Sign In) */}
                  <div className="mt-8 pt-7 border-t border-[#eee]">
                    <div className="bg-[#f4f9ff] border border-[#cce3ff] rounded-[6px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_10px_rgba(0,106,255,0.05)]">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-4 h-4 text-[#006aff]" />
                          <h4 className="text-[14px] font-bold text-[#111]">New to SHREE ANDAL AI?</h4>
                        </div>
                        <p className="text-[13px] text-[#555] leading-snug">
                          Join thousands of businesses managing their GST billing and accounting with us.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setView("signup");
                          setSelectedPlan("trial");
                          setEmail("");
                          setPassword("");
                        }}
                        className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-white border border-[#006aff] text-[#006aff] text-[13px] font-bold rounded-[4px] hover:bg-[#006aff] hover:text-white transition-all shadow-sm"
                      >
                        Start Free Trial
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* --- SIGN UP FORM --- */
                <form onSubmit={handleSignUp} className="space-y-6">
                  
                  {/* Small Plan Indicator (Left side representation) */}
                  <div>
                    <label className="block text-[13px] font-bold text-[#333] mb-2">Selected Plan</label>
                    <div className="p-3 border border-[#006aff] bg-[#f2f8ff] rounded-[6px] flex items-center justify-between shadow-[0_0_0_1px_rgba(0,106,255,0.2)]">
                      <div>
                        <h4 className="text-[13px] font-bold text-[#006aff]">{subscriptionPlans[selectedPlan].name}</h4>
                        <p className="text-[11px] text-[#006aff]/80 font-medium">{subscriptionPlans[selectedPlan].description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[16px] font-black text-[#111]">{selectedPlan === "trial" ? "Free" : `₹${subscriptionPlans[selectedPlan].totalAmount.toLocaleString()}`}</p>
                        {selectedPlan !== "trial" && <p className="text-[10px] text-[#777] uppercase font-bold">/{subscriptionPlans[selectedPlan].duration}</p>}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#777] mt-2 block lg:hidden">* Swipe or scroll on desktop to compare other plans.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Role Selector Grid */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#333] mb-1.5">Choose your business role</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSignupRole("admin")}
                          className={`p-3 rounded-[4px] border text-center transition-all ${
                            signupRole === "admin"
                              ? "border-[#006aff] bg-[#f2f8ff] text-[#006aff] font-bold"
                              : "border-[#ccc] bg-white text-[#555] font-semibold hover:border-[#aaa]"
                          }`}
                        >
                          <div className="text-[13px]">Admin Portal</div>
                          <div className="text-[10px] opacity-75 font-normal mt-0.5">Management & P&L</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignupRole("instore")}
                          className={`p-3 rounded-[4px] border text-center transition-all ${
                            signupRole === "instore"
                              ? "border-[#006aff] bg-[#f2f8ff] text-[#006aff] font-bold"
                              : "border-[#ccc] bg-white text-[#555] font-semibold hover:border-[#aaa]"
                          }`}
                        >
                          <div className="text-[13px]">In-Store POS</div>
                          <div className="text-[10px] opacity-75 font-normal mt-0.5">Cashier Billing</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[#333] mb-1.5">Business email address</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 w-[18px] h-[18px] text-[#999]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 pl-10 pr-10 bg-white border border-[#ccc] rounded-[4px] text-[15px] focus:border-[#006aff] focus:ring-1 focus:ring-[#006aff] outline-none transition-all placeholder:text-[#aaa]"
                          placeholder="name@company.com"
                          required
                        />
                        <div className="absolute right-2">
                          <VoiceButton onTranscript={setEmail} onClear={() => setEmail("")} size="sm" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[#333] mb-1.5">Password</label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 w-[18px] h-[18px] text-[#999]" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 bg-white border border-[#ccc] rounded-[4px] text-[15px] focus:border-[#006aff] focus:ring-1 focus:ring-[#006aff] outline-none transition-all placeholder:text-[#aaa]"
                          placeholder="Create a strong password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || paymentLoading}
                    className={`w-full h-11 text-white font-bold text-[15px] rounded-[4px] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm mt-2 ${
                      selectedPlan === 'trial' ? 'bg-[#006aff] hover:bg-[#005cdb]' : 'bg-[#00b365] hover:bg-[#009c58]'
                    }`}
                  >
                    {paymentLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...</>
                    ) : loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Provisioning Account...</>
                    ) : selectedPlan === "trial" ? (
                      "Start 30-Day Free Trial"
                    ) : (
                      <><Lock className="w-4 h-4" /> Pay ₹{subscriptionPlans[selectedPlan].totalAmount.toLocaleString()} securely</>
                    )}
                  </button>

                  <p className="text-[11.5px] text-[#777] text-center mt-3 font-medium">
                    By proceeding, you agree to our <a href="#" className="text-[#006aff] hover:underline">Terms of Service</a> & <a href="#" className="text-[#006aff] hover:underline">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE - DYNAMIC SHOWCASE / PRICING PANEL (Desktop Only) */}
      <div className="hidden lg:flex flex-1 flex-col bg-[#f9fafd] relative overflow-hidden">
        
        {/* Toggle link Top Right */}
        <div className="absolute top-6 right-8 text-[14px] font-medium z-30 flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#eee] shadow-sm">
          {view === "signin" ? (
            <>
              <span className="text-[#555]">Need billing software?</span>
              <button onClick={() => {setView("signup"); setEmail(""); setPassword("");}} className="text-[#006aff] font-bold hover:underline">Start Free Trial</button>
            </>
          ) : (
            <>
              <span className="text-[#555]">Already registered?</span>
              <button onClick={() => {setView("signin"); setEmail(""); setPassword("");}} className="text-[#006aff] font-bold hover:underline">Sign In</button>
            </>
          )}
        </div>

        {/* Ambient background accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#dbebff] to-transparent rounded-full opacity-60 translate-x-[30%] -translate-y-[30%] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#fde9e8] to-transparent rounded-full opacity-50 -translate-x-[30%] translate-y-[30%] pointer-events-none z-0" />

        <AnimatePresence mode="wait">
          {view === "signin" ? (
            /* --- RIGHT SIDE: FEATURE SHOWCASE (FOR SIGN IN) --- */
            <motion.div 
              key="showcase"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center items-center p-12 z-10 w-full max-w-[600px] mx-auto"
            >
              <div className="flex items-center gap-2 mb-8 bg-white px-4 py-2 rounded-full shadow-sm border border-[#eee]">
                <div className="flex text-[#f59e0b]">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[12px] font-bold text-[#333]">Trusted by 10,000+ businesses</span>
              </div>

              <div className="text-center mb-10">
                <h2 className="text-[32px] font-black text-[#111] leading-tight mb-4 tracking-tight">
                  Automated Billing &<br />e-Invoicing Software
                </h2>
                <p className="text-[16px] text-[#555] leading-relaxed font-medium">
                  Create professional GST invoices, track outstanding receivables, and automate customer payment links instantly.
                </p>
              </div>

              <div className="space-y-4 w-full">
                <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eee] flex gap-4 items-start hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-[42px] h-[42px] rounded-lg bg-[#e8f2ff] flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5 text-[#006aff]" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#222] mb-1">Instant GST & e-Invoicing</h4>
                    <p className="text-[13px] text-[#666] leading-relaxed">Generate IRN e-invoices, e-way bills, and automated tax calculations (CGST, SGST, IGST) in seconds.</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eee] flex gap-4 items-start hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-[42px] h-[42px] rounded-lg bg-[#fde9e8] flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-[#f0483e]" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#222] mb-1">Payment Links & Reminders</h4>
                    <p className="text-[13px] text-[#666] leading-relaxed">Attach online payment links directly to bills and send automated payment reminders to get paid 3x faster.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 relative">
                <Quote className="absolute -top-3 -left-4 w-8 h-8 text-[#006aff] opacity-10 rotate-180" />
                <p className="text-[14px] italic text-[#555] font-medium leading-relaxed text-center px-6">
                  "Switching to this platform completely changed how we handle our monthly billing. The automated GST reports alone save us hours every week."
                </p>
                <p className="text-[12px] font-bold text-[#333] text-center mt-3">— Finance Director, TechCorp India</p>
              </div>
            </motion.div>
          ) : (
            /* --- RIGHT SIDE: DETAILED PRICING GRID (FOR SIGN UP) --- */
            <motion.div 
              key="pricing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center items-center p-10 z-10 w-full max-w-[800px] mx-auto overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="text-center mb-8">
                <h2 className="text-[28px] font-black text-[#111] leading-tight mb-2 tracking-tight">
                  Transparent pricing. No hidden fees.
                </h2>
                <p className="text-[15px] text-[#555] font-medium">
                  Select a plan that fits your business needs. Your selection on the right automatically updates the form on the left.
                </p>
              </div>

              {/* 2x2 Pricing Grid */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {planEntries.map(([key, plan]) => {
                  const isSelected = selectedPlan === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedPlan(key as PlanKey)}
                      className={`relative flex flex-col p-5 bg-white border-2 rounded-[12px] cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#006aff] shadow-[0_8px_30px_rgba(0,106,255,0.12)] -translate-y-1' 
                          : 'border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:border-[#dbebff]'
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md z-10">
                          Most Popular
                        </div>
                      )}
                      
                      {/* Plan Header */}
                      <div className="flex items-center justify-between mb-2 mt-2">
                        <h3 className={`text-[15px] font-bold ${isSelected ? 'text-[#006aff]' : 'text-[#222]'}`}>{plan.name}</h3>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#006aff] bg-[#006aff]' : 'border-[#ddd]'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                      </div>
                      
                      <p className="text-[12px] text-[#666] mb-4 h-[36px]">{plan.description}</p>
                      
                      {/* Price Section */}
                      <div className="mb-4 pb-4 border-b border-[#eee]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[26px] font-black text-[#111] tracking-tight">
                            {key === "trial" ? "Free" : `₹${(plan.totalAmount).toLocaleString()}`}
                          </span>
                          {key !== "trial" && <span className="text-[12px] text-[#777] font-bold uppercase">/{plan.duration}</span>}
                        </div>
                        {key !== "trial" && (
                          <div className="text-[10px] font-bold text-[#888] mt-1">
                            ₹{plan.price.toLocaleString()} + ₹{plan.gst.toLocaleString()} GST
                          </div>
                        )}
                      </div>

                      {/* Features List */}
                      <ul className="space-y-2.5 flex-1">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-[#006aff]' : 'text-[#00b365]'}`} />
                            <span className="text-[12px] font-medium text-[#444] leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Auth;