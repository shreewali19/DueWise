import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Assignment, Subject } from '../types';
import { AcademicCalendarView } from '../components/calendar/AcademicCalendarView';
import { AssignmentModal } from '../components/assignments/AssignmentModal';

export const CalendarPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [assignmentsRes, subjectsRes] = await Promise.all([
        api.getAssignments(),
        api.getSubjects(),
      ]);
      if (assignmentsRes.success) setAssignments(assignmentsRes.assignments);
      if (subjectsRes.success) setSubjects(subjectsRes.subjects);
    } catch (e) {
      console.error('Error fetching calendar data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <AcademicCalendarView
        assignments={assignments}
        subjects={subjects}
        onSelectAssignment={(a: Assignment) => {
          setSelectedAssignment(a);
          setIsModalOpen(true);
        }}
      />

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjects={subjects}
        assignmentToEdit={selectedAssignment}
        onSuccess={fetchData}
      />
    </div>
  );
};
