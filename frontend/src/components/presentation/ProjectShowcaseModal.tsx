import React, { useState } from 'react';
import {
  X,
  Presentation,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ProjectShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectShowcaseModal: React.FC<ProjectShowcaseModalProps> = ({ isOpen, onClose }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Title & Overview',
      subtitle: 'B.Tech Engineering Project Presentation',
      icon: Presentation,
      content: (
        <div className="text-center py-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            🎓 B.Tech Engineering Project Presentation
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            DueWise — Smart Academic Task &amp; Deadline Manager
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An intelligent mobile and web solution designed to streamline academic submissions, eradicate late deadlines, and elevate student productivity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-blue-400 text-sm mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Project Overview
              </h4>
              <p className="text-xs text-slate-400">
                A robust cross-platform mobile and web utility built to help students systematically organize, track, and submit academic coursework without missing strict submission timelines.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-purple-400 text-sm mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Core Purpose
              </h4>
              <p className="text-xs text-slate-400">
                With multiple subjects and overlapping schedules, students frequently lose track of deadlines. This application bridges the gap by acting as an automated digital secretary for all academic deliverables.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Problem Statement',
      subtitle: 'Academic Pain Points & Cognitive Overload',
      icon: AlertTriangle,
      content: (
        <div className="space-y-6 py-4">
          <p className="text-slate-300 text-sm">
            College students routinely navigate diverse coursework across 5-8 subjects simultaneously. The absence of a unified academic scheduling mechanism causes critical issues:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-white text-base">Memory Reliance</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students routinely depend on fragile mental memory or misplaced handwritten notes to track assignments, resulting in frequent oversights and missed marks.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-white text-base">Fragmented Systems</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The complete lack of a consolidated, automated alert mechanism means crucial deadlines pass unnoticed until penalty marks and grade deductions are incurred.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-white text-base">Organizational Chaos</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Managing diverse multi-subject projects without a centralized platform introduces immense stress and reduces overall semester academic performance.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Existing System vs Proposed System',
      subtitle: 'Comparative Evaluation',
      icon: Layers,
      content: (
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/30 space-y-3">
              <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                ❌ Existing System Limitations
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Traditional Mediums:</strong> Reliance on paper notebooks, physical diaries, and static wall calendars lacking proactive notification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Manual Interventions:</strong> Mobile alarms and calendar entries must be manually configured for each specific task and subject.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Multi-Subject Friction:</strong> Highly cumbersome to manage assignments across various concurrent college courses without categorization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Zero Tracking Analytics:</strong> Absence of a unified dashboard to differentiate completed tasks from pending deliverables at a glance.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                ✅ Objectives of Proposed System
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Proactive Reminders:</strong> Deliver timely, automated push & in-app notifications before impending assignment deadlines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Subject Categorization:</strong> Cleanly structure and filter assignments according to academic courses, departments, and semesters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Efficiency & Punctuality:</strong> Drastically minimize late submissions and academic penalties through systematic time management.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Intuitive UI/UX:</strong> Offer a seamless, responsive, modern interface accessible across mobile and desktop devices.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'System Workflow & Lifecycle',
      subtitle: 'End-to-End User Data Lifecycle Architecture',
      icon: Cpu,
      content: (
        <div className="space-y-6 py-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-6 text-center">
              End-to-End User Data Lifecycle
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
              {[
                { title: 'Student Login', desc: 'Secure JWT Auth & Demo Mode' },
                { title: 'Dashboard', desc: 'Dual-Tracking KPIs & Analytics' },
                { title: 'Add Task', desc: 'Subject, Due Date & Priority' },
                { title: 'Cloud DB', desc: 'Persistent Prisma Relational Store' },
                { title: 'Notification', desc: 'Background Cron & Web Push' },
                { title: 'Complete', desc: 'Verified Submission & Archive' },
              ].map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <div className="flex-1 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 w-full md:w-auto">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                      {idx + 1}
                    </div>
                    <div className="text-xs font-bold text-white">{step.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{step.desc}</div>
                  </div>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Frontend</span>
              <span className="font-semibold text-white">React 18 + Vite + Tailwind</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Backend API</span>
              <span className="font-semibold text-white">Node.js + Express + TypeScript</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">ORM & Database</span>
              <span className="font-semibold text-white">Prisma ORM + Persistent DB</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Automated Engine</span>
              <span className="font-semibold text-white">Node-Cron + Web Notifications</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Unique Selling Proposition (USP)',
      subtitle: 'Key Differentiators & Competitive Advantage',
      icon: Sparkles,
      content: (
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-b from-blue-900/30 to-slate-900 border border-blue-700/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                🔔
              </div>
              <h4 className="font-bold text-white text-base">Smart Notifications</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated reminders triggered dynamically based on approaching deadlines and task priority levels (Urgent &lt; 24h, Approaching &lt; 48h, Custom Offsets).
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-b from-purple-900/30 to-slate-900 border border-purple-700/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-lg">
                📊
              </div>
              <h4 className="font-bold text-white text-base">Dual Tracking</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Effortlessly differentiate between pending requirements and successfully finalized academic assignments with interactive completion progress rates and visual analytics.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-b from-amber-900/30 to-slate-900 border border-amber-700/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <h4 className="font-bold text-white text-base">Productivity Boost</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Designed to minimize cognitive load, save valuable study hours, prevent late submission penalties, and eliminate missed submissions entirely.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Target Audience & Future Scope',
      subtitle: 'Applications & Prospective Enhancements',
      icon: Target,
      content: (
        <div className="space-y-4 py-2">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-300 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Sector / Institution</th>
                  <th className="p-2.5">Target Audience</th>
                  <th className="p-2.5">Primary Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2.5 font-medium text-white">Engineering Colleges</td>
                  <td className="p-2.5 text-blue-400">B.Tech / Diploma Students</td>
                  <td className="p-2.5">Manage complex lab records, technical reports, and project submissions.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Schools & Universities</td>
                  <td className="p-2.5 text-purple-400">General Academic Students</td>
                  <td className="p-2.5">Organize semester homework, essays, and internal test schedules.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Coaching Institutes</td>
                  <td className="p-2.5 text-amber-400">Competitive Exam Aspirants</td>
                  <td className="p-2.5">Track daily practice problem sets (DPPs) and mock test deliverables.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Online Learning Platforms</td>
                  <td className="p-2.5 text-emerald-400">Remote & Self-Learners</td>
                  <td className="p-2.5">Keep pace with modular course deadlines and certificate milestones.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
              <span className="font-bold text-blue-400 block mb-1">🚀 Future Enhancements</span>
              <p className="text-slate-400">
                AI-powered smart scheduling suggestions, voice assistant integration (Google/Alexa), and teacher portal for direct course task broadcasting.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
              <span className="font-bold text-amber-400 block mb-1">⚠️ Known System Limitations</span>
              <p className="text-slate-400">
                Requires network connectivity for real-time cloud synchronization; depends on user permissions for desktop browser notifications.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[activeSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Project Presentation Showcase
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                  Slide {activeSlide + 1} of {slides.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {current.content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === activeSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
              disabled={activeSlide === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={activeSlide === slides.length - 1}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
