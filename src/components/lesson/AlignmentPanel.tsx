import React, { useState } from 'react';
import { SectionAlignment } from '../../types/lesson';
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles, Info } from 'lucide-react';
import { lessonService } from '../../services/api/lessonService';

interface AlignmentPanelProps {
  lessonId: string;
  initialAlignments: SectionAlignment[];
  onScrollToSection?: (sectionKey: string) => void;
}

export const AlignmentPanel: React.FC<AlignmentPanelProps> = ({
  lessonId,
  initialAlignments,
  onScrollToSection,
}) => {
  const [alignments, setAlignments] = useState<SectionAlignment[]>(initialAlignments);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');

  const handleRecheck = async () => {
    setIsChecking(true);
    try {
      const refreshed = await lessonService.checkAlignment(lessonId);
      setAlignments(refreshed);
      setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setIsChecking(false);
    }
  };

  const alignedCount = alignments.filter((a) => a.status === 'aligned').length;
  const reviewCount = alignments.filter((a) => a.status === 'needs_review').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Learning Objective Alignment
              </h3>
              <p className="text-[11px] text-slate-500">
                Curriculum pedagogical consistency
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRecheck}
            disabled={isChecking}
            title="Re-run Alignment Analysis"
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-slate-200 shadow-subtle transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Status Pills (NO numerical score!) */}
        <div className="mt-3 flex items-center gap-2 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{alignedCount} Aligned</span>
          </div>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{reviewCount} Needs Review</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
              <span>0 Needs Review</span>
            </div>
          )}
        </div>
      </div>

      {/* Alignment Items List */}
      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[600px] p-2 space-y-1.5">
        {alignments.map((item) => {
          const isAligned = item.status === 'aligned';

          return (
            <div
              key={item.sectionKey}
              onClick={() => onScrollToSection && onScrollToSection(item.sectionKey)}
              className="p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {item.sectionTitle}
                </span>

                {isAligned ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span>✓</span>
                    <span>Aligned</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <span>○</span>
                    <span>Needs Review</span>
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
                {item.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Informative Development Note */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Development State:</span>{' '}
          Evaluated against active lesson objectives. Real-time Gemini check will hook here on backend release. Last checked {lastChecked}.
        </div>
      </div>
    </div>
  );
};
