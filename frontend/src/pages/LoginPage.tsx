import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (e) {
      // toast shown in context
    }
  };

  const handleDemo = async () => {
    setIsDemoLoading(true);
    try {
      await demoLogin();
      navigate('/');
    } catch (e) {
      // toast shown in context
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fef9ef] text-[#1d1c16] font-body flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#d9582b] selection:text-white">
      <div className="w-full max-w-5xl mx-auto my-auto py-6">
        {/* Top Archival Tag */}
        <div className="flex items-center justify-between px-2 pb-2 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#7e5300]">
            <BookOpen className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase">ACADEMIC LEDGER • VOL. 2025</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="bg-[#ede8de] border border-[#ddd5c4] text-[#58413a] px-2 py-0.5 rounded text-[11px]">
              SYS_ID: ARCHIVE-SECURE
            </span>
            <span className="text-[#3f7d58] flex items-center gap-1.5 font-bold text-[11px]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#3f7d58] animate-pulse"></span>
              DISPATCH READY
            </span>
          </div>
        </div>

        {/* Main Split Paper Folio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-lg border border-[#ddd5c4] shadow-paper-elevated overflow-hidden bg-white">
          {/* LEFT SIDE: AUTHENTICATION FORM CONSOLE (7 cols) */}
          <section className="lg:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-between">
            <div className="w-full max-w-md mx-auto">
              {/* Brand Signature */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo.svg"
                  alt="DueWise Logo"
                  className="w-10 h-10 rounded-lg shadow-sm object-contain"
                />
                <div>
                  <h1 className="font-headline font-bold text-xl text-[#1d1c16] tracking-tight">
                    DueWise
                  </h1>
                  <p className="font-mono text-xs text-[#8c7169]">Smart Academic Desk &amp; Deadlines</p>
                </div>
              </div>

              {/* Notebook Folder Toggle Tabs */}
              <div className="flex items-center bg-[#f2ede3] p-1 rounded mb-6 border border-[#ddd5c4]">
                <button
                  type="button"
                  className="flex-1 py-2 text-center rounded font-semibold text-xs transition bg-white shadow-sm text-[#d9582b] border border-[#ddd5c4]"
                >
                  Student Log In
                </button>
                <Link
                  to="/register"
                  className="flex-1 py-2 text-center rounded font-semibold text-xs transition text-[#58413a] hover:text-[#1d1c16]"
                >
                  Create Account
                </Link>
              </div>

              {/* Demo Student Fast Login Card (Highlight for Evaluators / Presentations) */}
              <div className="p-4 rounded bg-[#fcf8ee] border border-[#c98a1b]/40 shadow-sm mb-6 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffddb2] text-[#7e5300] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#d9582b]" /> Presentation Demo Mode
                  </span>
                  <span className="font-mono text-[10px] text-[#8c7169]">Zero Setup Required</span>
                </div>
                <p className="text-xs text-[#58413a] leading-relaxed">
                  Instant evaluation account preloaded with realistic B.Tech coursework, lab records,
                  upcoming deadlines, and proactive reminders.
                </p>
                <button
                  type="button"
                  onClick={handleDemo}
                  disabled={isDemoLoading || isLoading}
                  className="w-full py-2.5 px-4 rounded bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-paper transition active:translate-y-0.5 disabled:opacity-60"
                >
                  <span>
                    {isDemoLoading ? 'Loading Demo Profile...' : '1-Click Demo Student Login'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Traditional Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-[#1d1c16]">University / Institutional Email</label>
                    <span className="font-mono text-[10px] text-[#8c7169]">.edu / .ac.in</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@student.edu"
                      className="w-full pl-9 pr-3 py-2.5 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] placeholder:text-[#8c7169] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-[#1d1c16]">Password</label>
                    <span className="font-mono text-[10px] text-[#8c7169]">Min 6 chars</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] placeholder:text-[#8c7169] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7169] hover:text-[#1d1c16]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Auxiliary */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#58413a]">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-[#ddd5c4] text-[#d9582b] focus:ring-0 accent-[#d9582b]"
                    />
                    <span>Remember on this browser</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('For this academic project, use demo@student.edu or click Demo Login.')
                    }
                    className="text-[#d9582b] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded bg-[#1d1c16] hover:bg-[#32302a] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-paper transition active:translate-y-0.5 disabled:opacity-60"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying Session...' : 'Log In to My Notebook'}</span>
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-[#58413a]">
                <span>Don't have an academic profile yet? </span>
                <Link to="/register" className="text-[#d9582b] font-semibold hover:underline">
                  Create Account
                </Link>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE: FOLIO INDEX / ARCHIVE SUMMARY (5 cols) */}
          <section className="lg:col-span-5 p-6 sm:p-10 bg-[#f8f3e9] border-t lg:border-t-0 lg:border-l border-[#ddd5c4] flex flex-col justify-between relative">
            <div className="space-y-6">
              <div>
                <span className="stamp-badge stamp-badge-course mb-2">[ACADEMIC DISPATCH]</span>
                <h2 className="font-headline font-bold text-xl text-[#1d1c16]">
                  University Coursework &amp; Submission Hub
                </h2>
                <p className="text-xs text-[#58413a] mt-2 leading-relaxed">
                  Centralized academic record keeping designed for B.Tech engineering coursework,
                  laboratory journals, and capstone presentations.
                </p>
              </div>

              {/* Mini Ruled Ledger Preview */}
              <div className="p-4 bg-white border border-[#ddd5c4] rounded shadow-paper space-y-3">
                <div className="flex items-center justify-between border-b border-[#ddd5c4] pb-2 font-mono text-[10px] text-[#8c7169]">
                  <span>COURSE BINDER</span>
                  <span>DELIVERABLE</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="stamp-badge stamp-badge-urgent">CS601</span>
                    <span className="font-medium text-[#1d1c16]">Kubernetes Cluster Lab</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#d9582b]">DUE 18:00</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="stamp-badge stamp-badge-draft">CS602</span>
                    <span className="font-medium text-[#1d1c16]">CNN Retinal Report</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#c98a1b]">IN DRAFT</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="stamp-badge stamp-badge-completed">CS605</span>
                    <span className="font-medium text-[#8c7169] line-through">RSA Problem Set</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#3f7d58]">VERIFIED</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#58413a]">
                  <CheckCircle2 className="w-4 h-4 text-[#3f7d58] shrink-0" />
                  <span>Automated 72h and 24h cron deadline alerts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#58413a]">
                  <CheckCircle2 className="w-4 h-4 text-[#3f7d58] shrink-0" />
                  <span>Dual-tracking analytics (estimated vs actual hours)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#58413a]">
                  <CheckCircle2 className="w-4 h-4 text-[#3f7d58] shrink-0" />
                  <span>1-click B.Tech defense presentation viewer</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#ddd5c4] flex items-center justify-between text-[11px] font-mono text-[#8c7169]">
              <span>SECURE JWT SESSION</span>
              <Link to="/" className="text-[#d9582b] hover:underline font-bold">
                ← BACK TO HOME
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
