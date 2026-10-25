import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Subject } from '../types';
import { SubjectGrid } from '../components/subjects/SubjectGrid';
import { SubjectModal } from '../components/subjects/SubjectModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getSubjects();
      if (res.success) {
        setSubjects(res.subjects);
      }
    } catch (e) {
      console.error('Error fetching subjects:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deleting this subject will also delete all associated assignments. Continue?')) return;
    try {
      await api.deleteSubject(id);
      toast.success('Subject removed.');
      fetchSubjects();
    } catch (e) {
      toast.error('Failed to delete subject.');
    }
  };

  return (
    <div className="space-y-6">
      <SubjectGrid
        subjects={subjects}
        onAddSubject={() => {
          setSubjectToEdit(null);
          setIsModalOpen(true);
        }}
        onEditSubject={handleEdit}
        onDeleteSubject={handleDelete}
        onSelectSubjectFilter={(subId: string) => navigate(`/assignments?subjectId=${subId}`)}
      />

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectToEdit={subjectToEdit}
        onSuccess={fetchSubjects}
      />
    </div>
  );
};
