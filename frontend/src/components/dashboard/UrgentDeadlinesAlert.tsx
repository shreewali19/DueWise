import React from 'react';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { Assignment } from '../../types';
import confetti from 'canvas-confetti';
import { api } from '../../lib/api';
import { toast } from 'sonner';

interface UrgentDeadlinesAlertProps {
  urgentTasks: (Assignment & { hoursRemaining: number })[];
  onRefresh: () => void;
  onSelectAssignment: (assignment: Assignment) => void;
}

export const UrgentDeadlinesAlert: React.FC<UrgentDeadlinesAlertProps> = ({
  urgentTasks,
  onRefresh,
  onSelectAssignment,
}) => {
  if (!urgentTasks || urgentTasks.length === 0) {
    return (
      <div className="p-3.5 rounded bg-[#f0f6f2] border border-[#3f7d58]/40 shadow-paper flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#adefc2] text-[#2b6a47] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2b6a47]">No Critical Impending Deadlines</h4>
            <p className="text-[11px] text-[#58413a]">
              All coursework deliverables for the next 24 hours are cleared or scheduled.
            </p>
          </div>
        </div>
        <span className="stamp-badge stamp-badge-completed">
          CLEAR TO FOCUS
        </span>
      </div>
    );
  }

  const handleQuickComplete = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    try {
      await api.updateAssignmentStatus(id, 'COMPLETED');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      toast.success(`Completed "${title}"!`);
      onRefresh();
    } catch (err: any) {
      toast.error('Failed to complete assignment.');
    }
  };

  return (
    <div className="p-4 rounded bg-[#fdf4f0] border-2 border-[#d9582b] shadow-paper space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#d9582b] text-white flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#a73406] uppercase tracking-wider flex items-center gap-2">
              Critical Window Alert: Impending Deadlines (&lt; 24h)
              <span className="stamp-badge stamp-badge-urgent">
                {urgentTasks.length} ACTION REQUIRED
              </span>
            </h4>
            <p className="text-[11px] text-[#58413a]">
              Immediate submission recommended to ensure full continuous evaluation credit.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {urgentTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onSelectAssignment(task)}
            className="p-3 rounded bg-white border border-[#ddd5c4] hover:border-[#d9582b] cursor-pointer transition flex items-center justify-between gap-3 group shadow-sm"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="stamp-badge stamp-badge-course">
                  {task.subject?.code}
                </span>
                <span className="font-mono text-[10px] text-[#d9582b] font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due in ~{task.hoursRemaining}h
                </span>
              </div>
              <h5 className="text-xs font-semibold text-[#1d1c16] truncate group-hover:text-[#d9582b] transition">
                {task.title}
              </h5>
            </div>

            <button
              onClick={(e) => handleQuickComplete(e, task.id, task.title)}
              className="px-2.5 py-1 rounded bg-[#f0f6f2] hover:bg-[#3f7d58] border border-[#3f7d58] text-[#2b6a47] hover:text-white text-[10px] font-mono font-bold flex items-center gap-1 transition shrink-0"
              title="Mark as completed"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>MARK DONE</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
