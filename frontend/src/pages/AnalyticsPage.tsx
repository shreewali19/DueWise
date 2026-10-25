import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { DashboardAnalytics, Subject } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDashboardAnalytics();
      if (res.success) setAnalytics(res.data);
    } catch (e) {
      console.error('Error fetching analytics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 glass-panel rounded-2xl">
        Computing academic analytics and workload statistics...
      </div>
    );
  }

  const { kpis, subjectBreakdown, submissionTypeData, next7DaysTimeline } = analytics;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-gradient-to-r from-blue-950/20 via-slate-900 to-purple-950/20">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold w-fit mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Dual-Tracking Academic Analytics</span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          Performance & Deliverable Velocity
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Visual differentiation between completed milestones and pending coursework deliverables across all subjects.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Completion Rate</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{kpis.completionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{kpis.completed} of {kpis.total} finalized</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pending Tasks</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{kpis.pending + kpis.inProgress}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{kpis.highPriorityPending} high priority</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Actual Study Time</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{kpis.totalActualHours}h</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{kpis.totalEstimatedHours}h estimated</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Overdue Items</span>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">{kpis.overdue}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Need immediate submission</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subject Comparison Bar Chart */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white">Subject-wise Workload & Completion</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="code" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1">
                          <p className="font-bold text-white">{data.name} ({data.code})</p>
                          <p className="text-blue-400">Total: {data.total}</p>
                          <p className="text-emerald-400">Completed: {data.completed}</p>
                          <p className="text-amber-400">Pending: {data.pending}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" name="Total Tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deliverable Types Chart */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white">Deliverable Types Breakdown</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={submissionTypeData}
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                <YAxis type="category" dataKey="label" stroke="#64748b" fontSize={10} width={90} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                          <span className="font-bold text-white">{data.label}</span>: {data.count} items
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Subject Performance Table */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white">Coursework Completion Status Table</h4>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-300 uppercase font-semibold">
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Name</th>
                <th className="p-3">Total Deliverables</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Pending</th>
                <th className="p-3">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {subjectBreakdown.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 font-bold" style={{ color: s.color }}>
                    {s.code}
                  </td>
                  <td className="p-3 font-medium text-white">{s.name}</td>
                  <td className="p-3">{s.total}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{s.completed}</td>
                  <td className="p-3 text-amber-400 font-semibold">{s.pending}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${s.completionRate}%`, backgroundColor: s.color }}
                        />
                      </div>
                      <span className="font-semibold text-white">{s.completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
