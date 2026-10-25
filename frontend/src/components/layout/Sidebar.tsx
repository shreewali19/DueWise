import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Presentation,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  onOpenPresentation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenPresentation }) => {
  const navItems = [
    { name: 'Academic Ledger', path: '/', icon: LayoutDashboard },
    { name: 'Coursework Queue', path: '/assignments', icon: CheckSquare },
    { name: 'Academic Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Academic Calendar', path: '/calendar', icon: Calendar },
    { name: 'Dual-Tracking Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reminder Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#f8f3e9] border-r border-[#ddd5c4] flex flex-col shrink-0 min-h-[calc(100vh-65px)] p-4 select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#8c7169]">
          Notebook Index
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-[#d9582b] border border-[#ddd5c4] shadow-paper font-bold'
                  : 'text-[#58413a] hover:text-[#1d1c16] hover:bg-[#ede8de]'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* College Minor Project Defense Card */}
      <div className="mt-auto pt-6">
        <div className="p-4 rounded bg-white border border-[#ddd5c4] shadow-paper space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#ffdbd0] text-[#d9582b] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1d1c16]">Minor Project Defense</div>
              <div className="font-mono text-[10px] text-[#8c7169]">B.Tech Presentation</div>
            </div>
          </div>
          <p className="text-[11px] text-[#58413a] leading-relaxed">
            Review problem statement, architecture workflow, and project USPs.
          </p>
          <button
            onClick={onOpenPresentation}
            className="w-full py-2 px-3 rounded bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-paper active:translate-y-0.5"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Open Slide Deck</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
