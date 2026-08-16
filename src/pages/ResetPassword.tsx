import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, API_ENDPOINTS } from "@/lib/api";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff, Hexagon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        variant: "destructive",
        title: "Invalid Token",
        description: "Password reset token is missing from the URL. Please request a new link.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      toast({
        title: "Success",
        description: "Password reset successfully. Please login with your new password.",
      });

      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-[#0f172a] flex items-center justify-center py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] bg-white border border-[#e2e8f0] rounded-[24px] shadow-xl p-8 sm:p-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center text-white mb-4 shadow-md">
            <Hexagon className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight mb-2">Reset password</h1>
          <p className="text-[14px] text-[#64748b] text-center font-medium">Enter a secure new password to update your account access credentials.</p>
        </div>

        {!token ? (
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
              The reset token is missing or invalid. Please request a new password reset link.
            </div>
            <button
              onClick={() => navigate("/auth?tab=signin")}
              className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold rounded-[10px] transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-[#333] mb-2 uppercase tracking-wide">New Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-[18px] h-[18px] text-[#94a3b8]" />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full h-12 pl-10 pr-11 bg-white border border-[#cbd5e1] rounded-[10px] text-[15px] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none transition-all placeholder:text-[#94a3b8]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#333] mb-2 uppercase tracking-wide">Confirm New Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-[18px] h-[18px] text-[#94a3b8]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-12 pl-10 pr-11 bg-white border border-[#cbd5e1] rounded-[10px] text-[15px] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none transition-all placeholder:text-[#94a3b8]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-[15px] rounded-[10px] transition-colors flex items-center justify-center gap-2 shadow-sm mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving new password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Password</span>
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/auth?tab=signin")}
                className="text-[13px] font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
