import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Assignment, Subject } from '../../types';
import { api } from '../../lib/api';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface AssignmentListProps {
  assignments: Assignment[];
  subjects: Subject[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  subjects,
  isLoading,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  // Handle fast status toggle
  const handleToggleStatus = async (assignment: Assignment) => {
    const nextStatus = assignment.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.updateAssignmentStatus(assignment.id, nextStatus);
      if (nextStatus === 'COMPLETED') {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
        toast.success(`Completed "${assignment.title}"!`);
      } else {
        toast.info(`Moved "${assignment.title}" back to Pending.`);
      }
      onRefresh();
    } catch (e) {
      toast.error('Failed to update status.');
    }
  };

  // Filter & Search Logic
  const filtered = assignments
    .filter((a) => {
      if (selectedSubject !== 'ALL' && a.subjectId !== selectedSubject) return false;
      if (selectedPriority !== 'ALL' && a.priority !== selectedPriority) return false;
      if (selectedType !== 'ALL' && a.submissionType !== selectedType) return false;
      if (selectedStatus === 'ACTIVE' && a.status === 'COMPLETED') return false;
      if (selectedStatus === 'COMPLETED' && a.status !== 'COMPLETED') return false;
      if (selectedStatus === 'OVERDUE' && a.status !== 'OVERDUE') {
        const isPast = new Date(a.dueDate).getTime() < Date.now();
        if (!isPast || a.status === 'COMPLETED') return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesDesc = a.description?.toLowerCase().includes(q);
        const matchesSub = a.subject?.code.toLowerCase().includes(q) || a.subject?.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSub) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const pOrder: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return pOrder[a.priority] - pOrder[b.priority];
      }
      return a.title.localeCompare(b.title);
    });

  const formatDueDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    const dateFormatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (diffMs < 0) {
      return { text: `${dateFormatted} (Overdue)`, isOverdue: true };
    } else if (diffHours <= 24) {
      return { text: `${dateFormatted} (in ${diffHours}h)`, isUrgent: true };
    } else {
      return { text: dateFormatted };
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded bg-white border border-[#ddd5c4] shadow-paper space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8c7169] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deliverables by title, notes, or course code..."
              className="w-full pl-10 pr-4 py-2 rounded bg-[#fef9ef] border border-[#ddd5c4] text-[#1d1c16] placeholder:text-[#8c7169] text-xs focus:outline-none focus:border-[#d9582b] focus:bg-white transition"
            />
          </div>

          {/* Quick Dual-Tracking Status Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded bg-[#f2ede3] border border-[#ddd5c4] text-xs font-mono self-stretch sm:self-auto">
            {[
              { id: 'ALL', label: 'All Tasks' },
              { id: 'ACTIVE', label: 'Active' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'OVERDUE', label: 'Overdue' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded transition ${
                  selectedStatus === tab.id
                    ? 'bg-white text-[#d9582b] font-bold shadow-sm border border-[#ddd5c4]'
                    : 'text-[#58413a] hover:text-[#1d1c16]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#fef9ef] border border-[#ddd5c4] text-[#1d1c16] focus:outline-none focus:border-[#d9582b]"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#fef9ef] border border-[#ddd5c4] text-[#1d1c16] focus:outline-none focus:border-[#d9582b]"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Deliverable Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#fef9ef] border border-[#ddd5c4] text-[#1d1c16] focus:outline-none focus:border-[#d9582b]"
          >
            <option value="ALL">All Deliverables</option>
            <option value="LAB_RECORD">Lab Records</option>
            <option value="TECHNICAL_REPORT">Technical Reports</option>
            <option value="HOMEWORK">Homework Sets</option>
            <option value="DPP">DPP Problems</option>
            <option value="MINI_PROJECT">Mini-Projects</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded bg-[#fef9ef] border border-[#ddd5c4] text-[#1d1c16] focus:outline-none focus:border-[#d9582b]"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Assignment Items List */}
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#8c7169] bg-white border border-[#ddd5c4] rounded font-mono">
            Loading your academic deliverables...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#ddd5c4] rounded shadow-paper space-y-2">
            <div className="text-2xl">📝</div>
            <h4 className="font-headline font-bold text-sm text-[#1d1c16]">No Deliverables Found</h4>
            <p className="text-xs text-[#58413a] max-w-sm mx-auto">
              No tasks match your active filters. Try adjusting your query or schedule a new assignment.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const dueInfo = formatDueDate(item.dueDate);
            const isCompleted = item.status === 'COMPLETED';

            return (
              <div
                key={item.id}
                className={`p-4 rounded border transition-all shadow-paper ${
                  isCompleted
                    ? 'border-[#3f7d58]/40 bg-[#f0f6f2] opacity-80'
                    : dueInfo.isOverdue
                    ? 'border-[#ba1a1a]/60 bg-[#fdf4f0]'
                    : dueInfo.isUrgent
                    ? 'border-[#c98a1b]/60 bg-[#fcf8ee]'
                    : 'border-[#ddd5c4] bg-white hover:bg-[#f8f3e9]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Status Toggle Checkbox */}
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className="mt-1 transition shrink-0"
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#3f7d58]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#8c7169] hover:text-[#d9582b]" />
                    )}
                  </button>

                  {/* Main Content Area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Subject Badge */}
                      <span className="stamp-badge stamp-badge-course">
                        {item.subject?.code}
                      </span>

                      {/* Deliverable Type */}
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#f2ede3] border border-[#ddd5c4] text-[#58413a] uppercase font-semibold">
                        {item.submissionType.replace('_', ' ')}
                      </span>

                      {/* Priority Tag */}
                      <span
                        className={`stamp-badge ${
                          item.priority === 'HIGH'
                            ? 'stamp-badge-urgent'
                            : item.priority === 'MEDIUM'
                            ? 'stamp-badge-draft'
                            : 'stamp-badge-completed'
                        }`}
                      >
                        [{item.priority}]
                      </span>

                      {/* Urgency Badge */}
                      {dueInfo.isOverdue && !isCompleted && (
                        <span className="stamp-badge stamp-badge-urgent animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> [OVERDUE]
                        </span>
                      )}
                      {dueInfo.isUrgent && !isCompleted && (
                        <span className="stamp-badge stamp-badge-urgent">
                          <Clock className="w-3 h-3" /> [&lt; 24H]
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4
                      className={`text-sm font-bold tracking-tight text-[#1d1c16] ${
                        isCompleted ? 'line-through text-[#8c7169]' : ''
                      }`}
                    >
                      {item.title}
                    </h4>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-[#58413a] mt-1 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Metadata Footer */}
                    <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[11px] font-mono text-[#8c7169]">
                      <span className="flex items-center gap-1 text-[#1d1c16]">
                        <Calendar className="w-3.5 h-3.5 text-[#d9582b]" />
                        <span className={dueInfo.isOverdue ? 'text-[#ba1a1a] font-bold' : ''}>
                          {dueInfo.text}
                        </span>
                      </span>

                      {item.estimatedHours ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#7e5300]" />
                          <span>{item.estimatedHours}h est.</span>
                          {item.actualHours ? (
                            <span className="text-[#2b6a47] font-bold">({item.actualHours}h actual)</span>
                          ) : null}
                        </span>
                      ) : null}

                      {item.referenceUrl && (
                        <a
                          href={item.referenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#d9582b] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Reference Link
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded bg-white hover:bg-[#ede8de] border border-[#ddd5c4] text-[#58413a] hover:text-[#1d1c16] transition"
                      title="Edit Assignment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded bg-white hover:bg-[#ffdad6] border border-[#ddd5c4] text-[#8c7169] hover:text-[#ba1a1a] transition"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
