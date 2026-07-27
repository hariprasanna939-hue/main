'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, Loader2, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process request.');
      }

      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-955 to-black px-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo/indsrilogo.png"
            alt="India Sri Lanka Escapes"
            className="h-12 w-auto object-contain mb-3"
          />
          <h2 className="text-lg font-semibold text-slate-300 tracking-tight mb-2">Forgot Password</h2>
          <p className="text-xs text-slate-400 text-center mt-1 px-4 max-w-sm">
            Enter your admin email address and we'll send a password reset link straight to your inbox.
          </p>
        </div>

        {/* Success/Error Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-3 text-emerald-400 text-sm">
            <Sparkles className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-semibold">{successMsg}</p>
              <p className="text-emerald-500/70 text-xs mt-1">Check your inbox (and spam folder) for the reset link.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@escape.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-955/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-primary transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-slate-950 rounded-xl font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
