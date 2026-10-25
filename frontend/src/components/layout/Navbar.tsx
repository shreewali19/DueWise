import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Plus,
  Presentation,
  CheckCircle2,
  Trash2,
  RefreshCw,
  LogOut,
  User as UserIcon,
  Sparkles,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { InAppNotification } from '../../types';
import { notifications as browserNotifications } from '../../lib/notifications';
import { toast } from 'sonner';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  onOpenPresentation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickAdd, onOpenPresentation }) => {
  const { user, logout } = useAuth();
  const [notificationsList, setNotificationsList] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotificationsList(res.notifications);
        setUnreadCount(res.unreadCount);
      }
    } catch (e) {
      // background poll
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpenNotifications(false);
        setIsOpenUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (e) {
      toast.error('Failed to mark notifications read.');
    }
  };

  const handleClearRead = async () => {
    try {
      await api.clearReadNotifications();
      setNotificationsList((prev) => prev.filter((n) => !n.isRead));
      toast.success('Read notifications cleared.');
    } catch (e) {
      toast.error('Failed to clear notifications.');
    }
  };

  const handleTriggerCheck = async () => {
    setIsChecking(true);
    try {
      await api.triggerDeadlineCheck();
      await fetchNotifications();
      toast.success('Evaluated upcoming deadlines and synced reminders!');
    } catch (e) {
      toast.error('Failed to trigger deadline check.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRequestNotificationPermission = async () => {
    const granted = await browserNotifications.requestPermission();
    if (granted) {
      browserNotifications.show(
        '🔔 Notifications Activated',
        'You will now receive proactive deadline alerts directly in your browser!',
        'success'
      );
      toast.success('Browser notification permissions granted!');
    } else {
      toast.warning('Browser notifications were not enabled. Please check site permissions.');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8f3e9]/95 backdrop-blur-md border-b border-[#ddd5c4] shadow-sm px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="/logo.svg"
          alt="DueWise Logo"
          className="w-9 h-9 rounded-lg shadow-sm object-contain hover:scale-105 transition-transform"
        />
        <div>
          <h1 className="text-sm sm:text-base font-headline font-bold text-[#1d1c16] tracking-tight flex items-center gap-2">
            <span>DueWise</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ede8de] text-[#58413a] border border-[#ddd5c4] uppercase tracking-wider hidden sm:inline">
              Smart Academic Desk
            </span>
          </h1>
          <p className="text-[11px] font-mono text-[#8c7169] hidden sm:block">
            {user?.college || 'College Minor Project'} • {user?.department || 'B.Tech CSE'}
          </p>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
        {/* Project Presentation Button */}
        <button
          onClick={onOpenPresentation}
          className="px-3 py-1.5 rounded bg-white hover:bg-[#f2ede3] border border-[#ddd5c4] text-[#7e5300] text-xs font-semibold flex items-center gap-1.5 shadow-paper transition"
          title="Open Project Presentation Slides"
        >
          <Presentation className="w-3.5 h-3.5 text-[#d9582b]" />
          <span className="hidden md:inline">Viva Deck</span>
        </button>

        {/* Quick Add Assignment */}
        <button
          onClick={onOpenQuickAdd}
          className="px-3 py-1.5 rounded bg-[#d9582b] hover:bg-[#c84c20] text-white text-xs font-semibold flex items-center gap-1.5 shadow-paper transition active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">+ Add Task</span>
        </button>

        {/* Browser Alert Trigger */}
        <button
          onClick={handleRequestNotificationPermission}
          className="p-1.5 rounded bg-white hover:bg-[#f2ede3] border border-[#ddd5c4] text-[#58413a] shadow-paper transition"
          title="Enable Desktop Push Notifications"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsOpenNotifications(!isOpenNotifications);
              setIsOpenUserMenu(false);
            }}
            className="relative p-1.5 rounded bg-white hover:bg-[#f2ede3] border border-[#ddd5c4] text-[#58413a] shadow-paper transition"
            title="In-App Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d9582b] text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {isOpenNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded bg-white border border-[#ddd5c4] shadow-paper-elevated overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-[#ddd5c4] flex items-center justify-between bg-[#f8f3e9]">
                <div className="flex items-center gap-2">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1d1c16]">
                    Docket Alerts
                  </h4>
                  {unreadCount > 0 && (
                    <span className="stamp-badge stamp-badge-urgent">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleTriggerCheck}
                    disabled={isChecking}
                    className="p-1 text-[#58413a] hover:text-[#1d1c16] hover:bg-white rounded transition"
                    title="Scan deadlines now"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1 text-[#58413a] hover:text-[#2b6a47] hover:bg-white rounded transition"
                    title="Mark all read"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleClearRead}
                    className="p-1 text-[#58413a] hover:text-[#ba1a1a] hover:bg-white rounded transition"
                    title="Clear read"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#ddd5c4]">
                {notificationsList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#8c7169] font-mono">
                    No active notifications. You are all caught up!
                  </div>
                ) : (
                  notificationsList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 transition flex gap-3 ${
                        item.isRead ? 'bg-white text-[#8c7169]' : 'bg-[#fcf8ee] text-[#1d1c16]'
                      }`}
                    >
                      <div className="text-base shrink-0 mt-0.5">
                        {item.type === 'URGENT' && '⚠️'}
                        {item.type === 'UPCOMING' && '⏰'}
                        {item.type === 'OVERDUE' && '🚨'}
                        {item.type === 'COMPLETED' && '🎉'}
                        {item.type === 'SYSTEM' && '🚀'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-semibold truncate text-[#1d1c16]">
                            {item.title}
                          </h5>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#d9582b] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#58413a] mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-[10px] font-mono text-[#8c7169] block mt-1">
                          {new Date(item.sentAt || item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsOpenUserMenu(!isOpenUserMenu);
              setIsOpenNotifications(false);
            }}
            className="flex items-center gap-1.5 p-1 rounded bg-white hover:bg-[#f2ede3] border border-[#ddd5c4] shadow-paper transition"
          >
            <div className="w-7 h-7 rounded bg-[#d9582b] text-white font-bold text-xs flex items-center justify-center">
              {user?.name?.[0] || 'S'}
            </div>
          </button>

          {isOpenUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded bg-white border border-[#ddd5c4] shadow-paper-elevated py-2 z-50 animate-fade-in text-xs">
              <div className="px-4 py-2 border-b border-[#ddd5c4] bg-[#f8f3e9]">
                <p className="font-bold text-[#1d1c16] truncate">{user?.name}</p>
                <p className="font-mono text-[10px] text-[#8c7169] truncate">{user?.email}</p>
                <p className="font-mono text-[10px] text-[#d9582b] mt-0.5">{user?.semester || 'B.Tech Student'}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/landing"
                  onClick={() => setIsOpenUserMenu(false)}
                  className="w-full px-4 py-2 text-left text-[#58413a] hover:bg-[#f2ede3] flex items-center gap-2 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#58413a]" />
                  <span>Public Landing Page</span>
                </Link>
                <button
                  onClick={() => {
                    onOpenPresentation();
                    setIsOpenUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-[#58413a] hover:bg-[#f2ede3] flex items-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7e5300]" />
                  <span>Presentation Slides</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsOpenUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2 transition font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
