import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Assignment, Subject } from '../types';
import { AssignmentList } from '../components/assignments/AssignmentList';
import { AssignmentModal } from '../components/assignments/AssignmentModal';
import { Plus, CheckSquare, Download } from 'lucide-react';
import { toast } from 'sonner';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assignmentsRes, subjectsRes] = await Promise.all([
        api.getAssignments(),
        api.getSubjects(),
      ]);

      if (assignmentsRes.success) setAssignments(assignmentsRes.assignments);
      if (subjectsRes.success) setSubjects(subjectsRes.subjects);
    } catch (e) {
      console.error('Error fetching assignments page data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (assignment: Assignment) => {
    setAssignmentToEdit(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment deliverable?')) return;
    try {
      await api.deleteAssignment(id);
      toast.success('Assignment deleted.');
      fetchData();
    } catch (e) {
      toast.error('Failed to delete assignment.');
    }
  };

  const handleExportCSV = () => {
    if (assignments.length === 0) {
      toast.info('No assignments to export.');
      return;
    }
    const headers = ['Title', 'Subject', 'Due Date', 'Priority', 'Status', 'Type', 'Estimated Hours', 'Actual Hours'];
    const rows = assignments.map((a) => [
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.subject?.code || ''}"`,
      `"${new Date(a.dueDate).toISOString()}"`,
      a.priority,
      a.status,
      a.submissionType,
      a.estimatedHours || 0,
      a.actualHours || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `academic_assignments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Academic submission schedule exported to CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded bg-white border border-[#ddd5c4] shadow-paper">
        <div>
          <h2 className="text-xl font-headline font-bold text-[#1d1c16] tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#d9582b]" /> Academic Coursework &amp; Submissions
          </h2>
          <p className="text-xs text-[#58413a] mt-1 font-mono">
            Track deadlines, manage lab journals, and audit continuous evaluation requirements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded bg-white hover:bg-[#ede8de] border border-[#ddd5c4] text-[#1d1c16] text-xs font-semibold flex items-center gap-1.5 shadow-paper transition"
            title="Export CSV log for college submissions"
          >
            <Download className="w-4 h-4 text-[#7e5300]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => {
              setAssignmentToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold flex items-center gap-1.5 shadow-paper transition active:translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Schedule Task</span>
          </button>
        </div>
      </div>

      {/* Main Assignment List */}
      <AssignmentList
        assignments={assignments}
        subjects={subjects}
        isLoading={isLoading}
        onRefresh={fetchData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjects={subjects}
        assignmentToEdit={assignmentToEdit}
        onSuccess={fetchData}
      />
    </div>
  );
};
