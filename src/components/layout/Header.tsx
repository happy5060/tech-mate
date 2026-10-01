import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  PlusCircle,
  History,
  Settings,
  X,
  RotateCcw,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { lessonService } from '../../services/api/lessonService';

interface HeaderProps {
  onDataReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDataReset }) => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/create', label: 'Create Lesson', icon: <PlusCircle className="w-4 h-4" /> },
    { to: '/history', label: 'Lesson History', icon: <History className="w-4 h-4" /> },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetData = () => {
    lessonService.resetToSampleData();
    showToast('Mock sample lessons restored');
    if (onDataReset) onDataReset();
    setIsSettingsOpen(false);
  };

  const handleClearData = () => {
    lessonService.clearAllLessons();
    showToast('All lessons cleared (Empty state active)');
    if (onDataReset) onDataReset();
    setIsSettingsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 no-print transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2.5 text-slate-900 group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-slate-900">
                      AI Classroom Creator
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      Beta
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    Lesson to Learning Package
                  </p>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
                {navLinks.map((link) => {
                  const isActive =
                    link.to === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.to);

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Profile & Settings */}
            <div className="flex items-center gap-3">
              {/* Quick Action for Create */}
              <Link
                to="/create"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Lesson</span>
              </Link>

              {/* Settings Toggle */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                title="Application Settings & Demo Data"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Teacher Profile */}
              <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                  AS
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    Ananya Sharma
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Lead Science Educator
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 py-1.5 bg-slate-50 px-2">
          {navLinks.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Settings / Development Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-modal border border-slate-200 w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Settings & Development State
                </h3>
                <p className="text-xs text-slate-500">
                  Manage frontend mock data & educator preferences
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 text-sm">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                <p className="font-semibold mb-1">Frontend Milestone Status:</p>
                <p>
                  Isolated data layer active (localStorage). All API functions (
                  <code>getLessons</code>, <code>createLesson</code>,{' '}
                  <code>regenerateSection</code>) are decoupled and ready for Supabase & Gemini endpoints.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Educator Profile
                </label>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 text-xs">
                      Ananya Sharma (ananya.s@education.org)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Delhi Public Academy · Science Dept
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-700">
                  Testing UI States:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleResetData}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Sample Data</span>
                  </button>
                  <button
                    onClick={handleClearData}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Test Empty State</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
