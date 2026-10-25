import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertOctagon,
  TrendingUp,
  FileCheck,
  ListTodo,
} from 'lucide-react';
import { DashboardAnalytics } from '../../types';

interface DualTrackingSummaryProps {
  kpis: DashboardAnalytics['kpis'];
}

export const DualTrackingSummary: React.FC<DualTrackingSummaryProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Assignments */}
      <div className="p-3.5 rounded bg-white border border-[#ddd5c4] shadow-paper">
        <div className="flex items-center justify-between text-[#58413a] mb-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Total Tasks</span>
          <div className="w-6 h-6 rounded bg-[#ede8de] text-[#1d1c16] flex items-center justify-center">
            <ListTodo className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="font-headline font-bold text-2xl text-[#1d1c16] leading-none">{kpis.total}</div>
        <div className="text-[11px] text-[#8c7169] mt-1 font-mono">
          Semester deliverables
        </div>
      </div>

      {/* Completed (Dual-Tracking highlight) */}
      <div className="p-3.5 rounded bg-[#f0f6f2] border border-[#3f7d58]/40 shadow-paper">
        <div className="flex items-center justify-between text-[#2b6a47] mb-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Completed</span>
          <div className="w-6 h-6 rounded bg-[#adefc2] text-[#2b6a47] flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="font-headline font-bold text-2xl text-[#2b6a47] leading-none flex items-baseline gap-1.5">
          {kpis.completed}
          <span className="text-xs font-mono font-bold text-[#2b6a47]">({kpis.completionRate}%)</span>
        </div>
        <div className="w-full bg-[#ddd5c4] h-1.5 rounded-xs mt-2 overflow-hidden">
          <div
            className="bg-[#3f7d58] h-full transition-all duration-500"
            style={{ width: `${kpis.completionRate}%` }}
          />
        </div>
      </div>

      {/* In Progress */}
      <div className="p-3.5 rounded bg-white border border-[#ddd5c4] shadow-paper">
        <div className="flex items-center justify-between text-[#7e5300] mb-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">In Draft</span>
          <div className="w-6 h-6 rounded bg-[#ffddb2] text-[#7e5300] flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="font-headline font-bold text-2xl text-[#7e5300] leading-none">{kpis.inProgress}</div>
        <div className="text-[11px] text-[#8c7169] mt-1 font-mono">Currently drafting</div>
      </div>

      {/* Pending */}
      <div className="p-3.5 rounded bg-white border border-[#ddd5c4] shadow-paper">
        <div className="flex items-center justify-between text-[#58413a] mb-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Pending</span>
          <div className="w-6 h-6 rounded bg-[#ede8de] text-[#58413a] flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="font-headline font-bold text-2xl text-[#1d1c16] leading-none">{kpis.pending}</div>
        <div className="text-[11px] text-[#8c7169] mt-1 font-mono">Awaiting queue</div>
      </div>

      {/* Overdue */}
      <div className="p-3.5 rounded bg-[#fdf4f0] border border-[#d9582b]/40 shadow-paper">
        <div className="flex items-center justify-between text-[#ba1a1a] mb-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Overdue</span>
          <div className="w-6 h-6 rounded bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="font-headline font-bold text-2xl text-[#ba1a1a] leading-none">{kpis.overdue}</div>
        <div className="text-[11px] text-[#ba1a1a]/80 mt-1 font-mono">Immediate action</div>
      </div>

      {/* Study Hours */}
      <div className="p-3.5 rounded bg-white border border-[#ddd5c4] shadow-paper">
        <div className="flex items-center justify-between text-[#58413a] mb-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Study Log</span>
          <div className="w-6 h-6 rounded bg-[#ede8de] text-[#1d1c16] flex items-center justify-center">
            <FileCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="font-headline font-bold text-2xl text-[#1d1c16] leading-none flex items-baseline gap-1">
          {kpis.totalActualHours}h
          <span className="text-xs font-mono text-[#8c7169]">/ {kpis.totalEstimatedHours}h</span>
        </div>
        <div className="text-[11px] text-[#8c7169] mt-1 font-mono">Actual vs est.</div>
      </div>
    </div>
  );
};
