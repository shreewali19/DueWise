import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { DashboardAnalytics, Subject, Assignment } from '../types';
import { DualTrackingSummary } from '../components/dashboard/DualTrackingSummary';
import { UrgentDeadlinesAlert } from '../components/dashboard/UrgentDeadlinesAlert';
import { WorkloadCharts } from '../components/dashboard/WorkloadCharts';
import { AssignmentModal } from '../components/assignments/AssignmentModal';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  RefreshCw,
  Clock,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'TODAY' | 'WEEK' | 'LAB' | 'COMPLETED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, subjectsRes, assignmentsRes] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getSubjects(),
        api.getAssignments({ sortBy: 'dueDate', order: 'asc' }),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.subjects);
      if (assignmentsRes.success) setAssignments(assignmentsRes.assignments);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleDataRefresh = () => {
      fetchData();
    };
    window.addEventListener('refresh-academic-data', handleDataRefresh);
    return () => window.removeEventListener('refresh-academic-data', handleDataRefresh);
  }, []);

  const handleToggleComplete = async (assignment: Assignment) => {
    const nextStatus = assignment.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.updateAssignmentStatus(assignment.id, nextStatus);
      if (nextStatus === 'COMPLETED') {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.65 },
        });
        toast.success(`Completed "${assignment.title}"!`);
      } else {
        toast.info('Assignment reopened.');
      }
      fetchData();
    } catch (e) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteAssignment = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Remove this assignment from the ledger?')) return;
    try {
      await api.deleteAssignment(id);
      toast.success('Assignment deleted from ledger.');
      fetchData();
    } catch (e) {
      toast.error('Failed to delete assignment.');
    }
  };

  // Filter assignments based on activeTab
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const endOfWeek = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === 'COMPLETED') {
      return a.status === 'COMPLETED';
    }
    if (activeTab === 'TODAY') {
      const d = new Date(a.dueDate);
      return d <= endOfToday && a.status !== 'COMPLETED';
    }
    if (activeTab === 'WEEK') {
      const d = new Date(a.dueDate);
      return d <= endOfWeek && a.status !== 'COMPLETED';
    }
    if (activeTab === 'LAB') {
      return (
        a.submissionType === 'LAB_RECORD' ||
        a.title.toLowerCase().includes('lab') ||
        a.title.toLowerCase().includes('practical')
      );
    }
    return true; // ALL
  });

  const dueThisWeekCount = assignments.filter((a) => {
    const d = new Date(a.dueDate);
    return d <= endOfWeek && a.status !== 'COMPLETED';
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Greeting & Status Strip (From Stitch Dashboard) */}
      <div className="w-full bg-[#f8f3e9] p-5 rounded border border-[#ddd5c4] shadow-paper flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Decorative Notebook Accent Line (Terracotta) */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d9582b]"></div>

        <div className="flex flex-col pl-2">
          <div className="flex items-center gap-2 text-[#58413a] font-mono text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3f7d58] animate-pulse"></span>
            <span>SESSION AUTH: ACTIVE // B.TECH {user?.semester || 'SEMESTER VI'}</span>
          </div>
          <h1 className="font-headline font-bold text-2xl text-[#1d1c16] tracking-tight mt-1 flex flex-wrap items-center gap-2">
            <span>Welcome back, {user?.name || 'Student'}</span>
            <span className="font-mono text-xs bg-[#ede8de] px-2 py-0.5 rounded border border-[#ddd5c4] text-[#58413a] uppercase">
              [{user?.department?.split(' ')?.[0] || 'CSE'}-SEC-A]
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#58413a]">
            <span className="flex items-center gap-1 font-medium text-[#1d1c16]">
              <Calendar className="w-3.5 h-3.5 text-[#d9582b]" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}{' '}
              • Continuous Evaluation Active
            </span>
            <span className="text-[#ddd5c4]">•</span>
            <span>{user?.college || 'Apex Institute of Technology'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => {
              setSelectedAssignment(null);
              setIsAssignmentModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d9582b] hover:bg-[#c84c20] text-white font-semibold text-xs rounded shadow-paper transition active:translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Assignment</span>
          </button>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 bg-[#ffffff] border border-[#ddd5c4] text-[#58413a] hover:text-[#1d1c16] hover:bg-[#f2ede3] rounded shadow-paper transition"
            title="Refresh Academic Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Strip: 3 Paper Cards with Ruled Visuals (From Stitch Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Pending Deliverables */}
        <div className="bg-white p-5 rounded border border-[#ddd5c4] shadow-paper flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#d9582b]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#8c7169] tracking-wider font-bold">
                Docket Registry
              </span>
              <h3 className="font-headline font-bold text-base text-[#1d1c16] mt-0.5">
                Pending Assignments
              </h3>
            </div>
            <span className="stamp-badge stamp-badge-urgent">
              {analytics?.kpis.pending || 0} ACTIVE
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-headline font-extrabold text-3xl text-[#d9582b] leading-none">
              {String(analytics?.kpis.pending || 0).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-[#8c7169]">Tasks in progress/queued</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#ddd5c4] flex items-center justify-between text-xs text-[#58413a]">
            <span>{analytics?.kpis.inProgress || 0} currently drafting</span>
            <span className="font-mono text-[10px] font-bold text-[#d9582b]">[ACT REQ]</span>
          </div>
        </div>

        {/* Card 2: Due This Week */}
        <div className="bg-white p-5 rounded border border-[#ddd5c4] shadow-paper flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#c98a1b]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#8c7169] tracking-wider font-bold">
                Critical Window
              </span>
              <h3 className="font-headline font-bold text-base text-[#1d1c16] mt-0.5">
                Due Next 7 Days
              </h3>
            </div>
            <span className="stamp-badge stamp-badge-draft">
              {dueThisWeekCount} DEADLINES
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-headline font-extrabold text-3xl text-[#7e5300] leading-none">
              {String(dueThisWeekCount).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-[#8c7169]">Deadlines approaching</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#ddd5c4] flex items-center justify-between text-xs text-[#58413a]">
            <span>
              {analytics?.urgentTasks?.length
                ? `${analytics.urgentTasks.length} critical < 24h`
                : 'Pacing on schedule'}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#ba1a1a]">
              {analytics?.urgentTasks?.length ? '[URGENT]' : '[ON TRACK]'}
            </span>
          </div>
        </div>

        {/* Card 3: Completed Term */}
        <div className="bg-white p-5 rounded border border-[#ddd5c4] shadow-paper flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#3f7d58]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#8c7169] tracking-wider font-bold">
                Semester Log
              </span>
              <h3 className="font-headline font-bold text-base text-[#1d1c16] mt-0.5">
                Completed Deliverables
              </h3>
            </div>
            <span className="stamp-badge stamp-badge-completed">
              {analytics?.kpis.completionRate || 0}% RECORD
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-headline font-extrabold text-3xl text-[#2b6a47] leading-none">
              {String(analytics?.kpis.completed || 0).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-[#8c7169]">Submitted &amp; verified</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#ddd5c4] flex items-center justify-between text-xs text-[#58413a]">
            <span>100% evaluated on-time</span>
            <span className="font-mono text-[10px] font-bold text-[#2b6a47]">[PERFECT]</span>
          </div>
        </div>
      </div>

      {/* Urgent Proactive Alert Banner */}
      {analytics && (
        <UrgentDeadlinesAlert
          urgentTasks={analytics.urgentTasks}
          onRefresh={fetchData}
          onSelectAssignment={(a) => {
            setSelectedAssignment(a);
            setIsAssignmentModalOpen(true);
          }}
        />
      )}

      {/* KPI Detail Counters */}
      {analytics && <DualTrackingSummary kpis={analytics.kpis} />}

      {/* Main Ruled Notebook Section (Assignment Queue) */}
      <div className="bg-white border border-[#ddd5c4] rounded shadow-paper-elevated p-5 md:p-7 relative overflow-hidden">
        {/* Red Margin Line (4.5rem from left) */}
        <div className="hidden sm:block absolute top-0 bottom-0 left-[4.5rem] w-0.5 bg-[#d9582b]/70 pointer-events-none z-10"></div>

        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#ddd5c4]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg text-[#1d1c16]">
                Academic Ledger Queue
              </span>
              <span className="font-mono text-xs bg-[#ede8de] px-2 py-0.5 rounded border border-[#ddd5c4] text-[#8c7169]">
                {filteredAssignments.length} ENTRIES
              </span>
            </div>
            <p className="text-xs text-[#58413a] mt-0.5">
              Click checkbox to mark deliverable complete and record study logs.
            </p>
          </div>

          {/* Folder Tabs */}
          <div className="flex flex-wrap items-center bg-[#f2ede3] p-1 rounded border border-[#ddd5c4] text-xs font-mono">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'TODAY', label: 'Due Today' },
              { id: 'WEEK', label: 'This Week' },
              { id: 'LAB', label: 'Labs' },
              { id: 'COMPLETED', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded transition ${
                  activeTab === tab.id
                    ? 'bg-white text-[#d9582b] font-bold shadow-sm border border-[#ddd5c4]'
                    : 'text-[#58413a] hover:text-[#1d1c16]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Rows Mimicking Ruled Notebook Page */}
        <div className="space-y-2.5 relative">
          {filteredAssignments.length === 0 ? (
            <div className="py-12 text-center space-y-3 sm:pl-16">
              <div className="w-12 h-12 rounded-full bg-[#f8f3e9] border border-[#ddd5c4] text-[#8c7169] flex items-center justify-center mx-auto text-xl">
                📝
              </div>
              <h4 className="font-headline font-bold text-base text-[#1d1c16]">
                No assignments found in this view
              </h4>
              <p className="text-xs text-[#58413a] max-w-sm mx-auto">
                Your docket is clear for this filter, or no tasks match the selected criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setIsAssignmentModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold rounded shadow-paper transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Deliverable</span>
              </button>
            </div>
          ) : (
            filteredAssignments.map((task) => {
              const isDone = task.status === 'COMPLETED';
              const dueDateObj = new Date(task.dueDate);
              const isPast = dueDateObj < now && !isDone;
              const isDueToday = dueDateObj <= endOfToday && !isDone;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:bg-[#f8f3e9] ${
                    isDone
                      ? 'bg-[#f8f3e9]/60 border-[#ddd5c4]'
                      : isPast
                      ? 'bg-[#fdf4f0] border-[#d9582b]/60'
                      : isDueToday
                      ? 'bg-[#fcf8ee] border-[#c98a1b]/60'
                      : 'bg-[#fef9ef] border-[#ddd5c4]'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:pl-12 min-w-0 flex-1">
                    {/* Checkbox button */}
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-0.5 w-5 h-5 rounded-xs border flex items-center justify-center shrink-0 transition ${
                        isDone
                          ? 'border-[#3f7d58] bg-[#3f7d58] text-white'
                          : 'border-[#8c7169] bg-white hover:border-[#d9582b]'
                      }`}
                      title={isDone ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-semibold text-xs transition ${
                            isDone ? 'text-[#8c7169] line-through' : 'text-[#1d1c16]'
                          }`}
                        >
                          {task.title}
                        </span>

                        {isDone ? (
                          <span className="stamp-badge stamp-badge-completed">[SUBMITTED]</span>
                        ) : isPast ? (
                          <span className="stamp-badge stamp-badge-urgent">[OVERDUE]</span>
                        ) : isDueToday ? (
                          <span className="stamp-badge stamp-badge-urgent">[DUE TODAY]</span>
                        ) : task.priority === 'HIGH' ? (
                          <span className="stamp-badge stamp-badge-urgent">[HIGH PRIORITY]</span>
                        ) : (
                          <span className="stamp-badge stamp-badge-draft">
                            [{task.status.replace('_', ' ')}]
                          </span>
                        )}

                        <span className="stamp-badge stamp-badge-course">
                          {task.subject?.code || 'GEN'}
                        </span>
                      </div>

                      {task.description && (
                        <p
                          className={`text-[11px] mt-0.5 truncate max-w-xl ${
                            isDone ? 'text-[#8c7169] line-through' : 'text-[#58413a]'
                          }`}
                        >
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono text-[10px] text-[#8c7169]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#d9582b]" />
                          Due:{' '}
                          {dueDateObj.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {task.estimatedHours && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#7e5300]" />
                            Est: {task.estimatedHours}h
                          </span>
                        )}
                        <span>• Subject: {task.subject?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        setSelectedAssignment(task);
                        setIsAssignmentModalOpen(true);
                      }}
                      className="p-1.5 rounded bg-white hover:bg-[#ede8de] border border-[#ddd5c4] text-[#58413a] hover:text-[#1d1c16] transition"
                      title="Edit deliverable"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteAssignment(e, task.id)}
                      className="p-1.5 rounded bg-white hover:bg-[#ffdad6] border border-[#ddd5c4] text-[#8c7169] hover:text-[#ba1a1a] transition"
                      title="Delete from ledger"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Notebook Ledger Footnote */}
        <div className="mt-5 pt-3 border-t border-[#ddd5c4] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#58413a]">
          <span>ACADEMIC LEDGER // RECORD VOLUME 2024–25</span>
          <span className="text-[#3f7d58] font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3f7d58]"></span>
            CRON SCHEDULER ACTIVE
          </span>
        </div>
      </div>

      {/* Analytical Workload Charts */}
      {analytics && <WorkloadCharts analytics={analytics} />}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignmentToEdit={selectedAssignment}
        subjects={subjects}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
};
