import React from 'react';
import { Subject } from '../../types';
import { BookOpen, User as UserIcon, Plus, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface SubjectGridProps {
  subjects: Subject[];
  onAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onSelectSubjectFilter: (subjectId: string) => void;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onSelectSubjectFilter,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> Academic Subjects & Coursework
          </h3>
          <p className="text-xs text-slate-400">
            Categorize assignments across semesters, track professor instructions, and isolate coursework
          </p>
        </div>
        <button
          onClick={onAddSubject}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Academic Subject
        </button>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const stats = subject.stats || {
            total: 0,
            completed: 0,
            pending: 0,
            inProgress: 0,
            overdue: 0,
            completionRate: 0,
          };

          return (
            <div
              key={subject.id}
              className="p-5 rounded-2xl glass-panel border border-slate-800/90 glass-panel-hover flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: subject.color || '#3B82F6' }}
              />

              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${subject.color || '#3B82F6'}20`,
                      color: subject.color || '#3B82F6',
                      border: `1px solid ${subject.color || '#3B82F6'}40`,
                    }}
                  >
                    {subject.code}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditSubject(subject)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit Subject"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSubject(subject.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition line-clamp-1">
                  {subject.name}
                </h4>

                {subject.instructor && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <UserIcon className="w-3 h-3 text-slate-500" />
                    <span>{subject.instructor}</span>
                  </p>
                )}

                {subject.description && (
                  <p className="text-xs text-slate-400/80 mt-2 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                )}
              </div>

              {/* Progress & Stats */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Completion Velocity</span>
                  <span className="font-bold text-white">{stats.completionRate}%</span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.completionRate}%`,
                      backgroundColor: subject.color || '#3B82F6',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {stats.pending + stats.inProgress} active
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {stats.completed} done
                  </span>
                  <button
                    onClick={() => onSelectSubjectFilter(subject.id)}
                    className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 ml-auto"
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
