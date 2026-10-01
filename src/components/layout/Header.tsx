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
      <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-slate-200/70 shadow-sm no-print transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-3 text-slate-900 group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200/60 group-hover:shadow-glow transition-all duration-300">
                  <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                      AI Classroom Creator
                    </span>
                    <span className="text-[10px] tracking-wide font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-full shadow-subtle">
                      AI Platform
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                    Lesson to Learning Package
                  </p>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center space-x-1 pl-5 border-l border-slate-200/80">
                {navLinks.map((link) => {
                  const isActive =
                    link.to === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.to);

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-700 font-semibold shadow-subtle border border-indigo-100/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-glow transition-all duration-200 border border-indigo-500/40 active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Lesson</span>
              </Link>

              {/* Settings Toggle */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                title="Application Settings & Demo Data"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-xl transition-colors border border-slate-200/50 hover:border-slate-300"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Teacher Profile */}
              <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/90 shadow-sm">
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
        <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 py-2 bg-white/90 backdrop-blur-md px-2">
          {navLinks.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Settings / Development Modal with Glassmorphism */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-modal border border-white/80 w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 shadow-subtle">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Settings & Data Management
                </h3>
                <p className="text-xs text-slate-500">
                  Supabase database and live Gemini integration active
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 text-sm">
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-900 backdrop-blur-xs">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Backend & AI Live:</span>
                </p>
                <p className="leading-relaxed">
                  Supabase Edge Functions connected. Lesson generation, isolated section regeneration, and learning objective alignment use Gemini Flash.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Educator Profile
                </label>
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xs flex items-center justify-between shadow-subtle">
                  <div>
                    <p className="font-medium text-slate-800 text-xs">
                      Ananya Sharma (ananya.s@education.org)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Delhi Public Academy · Science Dept
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-700">
                  Quick Data Reset & Empty State Preview:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleResetData}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-xl border border-indigo-200/80 shadow-subtle transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Samples</span>
                  </button>
                  <button
                    onClick={handleClearData}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50/80 hover:bg-rose-100 rounded-xl border border-rose-200/80 shadow-subtle transition-all"
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
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-modal text-xs font-medium animate-in slide-in-from-bottom-2 border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
