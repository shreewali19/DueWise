import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  School,
  Building,
  GraduationCap,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('Apex Institute of Technology');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('6th Semester');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password, college, department, semester });
      navigate('/');
    } catch (e) {
      // toast shown in context
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
              REGISTRATION DESK
            </span>
            <span className="text-[#3f7d58] flex items-center gap-1.5 font-bold text-[11px]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#3f7d58] animate-pulse"></span>
              NEW STUDENT ENTRY
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
                  <p className="font-mono text-xs text-[#8c7169]">Student Account Enrolment</p>
                </div>
              </div>

              {/* Notebook Folder Toggle Tabs */}
              <div className="flex items-center bg-[#f2ede3] p-1 rounded mb-6 border border-[#ddd5c4]">
                <Link
                  to="/login"
                  className="flex-1 py-2 text-center rounded font-semibold text-xs transition text-[#58413a] hover:text-[#1d1c16]"
                >
                  Student Log In
                </Link>
                <button
                  type="button"
                  className="flex-1 py-2 text-center rounded font-semibold text-xs transition bg-white shadow-sm text-[#d9582b] border border-[#ddd5c4]"
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1d1c16]">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aditya Verma"
                      className="w-full pl-9 pr-3 py-2 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] placeholder:text-[#8c7169] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-[#1d1c16]">University Email *</label>
                    <span className="font-mono text-[10px] text-[#8c7169]">.edu / .ac.in</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aditya@college.edu"
                      className="w-full pl-9 pr-3 py-2 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] placeholder:text-[#8c7169] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1d1c16]">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] placeholder:text-[#8c7169] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* College & Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#1d1c16]">College / University</label>
                    <div className="relative">
                      <School className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#1d1c16]">Current Semester</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1d1c16]">Academic Branch / Department</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#8c7169] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded bg-[#fef9ef] border border-[#ddd5c4] text-xs text-[#1d1c16] focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded bg-[#d9582b] hover:bg-[#c84c20] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-paper transition active:translate-y-0.5 disabled:opacity-60"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isLoading ? 'Creating Profile...' : 'Register Student Ledger'}</span>
                  </button>
                </div>
              </form>

              <div className="mt-5 text-center text-xs text-[#58413a]">
                <span>Already registered? </span>
                <Link to="/login" className="text-[#d9582b] font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE: FOLIO INDEX / ARCHIVE SUMMARY (5 cols) */}
          <section className="lg:col-span-5 p-6 sm:p-10 bg-[#f8f3e9] border-t lg:border-t-0 lg:border-l border-[#ddd5c4] flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="stamp-badge stamp-badge-course mb-2">[LEDGER PRIVILEGES]</span>
                <h2 className="font-headline font-bold text-xl text-[#1d1c16]">
                  Personalized Student Dossier
                </h2>
                <p className="text-xs text-[#58413a] mt-2 leading-relaxed">
                  Upon account creation, your academic profile is equipped with an automated cron
                  daemon that evaluates impending submission deadlines every few minutes.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#ddd5c4] rounded shadow-paper space-y-2.5">
                <div className="font-mono text-[10px] text-[#8c7169] uppercase border-b border-[#ddd5c4] pb-1.5 font-bold">
                  Included Features
                </div>
                <div className="flex items-center gap-2 text-xs text-[#1d1c16]">
                  <CheckCircle2 className="w-4 h-4 text-[#3f7d58]" />
                  <span>Proactive &lt; 24h &amp; 72h notifications</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#1d1c16]">
                  <CheckCircle2 className="w-4 h-4 text-[#3f7d58]" />
                  <span>Multi-course color categorization</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#1d1c16]">
                  <CheckCircle2 className="w-4 h-4 text-[#3f7d58]" />
                  <span>Dual-tracking study hours &amp; velocity analytics</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#1d1c16]">
                  <CheckCircle2 className="w-4 h-4 text-[#3f7d58]" />
                  <span>CSV schedule export for semester defense</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#ddd5c4] flex items-center justify-between text-[11px] font-mono text-[#8c7169]">
              <span>SQLITE PERSISTENCE</span>
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
