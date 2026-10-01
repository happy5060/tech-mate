import React from 'react';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              AI Classroom Creator
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Agenticthon 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Decoupled Architecture (Gemini & Supabase Ready)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Teacher-First Workflow</span>
            </span>
            <span className="text-slate-400">
              Frontend Milestone v0.1
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
