import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProjectShowcaseModal } from '../components/presentation/ProjectShowcaseModal';
import {
  BookOpen,
  Calendar,
  BarChart3,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Presentation,
  Sparkles,
  ExternalLink,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { demoLogin, user } = useAuth();
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [serverTime, setServerTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setServerTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoAccess = async () => {
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
    <div className="min-h-screen bg-[#fef9ef] text-[#1d1c16] font-body flex flex-col selection:bg-[#d9582b] selection:text-white">
      {/* Top Utility Bar: Archival Ledger Header */}
      <div className="w-full bg-[#ede8de] border-b border-[#ddd5c4] py-1.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#58413a]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-[#2b6a47]">
              <span className="w-2 h-2 rounded-full bg-[#2b6a47] animate-pulse"></span>
              LEDGER VER. 2.4 // ACADEMIC YEAR 2024–25
            </span>
            <span className="hidden md:inline text-[#e0bfb6]">•</span>
            <span className="hidden md:inline text-[#58413a]">
              ENGINEERING LABS &amp; CONTINUOUS EVALUATION MODULE
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#7e5300] font-medium font-mono">
              SERVER TIME: {serverTime || '14:00:00 IST'}
            </span>
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="text-[#d9582b] hover:underline uppercase font-bold tracking-wider flex items-center gap-1"
            >
              <span>DEFENSE SLIDES</span>
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-[#f8f3e9]/95 backdrop-blur-md border-b border-[#ddd5c4] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.svg"
              alt="DueWise Logo"
              className="w-10 h-10 rounded-lg shadow-sm object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl text-[#1d1c16] tracking-tight group-hover:text-[#d9582b] transition">
                DueWise
              </span>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#58413a]">
                Smart Academic Desk • Deadline Intelligence
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <a
              href="#manifesto"
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#58413a] hover:text-[#1d1c16] hover:bg-[#ede8de] transition"
            >
              Overview
            </a>
            <a
              href="#planner-preview"
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#58413a] hover:text-[#1d1c16] hover:bg-[#ede8de] transition"
            >
              Notebook Ledger
            </a>
            <a
              href="#features"
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#58413a] hover:text-[#1d1c16] hover:bg-[#ede8de] transition"
            >
              System Architecture
            </a>
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#d9582b] hover:bg-[#ffdbd0]/50 transition flex items-center gap-1"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Viva Deck</span>
            </button>
          </nav>

          {/* Action cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link
                to="/"
                className="px-4 py-2 bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold rounded shadow-paper transition flex items-center gap-1.5"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoAccess}
                  disabled={isDemoLoading}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f2ede3] hover:bg-[#ede8de] text-[#1d1c16] border border-[#ddd5c4] text-xs font-semibold rounded shadow-paper transition"
                  title="Zero-password evaluation student login"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d9582b]" />
                  <span>{isDemoLoading ? 'Entering...' : '1-Click Demo'}</span>
                </button>
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-[#58413a] hover:text-[#1d1c16] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold rounded shadow-paper transition flex items-center gap-1.5"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="manifesto" className="relative w-full py-12 md:py-16 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Manifesto */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-[#f2ede3] border border-[#ddd5c4] text-[#d9582b] font-mono text-[11px] font-bold uppercase tracking-wider">
                [INSTITUTIONAL GRADE]
              </span>
              <span className="text-[#8c7169] font-mono text-xs">SYS-ID: BTECH.SCHED.88</span>
            </div>

            <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1d1c16] tracking-tight leading-[1.1] mb-4">
              Never miss a deadline again.
            </h1>

            <p className="font-body text-[#58413a] text-base md:text-lg mb-6 leading-relaxed">
              A structured reminder app built for engineering coursework, lab submissions, and term
              papers. No dopamine loops, no social feeds—just crisp, archival timestamps that keep
              your semester intact.
            </p>

            {/* CTA cluster */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={handleDemoAccess}
                disabled={isDemoLoading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#d9582b] hover:bg-[#c84c20] text-white font-semibold text-xs rounded shadow-paper transition active:translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isDemoLoading ? 'Loading Profile...' : 'Launch Demo Student Mode'}</span>
              </button>

              <button
                onClick={() => setIsPresentationOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 bg-[#ffffff] hover:bg-[#f8f3e9] text-[#1d1c16] border border-[#ddd5c4] font-semibold text-xs rounded shadow-paper transition"
              >
                <Presentation className="w-4 h-4 text-[#7e5300]" />
                <span>Project Slide Deck</span>
              </button>
            </div>

            {/* Metrics Ledger Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#f8f3e9] border border-[#ddd5c4] rounded">
              <div className="flex flex-col">
                <span className="font-headline font-bold text-2xl text-[#d9582b] leading-none">
                  0%
                </span>
                <span className="text-[11px] text-[#8c7169] font-medium mt-1">
                  Penalty Slippage
                </span>
              </div>
              <div className="flex flex-col border-l border-[#ddd5c4] pl-3">
                <span className="font-headline font-bold text-2xl text-[#2b6a47] leading-none">
                  100%
                </span>
                <span className="text-[11px] text-[#8c7169] font-medium mt-1">
                  Lab Record Audit
                </span>
              </div>
              <div className="flex flex-col border-l border-[#ddd5c4] pl-3">
                <span className="font-headline font-bold text-2xl text-[#1d1c16] leading-none">
                  3-Tier
                </span>
                <span className="text-[11px] text-[#8c7169] font-medium mt-1">
                  Urgency Alerts
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[#58413a] font-mono text-xs">
              <ShieldCheck className="w-4 h-4 text-[#2b6a47]" />
              <span>Full-Stack Verified: Express, Prisma SQLite, Node-Cron, React 18</span>
            </div>
          </div>

          {/* Right Column: Interactive Notebook Preview */}
          <div className="lg:col-span-7 relative" id="planner-preview">
            <div className="absolute -top-3 right-4 z-20 px-2.5 py-0.5 bg-[#ede8de] border border-[#ddd5c4] text-[#7e5300] font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm">
              [PORTAL SYNC ACTIVE // SEMESTER 06]
            </div>

            {/* Physical Notebook Canvas */}
            <div className="w-full bg-[#ffffff] border border-[#ddd5c4] shadow-paper-elevated rounded-lg p-5 md:p-7 relative overflow-hidden">
              {/* Red Margin Line (4.5rem from left) */}
              <div className="hidden sm:block absolute top-0 bottom-0 left-[4.5rem] w-0.5 bg-[#d9582b]/70 pointer-events-none z-10"></div>

              {/* Binder Header */}
              <div className="flex flex-wrap items-center justify-between pb-3 mb-4 bg-[#f8f3e9] border border-[#ddd5c4] p-3 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
                  <span className="font-headline font-bold text-sm text-[#1d1c16]">
                    Weekly Ledger Queue
                  </span>
                  <span className="font-mono text-xs text-[#8c7169]">OCT 21 – OCT 27</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-[#fdf4f0] border border-[#d9582b] text-[#d9582b] font-mono text-[10px] font-bold">
                    3 DUE SOON
                  </span>
                  <span className="px-2 py-0.5 bg-[#f0f6f2] border border-[#3f7d58] text-[#3f7d58] font-mono text-[10px] font-bold">
                    4 VERIFIED
                  </span>
                </div>
              </div>

              {/* Task Rows Mimicking Ruled Notebook Page */}
              <div className="space-y-3 relative">
                {/* Task 1 */}
                <div className="p-3.5 bg-[#fef9ef] border border-[#ddd5c4] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:bg-[#f8f3e9] transition">
                  <div className="flex items-start gap-3 sm:pl-12">
                    <span className="mt-1 w-4 h-4 rounded-sm border border-[#8c7169] bg-white flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-xs bg-[#d9582b]"></span>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs text-[#1d1c16]">
                          Kubernetes Container Orchestration Lab
                        </span>
                        <span className="stamp-badge stamp-badge-urgent">[DUE TODAY]</span>
                      </div>
                      <p className="text-[11px] text-[#58413a] mt-0.5">
                        Submit complete YAML manifests and cluster failover test captures.
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] text-[#8c7169]">
                        <span className="stamp-badge stamp-badge-course">CS601</span>
                        <span>• 14 hours remaining</span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end sm:self-center font-mono text-xs font-bold text-[#d9582b]">
                    18:00 IST
                  </div>
                </div>

                {/* Task 2 */}
                <div className="p-3.5 bg-[#fef9ef] border border-[#ddd5c4] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:bg-[#f8f3e9] transition">
                  <div className="flex items-start gap-3 sm:pl-12">
                    <span className="mt-1 w-4 h-4 rounded-sm border border-[#8c7169] bg-white flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-xs bg-[#c98a1b]"></span>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs text-[#1d1c16]">
                          CNN Retinal Scan Analysis Report
                        </span>
                        <span className="stamp-badge stamp-badge-draft">[IN DRAFT]</span>
                      </div>
                      <p className="text-[11px] text-[#58413a] mt-0.5">
                        Document confusion matrices, ResNet-50 weights, and training epochs.
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] text-[#8c7169]">
                        <span className="stamp-badge stamp-badge-course">CS602</span>
                        <span>• 2 days left</span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end sm:self-center font-mono text-xs font-bold text-[#7e5300]">
                    OCT 23
                  </div>
                </div>

                {/* Task 3 */}
                <div className="p-3.5 bg-[#fef9ef] border border-[#ddd5c4] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:bg-[#f8f3e9] transition">
                  <div className="flex items-start gap-3 sm:pl-12">
                    <span className="mt-1 w-4 h-4 rounded-sm border border-[#3f7d58] bg-[#3f7d58] text-white flex items-center justify-center shrink-0 text-[10px]">
                      ✓
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs text-[#8c7169] line-through">
                          RSA Key Exchange Algorithm Problem Set
                        </span>
                        <span className="stamp-badge stamp-badge-completed">[SUBMITTED]</span>
                      </div>
                      <p className="text-[11px] text-[#8c7169] mt-0.5 line-through">
                        Mathematical proofs verified with instructor signature.
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] text-[#2b6a47]">
                        <span className="stamp-badge stamp-badge-course">CS605</span>
                        <span>• Grade: 10/10 Verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end sm:self-center font-mono text-xs font-bold text-[#2b6a47]">
                    ARCHIVED
                  </div>
                </div>
              </div>

              {/* Notebook Footer Strip */}
              <div className="mt-4 pt-3 border-t border-[#ddd5c4] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#58413a]">
                <span>LEDGER PAGE 42 // BINDER 1</span>
                <span className="text-[#d9582b] font-bold">● LIVE CRON EVALUATOR RUNNING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Section */}
      <section id="features" className="py-16 px-4 md:px-8 bg-[#f8f3e9] border-t border-[#ddd5c4]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase font-bold text-[#d9582b] tracking-wider">
              [SYSTEM CAPABILITIES]
            </span>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#1d1c16] mt-1">
              Engineering-Grade Academic Deliverable Management
            </h2>
            <p className="text-[#58413a] text-sm mt-2">
              Engineered specifically to solve multi-subject friction, late submission penalties,
              and fragmented notification alerts during university semesters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-5 bg-white border border-[#ddd5c4] rounded shadow-paper flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-[#ffdbd0] text-[#d9582b] flex items-center justify-center font-bold text-lg mb-3">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-base text-[#1d1c16]">
                  Automated Proactive Alerts
                </h3>
                <p className="text-xs text-[#58413a] mt-2 leading-relaxed">
                  Node-cron engine regularly evaluates impending deadlines. Dispatches in-app alerts
                  and browser desktop push notifications at 72h and 24h marks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#ddd5c4] font-mono text-[10px] text-[#8c7169]">
                CRON: */10 * * * *
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-5 bg-white border border-[#ddd5c4] rounded shadow-paper flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-[#adefc2] text-[#2b6a47] flex items-center justify-center font-bold text-lg mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-base text-[#1d1c16]">
                  Dual-Tracking Analytics
                </h3>
                <p className="text-xs text-[#58413a] mt-2 leading-relaxed">
                  Crystal clear separation between completed coursework and pending dockets. Track
                  estimated study hours vs. actual investment and weekly completion velocity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#ddd5c4] font-mono text-[10px] text-[#8c7169]">
                RECHARTS • VELOCITY TRENDS
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-5 bg-white border border-[#ddd5c4] rounded shadow-paper flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-[#ffddb2] text-[#7e5300] flex items-center justify-center font-bold text-lg mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-base text-[#1d1c16]">
                  Multi-Subject Indexing
                </h3>
                <p className="text-xs text-[#58413a] mt-2 leading-relaxed">
                  Color-coded course binders with departmental tracking, course codes (e.g. CS601,
                  CS602), faculty contact, and syllabus record tagging.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#ddd5c4] font-mono text-[10px] text-[#8c7169]">
                SUBJECT REGISTRY // B.TECH
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-5 bg-white border border-[#ddd5c4] rounded shadow-paper flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-[#ede8de] text-[#1d1c16] flex items-center justify-center font-bold text-lg mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-base text-[#1d1c16]">
                  Interactive Academic Calendar
                </h3>
                <p className="text-xs text-[#58413a] mt-2 leading-relaxed">
                  Comprehensive monthly submission grid with color-coded deadline badges, deliverable
                  counters, and 1-click modal inspection.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#ddd5c4] font-mono text-[10px] text-[#8c7169]">
                TIMETABLE MATRIX
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Minor Project Presentation Callout */}
      <section className="py-12 px-4 md:px-8 bg-[#f2ede3] border-t border-[#ddd5c4]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-white border border-[#ddd5c4] rounded-lg shadow-paper">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded bg-[#ffdbd0] text-[#d9582b] flex items-center justify-center shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#d9582b] bg-[#fdf4f0] px-2 py-0.5 border border-[#d9582b]/30">
                COLLEGE MINOR PROJECT // VIVA EVALUATION
              </span>
              <h3 className="font-headline font-bold text-xl text-[#1d1c16] mt-1">
                Integrated B.Tech Project Slide Deck &amp; Defense
              </h3>
              <p className="text-xs text-[#58413a] mt-1 max-w-xl">
                Ready for evaluation. Includes Problem Statement, Existing System Limitations,
                Proposed Architecture, Tech Stack, USPs, and Expected Viva Q&amp;A.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="w-full md:w-auto px-5 py-3 bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold rounded shadow-paper transition flex items-center justify-center gap-2"
            >
              <Presentation className="w-4 h-4" />
              <span>Launch Slide Viewer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Archival Footer */}
      <footer className="mt-auto bg-[#ede8de] border-t border-[#ddd5c4] py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#58413a]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1d1c16]">DUEWISE PLATFORM</span>
            <span>• Smart Academic Desk Edition</span>
          </div>
          <div>B.Tech Engineering Minor Project Presentation • 2024–2025</div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-[#d9582b] underline">
              Student Login
            </Link>
            <Link to="/register" className="hover:text-[#d9582b] underline">
              Register
            </Link>
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="hover:text-[#d9582b] underline"
            >
              Viva Slides
            </button>
          </div>
        </div>
      </footer>

      {/* Project Presentation Modal */}
      <ProjectShowcaseModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
};
