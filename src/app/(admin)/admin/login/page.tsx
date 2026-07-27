'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Lock, Loader2, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed.');
      }

      setSuccessMsg('Success! Redirecting...');
      
      // Force a full reload / route change to ensure middleware detects the new cookie
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSeed = async () => {
    setSeedLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to seed database.');
      }

      // Autofill inputs
      setEmail(data.email);
      setPassword(data.password);
      setSuccessMsg('Admin account seeded and loaded! Click Login to enter.');
    } catch (err: any) {
      setError(err.message || 'Failed to run seed script.');
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-955 to-black px-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-dark/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo/indsrilogo.png"
            alt="India Sri Lanka Escapes"
            className="h-12 w-auto object-contain mb-3"
          />
          <h2 className="text-lg font-semibold text-slate-300 tracking-tight">Admin Portal</h2>
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
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs text-primary hover:text-primary-light font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-slate-955/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-primary transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || seedLoading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-slate-950 rounded-xl font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900/60 px-3 text-slate-500 font-semibold tracking-wider">
              Developer Actions
            </span>
          </div>
        </div>

        {/* Quick Seed Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleQuickSeed}
            disabled={loading || seedLoading}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 border border-slate-700 text-xs text-primary font-semibold cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            {seedLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span>Seeding database...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span>⚡ Quick Seed Admin (Dev Only)</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-500 mt-2">
            Seeds a default admin user and autofills credentials.
          </p>
        </div>

      </div>
    </div>
  );
}

