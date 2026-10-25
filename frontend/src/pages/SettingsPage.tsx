import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { notifications as browserNotifications } from '../lib/notifications';
import {
  Settings,
  Bell,
  Volume2,
  Clock,
  User as UserIcon,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [urgentHours, setUrgentHours] = useState(24);
  const [upcomingHours, setUpcomingHours] = useState(72);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCollege(user.college || '');
      setDepartment(user.department || '');
      setSemester(user.semester || '');
      if (user.settings) {
        setBrowserAlerts(user.settings.browserNotifications);
        setEmailAlerts(user.settings.emailNotifications);
        setUrgentHours(user.settings.urgentThresholdHours || 24);
        setUpcomingHours(user.settings.upcomingThresholdHours || 72);
      }
    }
  }, [user]);

  const handleTestSound = () => {
    browserNotifications.playChime('urgent');
    toast.success('Chime audio synthesized successfully!');
  };

  const handleTestBrowserAlert = async () => {
    const granted = await browserNotifications.requestPermission();
    if (granted) {
      browserNotifications.show(
        '⚠️ Urgent Assignment Notice',
        'Testing system notification for impending deadlines (< 24h).',
        'urgent'
      );
      toast.success('Test desktop notification sent!');
    } else {
      toast.warning('Browser notification permission is currently blocked.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        api.updateProfile({ name, college, department, semester }),
        api.updateSettings({
          browserNotifications: browserAlerts,
          emailNotifications: emailAlerts,
          urgentThresholdHours: Number(urgentHours),
          upcomingThresholdHours: Number(upcomingHours),
        }),
      ]);
      await refreshProfile();
      toast.success('Reminder settings & profile saved!');
    } catch (err: any) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-5 rounded-2xl glass-panel border border-slate-800">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" /> Automated Reminder & Profile Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize deadline notification thresholds, audio chimes, and college student credentials
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Channels Card */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" /> Proactive Notification Channels
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Desktop & Browser Push Notifications</span>
                <span className="text-[11px] text-slate-400">Trigger immediate web alerts when assignment deadlines draw near</span>
              </div>
              <input
                type="checkbox"
                checked={browserAlerts}
                onChange={(e) => setBrowserAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Email Notification Alerts</span>
                <span className="text-[11px] text-slate-400">Daily academic summary digests and critical deadline warnings</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestBrowserAlert}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
            >
              <Bell className="w-3.5 h-3.5 text-blue-400" /> Test Desktop Push Alert
            </button>
            <button
              type="button"
              onClick={handleTestSound}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Test Audio Chime
            </button>
          </div>
        </div>

        {/* Urgency Thresholds */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Dynamic Deadline Urgency Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Critical Urgent Warning (Hours Before Due)
              </label>
              <input
                type="number"
                min="1"
                max="72"
                value={urgentHours}
                onChange={(e) => setUrgentHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Default: 24 hours. Tasks trigger high-priority alerts within this window.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Upcoming Reminder Window (Hours Before Due)
              </label>
              <input
                type="number"
                min="24"
                max="168"
                value={upcomingHours}
                onChange={(e) => setUpcomingHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Default: 72 hours (3 days). Tasks trigger initial preparation reminders.</p>
            </div>
          </div>
        </div>

        {/* Student Profile Info */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-400" /> Student Profile & Academic Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department / Stream</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Semester / Year</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
