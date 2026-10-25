import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ProjectShowcaseModal } from '../presentation/ProjectShowcaseModal';
import { AssignmentModal } from '../assignments/AssignmentModal';
import { api } from '../../lib/api';
import { Subject } from '../../types';

export const AppLayout: React.FC = () => {
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const fetchSubjects = async () => {
    try {
      const res = await api.getSubjects();
      if (res.success) {
        setSubjects(res.subjects);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#fef9ef] text-[#1d1c16] font-body flex flex-col selection:bg-[#d9582b] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar onOpenPresentation={() => setIsPresentationOpen(true)} />

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Project Presentation Slides Modal */}
      <ProjectShowcaseModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />

      {/* Quick Add Assignment Modal */}
      <AssignmentModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        subjects={subjects}
        onSuccess={() => {
          // Trigger page reload or query invalidate
          window.dispatchEvent(new Event('refresh-academic-data'));
        }}
      />
    </div>
  );
};
