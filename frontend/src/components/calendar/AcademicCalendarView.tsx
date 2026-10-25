import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Assignment, Subject } from '../../types';

interface AcademicCalendarViewProps {
  assignments: Assignment[];
  subjects: Subject[];
  onSelectAssignment: (assignment: Assignment) => void;
}

export const AcademicCalendarView: React.FC<AcademicCalendarViewProps> = ({
  assignments,
  subjects,
  onSelectAssignment,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month and total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Group assignments by date string "YYYY-MM-DD"
  const assignmentsByDate: Record<string, Assignment[]> = {};
  assignments.forEach((a) => {
    const dateKey = new Date(a.dueDate).toISOString().split('T')[0];
    if (!assignmentsByDate[dateKey]) {
      assignmentsByDate[dateKey] = [];
    }
    assignmentsByDate[dateKey].push(a);
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar cells
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= totalDaysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="space-y-4">
      {/* Calendar Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{monthName}</h3>
            <p className="text-xs text-slate-400">
              Interactive academic timeline and submission schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subject Color Legend */}
      <div className="flex items-center gap-3 flex-wrap px-2 text-xs">
        <span className="text-slate-500 font-semibold uppercase text-[10px]">Courses:</span>
        {subjects.map((s) => (
          <span key={s.id} className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="font-semibold">{s.code}</span>
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/60 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          {daysOfWeek.map((d, i) => (
            <div key={d} className={i === 0 || i === 6 ? 'text-blue-400' : ''}>
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/80 bg-slate-950/30">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="min-h-[105px] bg-slate-950/40 p-2" />;
            }

            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateKey = `${year}-${monthStr}-${dayStr}`;
            const dayAssignments = assignmentsByDate[dateKey] || [];
            const isToday = dateKey === todayStr;

            return (
              <div
                key={dateKey}
                className={`min-h-[105px] p-2 transition flex flex-col justify-between ${
                  isToday ? 'bg-blue-950/20' : 'hover:bg-slate-900/40'
                }`}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40' : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                  {dayAssignments.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500">
                      {dayAssignments.length}
                    </span>
                  )}
                </div>

                {/* Deadlines List in Cell */}
                <div className="space-y-1 overflow-y-auto max-h-[70px] pr-0.5">
                  {dayAssignments.map((task) => {
                    const isDone = task.status === 'COMPLETED';
                    return (
                      <button
                        key={task.id}
                        onClick={() => onSelectAssignment(task)}
                        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 transition ${
                          isDone
                            ? 'opacity-60 line-through bg-slate-800/60 text-slate-400'
                            : 'hover:brightness-125'
                        }`}
                        style={{
                          backgroundColor: `${task.subject?.color || '#3B82F6'}25`,
                          color: task.subject?.color || '#3B82F6',
                          borderLeft: `2.5px solid ${task.subject?.color || '#3B82F6'}`,
                        }}
                        title={`${task.subject?.code}: ${task.title}`}
                      >
                        <span className="font-bold">{task.subject?.code}</span>
                        <span className="truncate">{task.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
