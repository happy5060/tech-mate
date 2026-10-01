import React from 'react';
import { GenerationStage, GenerationStageId } from '../../types/lesson';
import { Sparkles, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { GENERATION_STAGES } from '../../services/api/lessonService';

interface GeneratingModalProps {
  currentStageId: GenerationStageId;
  subject: string;
  topic: string;
  classLevel: string;
  duration: string;
}

export const GeneratingModal: React.FC<GeneratingModalProps> = ({
  currentStageId,
  subject,
  topic,
  classLevel,
  duration,
}) => {
  const currentIdx = GENERATION_STAGES.findIndex((s) => s.id === currentStageId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-modal border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-bold">
              Synthesizing Lesson Package
            </h3>
            <p className="text-xs text-indigo-100 mt-1 max-w-sm mx-auto">
              Generative AI is crafting an aligned, 8-section pedagogical package tailored for your classroom.
            </p>
          </div>
        </div>

        {/* Lesson Scope Details */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="truncate max-w-[200px]">{topic || 'Lesson Topic'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span>{subject}</span>
            <span>•</span>
            <span>{classLevel}</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Pedagogical Pipeline Stages (No fake % numbers!) */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pedagogical Generation Pipeline
          </div>

          <div className="space-y-3">
            {GENERATION_STAGES.map((stage, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isUpcoming = idx > currentIdx;

              return (
                <div
                  key={stage.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-indigo-50/70 border-indigo-200 shadow-subtle'
                      : isPast
                      ? 'bg-slate-50/50 border-slate-200'
                      : 'border-transparent opacity-40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-indigo-950'
                          : isPast
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          This pipeline will connect directly to Gemini 2.0 Flash in the backend milestone.
        </div>
      </div>
    </div>
  );
};
