import React from 'react';
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
} from 'recharts';
import { DashboardAnalytics } from '../../types';

interface WorkloadChartsProps {
  analytics: DashboardAnalytics;
}

export const WorkloadCharts: React.FC<WorkloadChartsProps> = ({ analytics }) => {
  const { next7DaysTimeline, subjectBreakdown } = analytics;

  // Custom Tooltip for Timeline
  const CustomTimelineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 rounded bg-white border border-[#ddd5c4] shadow-paper text-xs space-y-1">
          <p className="font-bold text-[#1d1c16] font-mono">{label}</p>
          <p className="text-[#d9582b] font-mono">Due Deliverables: {payload[0]?.value || 0}</p>
          <p className="text-[#2b6a47] font-mono">Completed: {payload[1]?.value || 0}</p>
        </div>
      );
    }
    return null;
  };

  const chartColors = ['#d9582b', '#3f7d58', '#c98a1b', '#5b7186', '#7e5300', '#2b6a47'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 7-Day Deadlines Timeline Chart */}
      <div className="lg:col-span-2 p-5 rounded bg-white border border-[#ddd5c4] shadow-paper space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-headline font-bold text-sm text-[#1d1c16] flex items-center gap-2">
              <span>Weekly Submission Velocity &amp; Queue</span>
            </h4>
            <p className="text-xs text-[#58413a]">
              Volume of impending deadlines versus deliverables submitted
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#d9582b]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#d9582b]" /> Due
            </span>
            <span className="flex items-center gap-1.5 text-[#2b6a47]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3f7d58]" /> Cleared
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={next7DaysTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#8c7169" fontSize={11} tickLine={false} />
              <YAxis stroke="#8c7169" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTimelineTooltip />} />
              <Bar dataKey="due" name="Due" fill="#d9582b" radius={[2, 2, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#3f7d58" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Workload Donut */}
      <div className="p-5 rounded bg-white border border-[#ddd5c4] shadow-paper space-y-4">
        <div>
          <h4 className="font-headline font-bold text-sm text-[#1d1c16] flex items-center gap-2">
            <span>Coursework Matrix</span>
          </h4>
          <p className="text-xs text-[#58413a]">Deliverables by academic code</p>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subjectBreakdown}
                dataKey="total"
                nameKey="code"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={4}
              >
                {subjectBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2 rounded bg-white border border-[#ddd5c4] shadow-paper text-xs">
                        <span className="font-bold text-[#1d1c16]">{data.code}</span>: {data.total} tasks ({data.completionRate}% complete)
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
          {subjectBreakdown.map((s, idx) => (
            <div key={s.id} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#1d1c16] truncate">
                <span
                  className="w-2 h-2 rounded-xs shrink-0"
                  style={{ backgroundColor: s.color || chartColors[idx % chartColors.length] }}
                />
                <span className="font-mono font-bold">{s.code}</span>
                <span className="text-[#8c7169] truncate text-[11px]">{s.name}</span>
              </span>
              <span className="font-mono text-[#58413a] font-bold shrink-0">{s.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
