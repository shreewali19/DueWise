import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, AlertCircle, Bookmark, Link as LinkIcon, FileText } from 'lucide-react';
import { Subject, Assignment } from '../../types';
import { api } from '../../lib/api';
import { toast } from 'sonner';

const assignmentFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  subjectId: z.string().min(1, 'Please select a subject'),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().default('23:59'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).default('PENDING'),
  submissionType: z.enum([
    'LAB_RECORD',
    'TECHNICAL_REPORT',
    'HOMEWORK',
    'DPP',
    'MINI_PROJECT',
    'ESSAY',
    'OTHER',
  ]).default('HOMEWORK'),
  estimatedHours: z.coerce.number().min(0).default(2.0),
  actualHours: z.coerce.number().min(0).optional(),
  referenceUrl: z.string().optional(),
  attachmentNotes: z.string().optional(),
});

type FormValues = z.infer<typeof assignmentFormSchema>;

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  assignmentToEdit?: Assignment | null;
  onSuccess: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  subjects,
  assignmentToEdit,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      subjectId: subjects[0]?.id || '',
      dueDate: defaultDueDate(),
      dueTime: '23:59',
      priority: 'MEDIUM',
      status: 'PENDING',
      submissionType: 'HOMEWORK',
      estimatedHours: 2.0,
      actualHours: 0,
      referenceUrl: '',
      attachmentNotes: '',
    },
  });

  useEffect(() => {
    if (assignmentToEdit) {
      const d = new Date(assignmentToEdit.dueDate);
      const dateStr = d.toISOString().split('T')[0];
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

      reset({
        title: assignmentToEdit.title,
        description: assignmentToEdit.description || '',
        subjectId: assignmentToEdit.subjectId,
        dueDate: dateStr,
        dueTime: timeStr,
        priority: assignmentToEdit.priority,
        status: assignmentToEdit.status,
        submissionType: assignmentToEdit.submissionType,
        estimatedHours: assignmentToEdit.estimatedHours || 2.0,
        actualHours: assignmentToEdit.actualHours || 0,
        referenceUrl: assignmentToEdit.referenceUrl || '',
        attachmentNotes: assignmentToEdit.attachmentNotes || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        subjectId: subjects[0]?.id || '',
        dueDate: defaultDueDate(),
        dueTime: '23:59',
        priority: 'MEDIUM',
        status: 'PENDING',
        submissionType: 'HOMEWORK',
        estimatedHours: 2.0,
        actualHours: 0,
        referenceUrl: '',
        attachmentNotes: '',
      });
    }
  }, [assignmentToEdit, isOpen, subjects, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Combine date and time
      const combinedDateTime = new Date(`${data.dueDate}T${data.dueTime}:00`);

      const payload = {
        title: data.title,
        description: data.description,
        subjectId: data.subjectId,
        dueDate: combinedDateTime.toISOString(),
        priority: data.priority,
        status: data.status,
        submissionType: data.submissionType,
        estimatedHours: data.estimatedHours,
        actualHours: data.actualHours || undefined,
        referenceUrl: data.referenceUrl,
        attachmentNotes: data.attachmentNotes,
      };

      if (assignmentToEdit) {
        await api.updateAssignment(assignmentToEdit.id, payload);
        toast.success('Assignment updated successfully!');
      } else {
        await api.createAssignment(payload);
        toast.success('New academic assignment scheduled!');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#ddd5c4] rounded shadow-paper-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ddd5c4] bg-[#f8f3e9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#d9582b] text-white flex items-center justify-center font-bold">
              📝
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-[#1d1c16]">
                {assignmentToEdit ? 'Edit Academic Deliverable' : 'Schedule New Deliverable'}
              </h3>
              <p className="font-mono text-xs text-[#8c7169]">
                Configure deadline timestamps, priority, and automated reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#58413a] hover:text-[#1d1c16] hover:bg-[#ede8de] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assignment / Deliverable Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Kubernetes Cluster Orchestration Lab Record"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title.message}
              </p>
            )}
          </div>

          {/* Subject & Submission Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Academic Subject *
              </label>
              <select
                {...register('subjectId')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.subjectId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Deliverable Type
              </label>
              <select
                {...register('submissionType')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              >
                <option value="LAB_RECORD">🧪 Lab Record / Practical</option>
                <option value="TECHNICAL_REPORT">📄 Technical Report / Review</option>
                <option value="HOMEWORK">📚 Homework / Problem Set</option>
                <option value="DPP">✏️ DPP (Daily Practice Problem)</option>
                <option value="MINI_PROJECT">💻 Mini-Project / Code Repo</option>
                <option value="ESSAY">📝 Essay / Term Paper</option>
                <option value="OTHER">📌 Other Academic Task</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Submission Due Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register('dueDate')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              {errors.dueDate && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Due Time (Deadline)
              </label>
              <input
                type="time"
                {...register('dueTime')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Urgency Priority
              </label>
              <select
                {...register('priority')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              >
                <option value="HIGH">🔴 High Priority (Impending / Heavy Marks)</option>
                <option value="MEDIUM">🟡 Medium Priority (Standard Homework)</option>
                <option value="LOW">🟢 Low Priority (Optional / Self Study)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tracking Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              >
                <option value="PENDING">⏳ Pending (Not Started)</option>
                <option value="IN_PROGRESS">⚡ In Progress</option>
                <option value="COMPLETED">✅ Completed & Finalized</option>
                <option value="OVERDUE">🚨 Overdue</option>
              </select>
            </div>
          </div>

          {/* Estimated vs Actual Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Estimated Work Effort (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                {...register('estimatedHours')}
                placeholder="2.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Actual Study Time Spent (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                {...register('actualHours')}
                placeholder="0.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Reference URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" /> Reference URL / Resource Link
            </label>
            <input
              type="url"
              {...register('referenceUrl')}
              placeholder="https://classroom.google.com/... or github repo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Description & Submission Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Task Guidelines & Submission Criteria
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Key questions to answer, required diagrams, or professor instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#ddd5c4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-white hover:bg-[#ede8de] border border-[#ddd5c4] text-[#58413a] text-xs font-medium shadow-paper transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold shadow-paper transition active:translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving to Ledger...' : assignmentToEdit ? 'Save Changes' : '+ Record in Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
