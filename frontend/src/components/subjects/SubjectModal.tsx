import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, BookOpen, AlertCircle, Palette } from 'lucide-react';
import { Subject } from '../../types';
import { api } from '../../lib/api';
import { toast } from 'sonner';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters'),
  code: z.string().min(2, 'Course code is required (e.g. CS601)'),
  instructor: z.string().optional(),
  color: z.string().default('#3B82F6'),
  department: z.string().optional(),
  semester: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof subjectSchema>;

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
  onSuccess: () => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#F43F5E', // Rose
  '#14B8A6', // Teal
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  subjectToEdit,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      instructor: '',
      color: '#3B82F6',
      department: 'Computer Science',
      semester: '6th Sem',
      description: '',
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (subjectToEdit) {
      reset({
        name: subjectToEdit.name,
        code: subjectToEdit.code,
        instructor: subjectToEdit.instructor || '',
        color: subjectToEdit.color || '#3B82F6',
        department: subjectToEdit.department || '',
        semester: subjectToEdit.semester || '',
        description: subjectToEdit.description || '',
      });
    } else {
      reset({
        name: '',
        code: '',
        instructor: '',
        color: '#3B82F6',
        department: 'Computer Science',
        semester: '6th Sem',
        description: '',
      });
    }
  }, [subjectToEdit, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (subjectToEdit) {
        await api.updateSubject(subjectToEdit.id, data);
        toast.success('Subject details updated successfully!');
      } else {
        await api.createSubject(data);
        toast.success('Academic subject created successfully!');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save subject.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm"
              style={{ backgroundColor: selectedColor }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {subjectToEdit ? 'Edit Subject' : 'Add Academic Subject'}
              </h3>
              <p className="text-xs text-slate-400">
                Categorize coursework and organize assignments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subject Name *
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Distributed Systems & Cloud"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              />
              {errors.name && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Course Code *
              </label>
              <input
                type="text"
                {...register('code')}
                placeholder="e.g. CS601"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 uppercase transition"
              />
              {errors.code && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Faculty / Professor
              </label>
              <input
                type="text"
                {...register('instructor')}
                placeholder="e.g. Dr. R. Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Semester / Term
              </label>
              <input
                type="text"
                {...register('semester')}
                placeholder="e.g. 6th Semester"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Color Tag Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-400" /> Subject Accent Color Tag
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setValue('color', c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'hover:scale-110 opacity-80'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Course Description / Syllabus Scope
            </label>
            <textarea
              rows={2}
              {...register('description')}
              placeholder="Summary of syllabus modules, lab requirements, or office hours..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : subjectToEdit ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
